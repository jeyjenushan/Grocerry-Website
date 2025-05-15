import React from "react";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're here to help with any questions about our products, delivery, or
          your orders.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Contact Form Section */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="+1 (123) 456-7890"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="general">General Inquiry</option>
                <option value="order">Order Question</option>
                <option value="delivery">Delivery Issue</option>
                <option value="product">Product Question</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dull text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>


        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Other Ways to Reach Us
          </h2>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start">
            <div className="text-2xl mr-4">📞</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Phone Support
              </h3>
              <p className="text-gray-600">+1 (800) 123-4567</p>
              <p className="text-gray-600">Monday-Friday: 8am-8pm EST</p>
              <p className="text-gray-600">Saturday-Sunday: 9am-5pm EST</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start">
            <div className="text-2xl mr-4">✉️</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600">support@yourgrocerystore.com</p>
              <p className="text-gray-600">orders@yourgrocerystore.com</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start">
            <div className="text-2xl mr-4">📍</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Visit Our Store
              </h3>
              <p className="text-gray-600">123 Grocery Lane</p>
              <p className="text-gray-600">Freshville, FA 12345</p>
              <p className="text-gray-600">Store Hours: 7am-10pm Daily</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200 transition duration-300 text-center w-12 h-12 flex items-center justify-center"
                aria-label="Facebook"
              >
                <span className="text-xl">f</span>
              </a>
              <a
                href="#"
                className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition duration-300 text-center w-12 h-12 flex items-center justify-center"
                aria-label="Twitter"
              >
                <span className="text-xl">𝕏</span>
              </a>
              <a
                href="#"
                className="bg-pink-100 text-pink-600 p-3 rounded-full hover:bg-pink-200 transition duration-300 text-center w-12 h-12 flex items-center justify-center"
                aria-label="Instagram"
              >
                <span className="text-xl">📷</span>
              </a>
              <a
                href="#"
                className="bg-red-100 text-red-600 p-3 rounded-full hover:bg-red-200 transition duration-300 text-center w-12 h-12 flex items-center justify-center"
                aria-label="Pinterest"
              >
                <span className="text-xl">P</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
