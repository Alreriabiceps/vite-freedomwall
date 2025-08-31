import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

function DisclaimerAgreement({ onAgree }) {
  const [hasReadDisclaimer, setHasReadDisclaimer] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Check if user has already agreed
  useEffect(() => {
    const hasAgreed = localStorage.getItem("disclaimerAgreed");
    if (hasAgreed === "true") {
      onAgree();
    }
  }, [onAgree]);

  const handleAgree = () => {
    if (hasReadDisclaimer && hasReadTerms) {
      localStorage.setItem("disclaimerAgreed", "true");
      setAgreed(true);
      setTimeout(() => {
        onAgree();
      }, 1000);
    }
  };

  const handleDisagree = () => {
    // Redirect to a safe page or show message
    alert("You must agree to the terms and conditions to use IS Freedom Wall.");
  };

  const nextStep = () => {
    if (showDisclaimer) {
      setShowDisclaimer(false);
      setShowTerms(true);
    }
  };

  const prevStep = () => {
    if (showTerms) {
      setShowTerms(false);
      setShowDisclaimer(true);
    }
  };

  if (agreed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 sm:w-24 sm:h-24 text-green-500 mx-auto mb-4 sm:mb-6 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3 sm:mb-4 font-['Comic_Sans_MS']">
            Welcome to IS Freedom Wall!
          </h2>
          <p className="text-green-700 text-base sm:text-lg font-['Comic_Sans_MS']">
            Redirecting you to the main website...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200 overflow-hidden mx-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6 md:p-8 text-center">
          <div className="w-16 h-12 sm:w-20 sm:h-16 md:w-20 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-['Comic_Sans_MS']">
            Welcome to IS Freedom Wall
          </h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg font-['Comic_Sans_MS']">
            Before you can access our platform, please read and agree to our
            important notices
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <div
              className={`flex items-center ${
                showDisclaimer ? "text-blue-600" : "text-green-600"
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                  showDisclaimer
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-green-600 bg-green-600 text-white"
                }`}
              >
                {showDisclaimer ? (
                  <span className="text-xs sm:text-sm font-bold">1</span>
                ) : (
                  <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                )}
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold">
                Disclaimer
              </span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center ${
                showTerms ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                  showTerms
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-gray-300 text-gray-500"
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">2</span>
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold">
                Terms
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 max-h-80 sm:max-h-96 overflow-y-auto">
          {showDisclaimer && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl border border-yellow-200">
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-900 mb-3 sm:mb-4 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
                  Important Disclaimer
                </h2>
                <p className="text-yellow-800 leading-relaxed font-['Comic_Sans_MS'] mb-3 sm:mb-4 text-sm sm:text-base">
                  IS Freedom Wall is a platform for student expression and
                  community building. Please read this important information
                  carefully:
                </p>
                <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg">
                  <ul className="list-disc list-inside text-yellow-800 space-y-1.5 sm:space-y-2 font-['Comic_Sans_MS'] text-xs sm:text-sm">
                    <li>
                      <strong>User-Generated Content:</strong> All posts and
                      comments are created by users
                    </li>
                    <li>
                      <strong>No Endorsement:</strong> We do not verify or
                      validate user content
                    </li>
                    <li>
                      <strong>Educational Purpose:</strong> This platform is for
                      school community use only
                    </li>
                    <li>
                      <strong>Content Moderation:</strong> We provide tools but
                      cannot guarantee 100% safety
                    </li>
                    <li>
                      <strong>User Responsibility:</strong> You are responsible
                      for your own content and behavior
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2 sm:mb-3 font-['Comic_Sans_MS']">
                  What This Means for You
                </h3>
                <p className="text-blue-800 leading-relaxed font-['Comic_Sans_MS'] text-sm sm:text-base">
                  By using IS Freedom Wall, you understand that you're entering
                  a space where content is created by students like you. We
                  encourage respectful, constructive discussions while
                  maintaining a safe environment for everyone.
                </p>
              </div>
            </div>
          )}

          {showTerms && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-indigo-50 p-4 sm:p-6 rounded-xl border border-indigo-200">
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-3 sm:mb-4 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <FileText size={20} className="sm:w-6 sm:h-6" />
                  Terms & Conditions
                </h2>
                <p className="text-indigo-800 leading-relaxed font-['Comic_Sans_MS'] mb-3 sm:mb-4 text-sm sm:text-base">
                  By using IS Freedom Wall, you agree to these terms:
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-2 font-['Comic_Sans_MS'] text-sm sm:text-base">
                      ✅ You Must:
                    </h4>
                    <ul className="list-disc list-inside text-indigo-800 space-y-1 font-['Comic_Sans_MS'] text-xs sm:text-sm">
                      <li>Be respectful and constructive in your posts</li>
                      <li>Follow school policies and community guidelines</li>
                      <li>Report inappropriate content when you see it</li>
                      <li>Protect your privacy and others' privacy</li>
                      <li>Use critical thinking when reading content</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-2 font-['Comic_Sans_MS'] text-sm sm:text-base">
                      ❌ You Must NOT:
                    </h4>
                    <ul className="list-disc list-inside text-indigo-800 space-y-1 font-['Comic_Sans_MS'] text-xs sm:text-sm">
                      <li>Post hate speech, bullying, or harmful content</li>
                      <li>
                        Share personal information about yourself or others
                      </li>
                      <li>Spam or advertise commercial content</li>
                      <li>Attempt to hack or disrupt the platform</li>
                      <li>Use the platform for non-educational purposes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2 sm:mb-3 font-['Comic_Sans_MS']">
                  Your Rights & Protections
                </h3>
                <p className="text-green-800 leading-relaxed font-['Comic_Sans_MS'] text-sm sm:text-base">
                  We provide content moderation tools, reporting mechanisms, and
                  administrative oversight to help maintain a safe environment.
                  Your safety and positive experience are our priorities.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            {showDisclaimer ? (
              <button
                onClick={nextStep}
                disabled={!hasReadDisclaimer}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors font-['Comic_Sans_MS'] flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Next: Terms & Conditions
                <FileText size={18} className="sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={prevStep}
                className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors font-['Comic_Sans_MS'] text-sm sm:text-base"
              >
                ← Back to Disclaimer
              </button>
            )}

            {showTerms && (
              <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleDisagree}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors font-['Comic_Sans_MS'] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <XCircle size={18} className="sm:w-5 sm:h-5" />
                  Disagree
                </button>
                <button
                  onClick={handleAgree}
                  disabled={!hasReadDisclaimer || !hasReadTerms}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors font-['Comic_Sans_MS'] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <CheckCircle size={18} className="sm:w-5 sm:h-5" />I Agree
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:space-x-6 sm:flex-row sm:justify-center">
            <label className="flex items-start sm:items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReadDisclaimer}
                onChange={(e) => setHasReadDisclaimer(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5 sm:mt-0 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-700 font-['Comic_Sans_MS'] leading-tight">
                I have read and understood the Disclaimer
              </span>
            </label>

            <label className="flex items-start sm:items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReadTerms}
                onChange={(e) => setHasReadTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5 sm:mt-0 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-700 font-['Comic_Sans_MS'] leading-tight">
                I have read and agree to the Terms & Conditions
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisclaimerAgreement;
