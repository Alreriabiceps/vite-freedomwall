import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Eye, EyeOff, CheckCircle } from "lucide-react";
import {
  censorFoulLanguage,
  containsFoulLanguage,
  getFoulLanguageStats,
} from "../utils/filipinoFilter";

const ContentFilter = ({
  value = "",
  onChange,
  placeholder = "Type your message...",
  maxLength = 1000,
  showPreview = true,
  showWarnings = true,
  className = "",
  disabled = false,
  onFoulLanguageDetected = null,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [censoredPreview, setCensoredPreview] = useState("");
  const [foulLanguageStats, setFoulLanguageStats] = useState({
    count: 0,
    categories: {},
  });
  const [showCensored, setShowCensored] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Real-time content analysis
  useEffect(() => {
    if (inputValue) {
      const censored = censorFoulLanguage(inputValue);
      const stats = getFoulLanguageStats(inputValue);

      setCensoredPreview(censored.censoredText);
      setFoulLanguageStats(stats);

      // Notify parent component if foul language is detected
      if (onFoulLanguageDetected && censored.hasFoulLanguage) {
        onFoulLanguageDetected({
          original: inputValue,
          censored: censored.censoredText,
          count: censored.censoredCount,
          stats: stats,
        });
      }
    } else {
      setCensoredPreview("");
      setFoulLanguageStats({ count: 0, categories: {} });
    }
  }, [inputValue, onFoulLanguageDetected]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);

    // Clear typing indicator after delay
    setTimeout(() => setIsTyping(false), 1000);

    // Call parent onChange with censored content
    if (onChange) {
      onChange(newValue);
    }
  };

  const getWarningLevel = () => {
    if (foulLanguageStats.count === 0) return "none";
    if (foulLanguageStats.count <= 2) return "low";
    if (foulLanguageStats.count <= 5) return "medium";
    return "high";
  };

  const getWarningColor = (level) => {
    switch (level) {
      case "low":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getWarningIcon = (level) => {
    switch (level) {
      case "low":
        return <AlertTriangle size={16} />;
      case "medium":
        return <AlertTriangle size={16} />;
      case "high":
        return <Shield size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  const getWarningMessage = (level) => {
    switch (level) {
      case "low":
        return "Mild language detected - will be censored";
      case "medium":
        return "Multiple foul words detected - content will be heavily censored";
      case "high":
        return "Heavy foul language detected - consider rewriting your message";
      default:
        return "Content looks good!";
    }
  };

  const warningLevel = getWarningLevel();

  return (
    <div className={`content-filter ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full p-3 md:p-4 border rounded-xl md:rounded-2xl resize-none transition-all duration-200 font-['Comic_Sans_MS'] text-sm md:text-base ${
            warningLevel === "high"
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : warningLevel === "medium"
              ? "border-orange-300 focus:border-orange-500 focus:ring-orange-200"
              : warningLevel === "low"
              ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          rows={4}
        />

        {/* Character Counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {inputValue.length}/{maxLength}
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Warning Message */}
      {showWarnings && warningLevel !== "none" && (
        <div
          className={`mt-3 p-3 rounded-lg border ${getWarningColor(
            warningLevel
          )} flex items-center gap-2`}
        >
          {getWarningIcon(warningLevel)}
          <span className="text-sm font-medium">
            {getWarningMessage(warningLevel)}
          </span>
        </div>
      )}

      {/* Foul Language Statistics */}
      {showWarnings && foulLanguageStats.count > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600">
            <strong>Detected:</strong> {foulLanguageStats.count} foul word
            {foulLanguageStats.count !== 1 ? "s" : ""}
            {Object.entries(foulLanguageStats.categories).map(
              ([category, count]) =>
                count > 0 ? ` • ${category}: ${count}` : ""
            )}
          </div>
        </div>
      )}

      {/* Censored Preview */}
      {showPreview && inputValue && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 font-['Comic_Sans_MS']">
              Preview (How your post will appear):
            </h4>
            <button
              onClick={() => setShowCensored(!showCensored)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showCensored ? <EyeOff size={14} /> : <Eye size={14} />}
              {showCensored ? "Hide" : "Show"} Censored
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            {showCensored ? (
              <div className="text-sm text-gray-700 font-['Comic_Sans_MS']">
                <span className="text-red-600 font-semibold">Censored:</span>{" "}
                {censoredPreview}
              </div>
            ) : (
              <div className="text-sm text-gray-700 font-['Comic_Sans_MS']">
                {inputValue}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Quality Score */}
      {inputValue && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Content Quality:
            <span
              className={`ml-1 font-semibold ${
                warningLevel === "none"
                  ? "text-green-600"
                  : warningLevel === "low"
                  ? "text-yellow-600"
                  : warningLevel === "medium"
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {warningLevel === "none"
                ? "Excellent"
                : warningLevel === "low"
                ? "Good"
                : warningLevel === "medium"
                ? "Fair"
                : "Poor"}
            </span>
          </div>

          {foulLanguageStats.count > 0 && (
            <div className="text-xs text-gray-500">
              <Shield size={12} className="inline mr-1" />
              {foulLanguageStats.count} word
              {foulLanguageStats.count !== 1 ? "s" : ""} will be censored
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentFilter;

