import { useState } from "react";
import { MapPin, Send, MessageSquare, User } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || !formData.name) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          subject: "",
          message: "",
        });

        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-24 md:h-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl">
            <MessageSquare className="text-white" size={24} />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-['Comic_Sans_MS']">
          Contact Us
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-['Comic_Sans_MS'] max-w-2xl md:max-w-3xl mx-auto px-4 md:px-0">
          Have a question or want to get in touch? Send us a message using the
          form below!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 font-['Comic_Sans_MS']">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-['Comic_Sans_MS'] mb-6 md:mb-8">
              We're here to help and answer any questions you might have. Feel
              free to reach out to us through any of these channels.
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-1">
                    Contact Form
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
                    Use the form to send us a message
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-1">
                    Location
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
                    College of Asia
                    <br />
                    Suclayin, Arayat, Pampanga
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-2">
                Response Time
              </h4>
              <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
                We typically respond to all inquiries within 24-48 hours during
                school days. For urgent matters, please visit the school office.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 font-['Comic_Sans_MS']">
              Send us a Message
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-['Comic_Sans_MS'] mb-6 md:mb-8">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Nickname Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm md:text-base font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="md:w-5 md:h-5" />
                    Nickname
                  </div>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your nickname"
                  className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS'] text-sm md:text-base"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm md:text-base font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="md:w-5 md:h-5" />
                    Subject
                  </div>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS'] text-sm md:text-base"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm md:text-base font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="md:w-5 md:h-5" />
                    Your Message
                  </div>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us what you'd like to discuss..."
                  rows={6}
                  className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 resize-none font-['Comic_Sans_MS'] text-sm md:text-base"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 md:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 md:py-4 px-6 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-['Comic_Sans_MS'] font-semibold text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
                      <span className="hidden sm:inline">
                        Sending Message...
                      </span>
                      <span className="sm:hidden">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} className="md:w-5 md:h-5" />
                      <span className="hidden sm:inline">Send Message</span>
                      <span className="sm:hidden">Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="mt-4 md:mt-6 p-4 bg-green-50 border border-green-200 rounded-lg md:rounded-xl">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <p className="font-medium font-['Comic_Sans_MS'] text-sm md:text-base">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mt-4 md:mt-6 p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl">
                <div className="flex items-center gap-2 text-red-800">
                  <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <p className="font-medium font-['Comic_Sans_MS'] text-sm md:text-base">
                    Failed to send message. Please try again.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 md:mt-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 font-['Comic_Sans_MS']">
            Need Immediate Help?
          </h3>
          <p className="text-gray-600 text-sm md:text-base font-['Comic_Sans_MS'] mb-3 md:mb-4">
            For urgent matters or technical issues, you can also:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                Visit the school office during hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                Contact your teacher or counselor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                Use the emergency contact system
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                Check our FAQ section first
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
