"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold text-center mb-6">
          Contact Us
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Have questions, suggestions, or feedback? We'd love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">
              Your Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 font-medium">
              Message
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message..."
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Send Message
          </button>

        </form>

        {/* Extra Info */}
        <div className="mt-8 text-center text-gray-600">
          <p>Email: support@pdfsnap.in</p>
          <p className="mt-2">We usually reply within 24 hours.</p>
        </div>

      </div>
    </div>
  );
}