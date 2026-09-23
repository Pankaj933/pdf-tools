import crypto from "node:crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createAdminClient } from "../../../../lib/supabase/admin";

async function sendProductEmail(product, buyerEmail) {
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Gmail SMTP is not configured on the server.");
  }

  const supabase = createAdminClient();
  const { data: signedFile, error: signedUrlError } = await supabase.storage
    .from("study-materials")
    .createSignedUrl(product.file_path, 60 * 60 * 24 * 7, { download: true });

  if (signedUrlError || !signedFile?.signedUrl) {
    throw new Error("The product file could not be prepared for delivery.");
  }

  const fileResponse = await fetch(signedFile.signedUrl);
  if (!fileResponse.ok) {
    throw new Error("Unable to download the product file for email delivery.");
  }

  const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailResult = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: buyerEmail,
    subject: `Your PDF is ready: ${product.title}`,
    text: `Hi!\n\nYour payment was successful for ${product.title}.\nThe PDF file is attached to this email.\nIf you need any help, just reply to this email and we will assist you.\n\nThanks for shopping with PDFSnap.`,
    html: `
      <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;padding:32px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.08);border:1px solid #e2e8f0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:28px 32px;">
                    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#dbeafe;font-weight:700;">PDFSnap</div>
                    <h1 style="margin:10px 0 0;color:#ffffff;font-size:30px;line-height:1.2;font-weight:700;">Your download is ready</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px 18px;">
                    <p style="margin:0 0 12px;font-size:16px;color:#334155;">Hi there,</p>
                    <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:#475569;">
                      Your payment was successful for <strong style="color:#0f172a;">${product.title}</strong>.
                      The PDF file is attached below and is ready to download.
                    </p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                      <tr>
                        <td style="padding:20px 18px;">
                          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;font-weight:700;">Purchased item</div>
                          <div style="margin-top:10px;font-size:22px;font-weight:700;color:#0f172a;">${product.title}</div>
                          <div style="margin-top:8px;color:#475569;font-size:14px;line-height:1.6;">
                            Your file has been securely prepared and delivered to this email.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top:26px;padding:18px 20px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#1e3a8a;font-size:14px;line-height:1.6;">
                      Need help? Just reply to this email and our support team will be happy to assist you.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 30px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="padding-top:8px;">
                          <div style="display:inline-block;background:#2563eb;border-radius:10px;padding:14px 24px;font-size:15px;font-weight:700;text-align:center;">
                            <a href="mailto:support@pdfsnap.in" style="color:#ffffff;text-decoration:none;">Contact support</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #e2e8f0;padding:20px 32px 28px;background:#f8fafc;text-align:center;">
                    <p style="margin:0;color:#64748b;font-size:12px;line-height:1.7;">
                      Thank you for shopping with PDFSnap<br>
                      We’re here to make your PDFs simple, secure, and stress-free.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    attachments: [
      {
        filename: product.file_path.split("/").pop() || `${product.title}.pdf`,
        content: fileBuffer,
      },
    ],
  });

  if (!mailResult.messageId) {
    throw new Error("Email delivery failed.");
  }

  return true;
}

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      email,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Incomplete payment verification data." }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Product and buyer email are required." }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase is not configured on the server. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the environment." }, { status: 503 });
    }

    const supabase = createAdminClient();
    const { data: product, error: productError } = await supabase
      .from("study_material_products")
      .select("id, title, price, status, file_path")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Product lookup failed during verification:", { productId, productError });
      return NextResponse.json({ error: "Published product was not found." }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: "Published product was not found." }, { status: 404 });
    }

    const normalizedStatus = String(product.status || "").trim().toLowerCase();
    if (normalizedStatus !== "published") {
      return NextResponse.json({ error: "This product is not available for purchase yet. Please make sure it is published in the admin panel." }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Payment signature verification failed." }, { status: 400 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Order storage is not configured on the server." }, { status: 503 });
    }

    const buyerEmail = email.trim().toLowerCase();
    const { error: orderError } = await supabase.from("product_orders").insert({
      razorpay_order_id,
      razorpay_payment_id,
      product_id: product.id,
      buyer_email: buyerEmail,
      amount: Number(product.price) * 100,
      currency: "INR",
      status: "paid",
    });

    if (orderError && orderError.code !== "23505") {
      console.error("Save product order error:", orderError);
      return NextResponse.json({ error: "Payment verified, but order storage failed." }, { status: 500 });
    }

    let emailSent = false;
    let emailError = null;

    try {
      emailSent = await sendProductEmail(product, buyerEmail);
    } catch (deliveryError) {
      emailError = deliveryError.message || "Unable to deliver the product by email.";
      console.error("Product email delivery failed:", deliveryError);
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderSaved: true,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}