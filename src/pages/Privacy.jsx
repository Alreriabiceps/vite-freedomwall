import { Lock, Eye, Shield, Database, Users } from "lucide-react";

function Privacy() {
  return (
    <div className="w-full max-w-4xl mx-auto pt-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-24 h-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Lock className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg font-['Comic_Sans_MS'] max-w-3xl mx-auto">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>
      </div>

      {/* Privacy Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <Database size={16} />
                  Content Data
                </h3>
                <ul className="list-disc list-inside text-blue-800 text-sm space-y-1 font-['Comic_Sans_MS']">
                  <li>Posts and comments you create</li>
                  <li>Contact form submissions</li>
                  <li>Report submissions</li>
                  <li>User preferences</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <Eye size={16} />
                  Usage Data
                </h3>
                <ul className="list-disc list-inside text-green-800 text-sm space-y-1 font-['Comic_Sans_MS']">
                  <li>Pages visited</li>
                  <li>Time spent on site</li>
                  <li>Features used</li>
                  <li>Device information</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              We use the collected information for the following purposes:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <ul className="list-disc list-inside text-gray-700 space-y-2 font-['Comic_Sans_MS']">
                <li>
                  <strong>Platform Operation:</strong> To provide and maintain
                  IS Freedom Wall services
                </li>
                <li>
                  <strong>Content Moderation:</strong> To review and moderate
                  user-generated content
                </li>
                <li>
                  <strong>User Support:</strong> To respond to your questions
                  and provide assistance
                </li>
                <li>
                  <strong>Improvements:</strong> To analyze usage patterns and
                  improve our platform
                </li>
                <li>
                  <strong>Security:</strong> To protect against abuse and ensure
                  platform safety
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Information Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties. Your anonymity is protected and we
              will never share your personal data with anyone, including school
              administrators or other parties.
            </p>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2 font-['Comic_Sans_MS']">
                Your Anonymity is Protected:
              </h3>
              <ul className="list-disc list-inside text-green-800 text-sm space-y-1 font-['Comic_Sans_MS']">
                <li>No personal data is ever shared with third parties</li>
                <li>
                  School administrators cannot access your personal information
                </li>
                <li>Your posts remain completely anonymous</li>
                <li>We do not track your identity across sessions</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              We implement appropriate security measures to protect your
              information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Shield className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm font-['Comic_Sans_MS']">
                  Encryption
                </h3>
                <p className="text-gray-600 text-xs font-['Comic_Sans_MS']">
                  Data encrypted in transit and at rest
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Lock className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm font-['Comic_Sans_MS']">
                  Access Control
                </h3>
                <p className="text-gray-600 text-xs font-['Comic_Sans_MS']">
                  Limited access to authorized personnel
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm font-['Comic_Sans_MS']">
                  Monitoring
                </h3>
                <p className="text-gray-600 text-xs font-['Comic_Sans_MS']">
                  Regular security audits and monitoring
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Anonymous Platform
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              IS Freedom Wall is designed as an anonymous platform where your
              privacy is guaranteed:
            </p>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <ul className="list-disc list-inside text-blue-800 space-y-2 font-['Comic_Sans_MS']">
                <li>
                  <strong>No Personal Identification:</strong> We do not collect
                  names, addresses, or personal identifiers
                </li>
                <li>
                  <strong>Anonymous Posts:</strong> All content is posted
                  anonymously without user identification
                </li>
                <li>
                  <strong>No User Accounts:</strong> We don't require
                  registration or personal information
                </li>
                <li>
                  <strong>Session Independence:</strong> Each visit is treated
                  independently with no tracking
                </li>
                <li>
                  <strong>Complete Privacy:</strong> Your identity is never
                  revealed to other users or administrators
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              We use essential cookies to maintain platform functionality and
              improve user experience. These cookies do not track your activity
              across other websites and are necessary for the platform to work
              properly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              IS Freedom Wall is designed for school students and complies with
              applicable children's privacy laws. Since we do not collect
              personal information, children's privacy is inherently protected.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              We may update this Privacy Policy from time to time. We will
              notify users of any material changes and update the "Last Updated"
              date at the bottom of this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us through our Contact page.
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
          <p className="text-gray-300 font-['Comic_Sans_MS']">
            <strong>Last Updated:</strong> January 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
