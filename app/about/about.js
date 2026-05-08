export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">
      <div className="max-w-3xl bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold mb-4 text-center">
          About Us
        </h1>

        <p className="text-gray-600 mb-4">
          Welcome to <span className="font-semibold">PDFSnap</span> — your all-in-one platform for fast, secure, and free PDF tools.
        </p>

        <p className="text-gray-600 mb-4">
          Our mission is to make working with PDF files simple and accessible for everyone. Whether you want to merge, compress, split, or convert PDFs, we provide powerful tools that work directly in your browser — no installation required.
        </p>

        <p className="text-gray-600 mb-4">
          We also integrate modern AI features to help you summarize, understand, and extract insights from documents instantly. Our goal is to save your time and boost productivity.
        </p>

        <p className="text-gray-600 mb-4">
          At PDFSnap, we value your privacy. Your files are processed securely and are not stored permanently on our servers.
        </p>

        <p className="text-gray-600 mb-4">
          Whether you are a student, professional, or business owner — PDFSnap is built for you.
        </p>

        <div className="mt-6 text-center">
          <p className="font-semibold">Thanks for using PDFSnap ❤️</p>
        </div>

      </div>
    </div>
  );
}