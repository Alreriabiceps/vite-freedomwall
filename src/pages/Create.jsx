import { useState } from "react";
import { PenTool, Send, User, MessageSquare } from "lucide-react";

function Create() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("http://localhost:5000/api/v1/posts", {
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <div className="mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-24 md:h-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl">
            <PenTool className="text-white" size={24} />
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
              className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS'] text-sm md:text-base"
              maxLength={50}
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
              placeholder="Share your thoughts, ideas, or experiences..."
              rows={6}
              className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 resize-none font-['Comic_Sans_MS'] text-sm md:text-base"
              maxLength={1000}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs md:text-sm text-gray-500 font-['Comic_Sans_MS']">
                {formData.message.length}/1000 characters
              </span>
              <span className="text-xs md:text-sm text-gray-500 font-['Comic_Sans_MS']">
                {formData.message.length > 800 ? "Almost there!" : ""}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 md:pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 md:py-4 px-6 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-['Comic_Sans_MS'] font-semibold text-sm md:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
                  <span className="hidden sm:inline">Creating Post...</span>
                  <span className="sm:hidden">Creating...</span>
                </>
              ) : (
                <>
                  <Send size={16} className="md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Create Post</span>
                  <span className="sm:hidden">Post</span>
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
                Post created successfully! Your message is now live on the
                Freedom Wall.
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
                Failed to create post. Please try again.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="mt-6 md:mt-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 font-['Comic_Sans_MS']">
            Posting Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                Be respectful and kind
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                Share constructive thoughts
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                No hate speech or bullying
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                No personal attacks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
