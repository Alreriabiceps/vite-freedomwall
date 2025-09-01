import { useState } from "react";
import { PenTool, Send, User, MessageSquare } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

function Create() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(API_ENDPOINTS.POSTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", message: "" });

        // Trigger event to refresh posts on home page
        window.dispatchEvent(new Event("postsModified"));

        // Reset status after 3 seconds
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error creating post:", error);
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
    <div className="w-full max-w-4xl mx-auto pt-6">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <div className="mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl">
            <PenTool
              className="text-white md:w-6 md:h-6 lg:w-8 lg:h-8"
              size={20}
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-['Comic_Sans_MS']">
          Create a Post
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-['Comic_Sans_MS'] max-w-2xl md:max-w-3xl mx-auto px-4 md:px-0">
          Share your thoughts anonymously with your school community.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm md:text-base font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
            >
              <div className="flex items-center gap-2">
                <User size={16} className="md:w-5 md:h-5" />
                Name (Optional)
              </div>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name or leave blank for anonymous"
              className="w-full p-3 md:p-4 border border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Comic_Sans_MS'] text-sm md:text-base transition-all duration-200"
            />
          </div>

          {/* Message Field with Content Filter */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm md:text-base font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="md:w-5 md:h-5" />
                Message
              </div>
            </label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Share your thoughts, questions, or experiences..."
              maxLength={2000}
              rows={6}
              className="w-full p-3 md:p-4 border border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Comic_Sans_MS'] text-sm md:text-base transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base transition-all duration-200 transform hover:scale-105 font-['Comic_Sans_MS'] ${
                isSubmitting || !formData.message.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send size={18} className="md:w-5 md:h-5" />
                  Post Message
                </>
              )}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {submitStatus && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              submitStatus === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {submitStatus === "success" ? (
                <>
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-medium">
                    Post created successfully!
                  </span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                  <span className="font-medium">
                    Failed to create post. Please try again.
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Create;
