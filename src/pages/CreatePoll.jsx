import { useState } from "react";
import { BarChart3, Plus, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");
  const [topics, setTopics] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!question.trim()) {
      setError("Question is required");
      return;
    }

    if (options.filter((opt) => opt.trim()).length < 2) {
      setError("At least 2 options are required");
      return;
    }

    if (options.some((opt) => opt.trim().length > 100)) {
      setError("Options cannot exceed 100 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const pollData = {
        question: question.trim(),
        options: options.filter((opt) => opt.trim()),
        expiresAt: expiresAt || null,
        topics: topics
          ? topics
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t)
          : [],
        name: "Anonymous", // Always anonymous for polls
      };

      const response = await fetch(API_ENDPOINTS.POLLS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      if (response.ok) {
        // Redirect to home page and show polls
        navigate("/?showPolls=true");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create poll");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      setError("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors font-['Comic_Sans_MS']"
          >
            <ArrowLeft size={20} />
            Back to Freedom Wall
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-['Comic_Sans_MS']">
              Create a Poll
            </h1>
          </div>

          <p className="text-gray-600 font-['Comic_Sans_MS']">
            Ask your school community a question and see what they think!
          </p>
        </div>

        {/* Poll Creation Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS']">
                What's your question? *
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What's your favorite cafeteria food?"
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-['Comic_Sans_MS'] text-base"
                required
              />
              <div className="flex justify-end mt-1">
                <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                  {question.length}/200 characters
                </span>
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS']">
                Poll Options *
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      maxLength={100}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Comic_Sans_MS'] text-base"
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium font-['Comic_Sans_MS']"
                >
                  <Plus size={20} />
                  Add Option
                </button>
              )}

              <p className="text-sm text-gray-500 mt-2 font-['Comic_Sans_MS']">
                Minimum 2 options, maximum 6 options
              </p>
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS']">
                When should this poll expire? (Optional)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Comic_Sans_MS'] text-base"
              />
              <p className="text-sm text-gray-500 mt-2 font-['Comic_Sans_MS']">
                Leave empty for no expiration
              </p>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS']">
                Related Topics (Optional)
              </label>
              <input
                type="text"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="e.g., food, cafeteria, school life"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Comic_Sans_MS'] text-base"
              />
              <p className="text-sm text-gray-500 mt-2 font-['Comic_Sans_MS']">
                Separate multiple topics with commas
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 font-['Comic_Sans_MS']">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Comic_Sans_MS'] font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Comic_Sans_MS'] font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Poll...
                  </>
                ) : (
                  <>
                    <BarChart3 size={18} />
                    Create Poll
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2 font-['Comic_Sans_MS']">
            How it works:
          </h3>
          <ul className="text-blue-800 text-sm space-y-1 font-['Comic_Sans_MS']">
            <li>• Your poll will be completely anonymous</li>
            <li>• Students can vote once per poll</li>
            <li>• Results are shown in real-time</li>
            <li>• Popular polls stay visible longer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CreatePoll;
