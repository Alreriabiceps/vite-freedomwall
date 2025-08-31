import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  TestTube,
  CheckCircle,
} from "lucide-react";
import ContentFilter from "../components/ContentFilter";
import {
  censorFoulLanguage,
  getFoulLanguageStats,
} from "../utils/filipinoFilter";

function FilterTest() {
  const [testText, setTestText] = useState("");
  const [censoredResult, setCensoredResult] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const handleTestFilter = () => {
    if (testText.trim()) {
      const censored = censorFoulLanguage(testText);
      const stats = getFoulLanguageStats(testText);
      setCensoredResult({ censored, stats });
    }
  };

  const sampleTexts = [
    "Gago ka talaga! Bobo ka rin!",
    "Tang ina mo, putang ina ka!",
    "Pangit ka, taba ka, walang kwenta ka!",
    "Walang kaibigan ka, hindi ka belong sa amin!",
    "Patayin kita, sasaktan kita!",
    "Hello, kamusta ka? Maganda ang araw ngayon!",
    "Put@ng ina, g4g0 ka, t4nga ka!",
    "Joke lang, biro lang, hindi seryoso!",
  ];

  const insertSampleText = (text) => {
    setTestText(text);
    setCensoredResult(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <TestTube className="text-white w-10 h-10 md:w-12 md:h-12" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
          Filipino Content Filter Test
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto font-['Comic_Sans_MS']">
          Test our Filipino foul language filter system. See how Tagalog and
          Kapampangan offensive content gets automatically censored with
          asterisks (*).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Filter Testing */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS'] flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Test the Filter
            </h2>

            <ContentFilter
              value={testText}
              onChange={setTestText}
              placeholder="Type or paste Filipino text to test the filter..."
              maxLength={500}
              showPreview={true}
              showWarnings={true}
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleTestFilter}
                disabled={!testText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Test Filter
              </button>
              <button
                onClick={() => {
                  setTestText("");
                  setCensoredResult(null);
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Sample Texts */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Sample Texts to Test
            </h3>
            <div className="space-y-2">
              {sampleTexts.map((text, index) => (
                <button
                  key={index}
                  onClick={() => insertSampleText(text)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700 transition-colors font-['Comic_Sans_MS']"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Censored Result */}
          {censoredResult && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Comic_Sans_MS'] flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Filter Results
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Original Text:
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg border text-sm text-gray-700 font-['Comic_Sans_MS']">
                    {testText}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Censored Text:
                  </h4>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-gray-700 font-['Comic_Sans_MS']">
                    <span className="text-red-600 font-semibold">
                      Censored:
                    </span>{" "}
                    {censoredResult.censored.censoredText}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {censoredResult.censored.censoredCount}
                    </div>
                    <div className="text-xs text-blue-700">Words Censored</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {censoredResult.censored.hasFoulLanguage ? "Yes" : "No"}
                    </div>
                    <div className="text-xs text-green-700">Foul Language</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          {censoredResult && censoredResult.stats.count > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Comic_Sans_MS'] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Language Analysis
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Total Foul Words:
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    {censoredResult.stats.count}
                  </span>
                </div>

                {Object.entries(censoredResult.stats.categories).map(
                  ([category, count]) =>
                    count > 0 && (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 capitalize">
                          {category}:
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {count}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Comic_Sans_MS'] flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              How the Filter Works
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Detects Tagalog and Kapampangan foul language in real-time
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Catches variations with numbers (@, 4, 0) and symbols
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Replaces offensive words with asterisks (*)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Provides instant feedback and preview</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Maintains community safety automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterTest;
