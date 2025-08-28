import { AlertTriangle, Shield, Users } from "lucide-react";

function Disclaimer() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-24 h-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <AlertTriangle className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
          Disclaimer
        </h1>
        <p className="text-gray-600 text-lg font-['Comic_Sans_MS'] max-w-3xl mx-auto">
          Important information about the use of IS Freedom Wall and the content
          shared on this platform.
        </p>
      </div>

      {/* Disclaimer Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="space-y-8">
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4 font-['Comic_Sans_MS'] flex items-center gap-2">
              <AlertTriangle size={24} />
              Important Notice
            </h2>
            <p className="text-yellow-800 leading-relaxed font-['Comic_Sans_MS']">
              This disclaimer contains important information about your use of
              IS Freedom Wall. Please read it carefully before using our
              platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Content Disclaimer
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              IS Freedom Wall is a platform for student expression and community
              building. Please note:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <ul className="list-disc list-inside text-gray-700 space-y-2 font-['Comic_Sans_MS']">
                <li>
                  <strong>User-Generated Content:</strong> All posts and
                  comments are created by users, not by IS Freedom Wall
                </li>
                <li>
                  <strong>No Endorsement:</strong> We do not endorse, verify, or
                  validate any user-generated content
                </li>
                <li>
                  <strong>Diverse Opinions:</strong> Content represents
                  individual user views and may not reflect school policies
                </li>
                <li>
                  <strong>Real-Time Updates:</strong> Content is posted in
                  real-time and may not be immediately reviewed
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Accuracy and Reliability
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              While we strive to maintain a safe and respectful environment:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <AlertTriangle size={16} />
                  We Cannot Guarantee
                </h3>
                <ul className="list-disc list-inside text-red-800 text-sm space-y-1 font-['Comic_Sans_MS']">
                  <li>100% accuracy of all content</li>
                  <li>Immediate removal of inappropriate posts</li>
                  <li>Complete protection from harmful content</li>
                  <li>Real-time content verification</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <Shield size={16} />
                  We Do Provide
                </h3>
                <ul className="list-disc list-inside text-green-800 text-sm space-y-1 font-['Comic_Sans_MS']">
                  <li>Content moderation tools</li>
                  <li>Report mechanisms</li>
                  <li>Community guidelines</li>
                  <li>Administrative oversight</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Educational Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              IS Freedom Wall is designed for educational and community-building
              purposes within the school environment. It is not intended to
              replace official school communication channels or serve as a
              source of verified information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              User Responsibility
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              Users of IS Freedom Wall are responsible for:
            </p>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <ul className="list-disc list-inside text-blue-800 space-y-2 font-['Comic_Sans_MS']">
                <li>
                  <strong>Content Accuracy:</strong> Ensuring the information
                  they share is truthful and accurate
                </li>
                <li>
                  <strong>Respectful Behavior:</strong> Maintaining respectful
                  and appropriate communication
                </li>
                <li>
                  <strong>Privacy Protection:</strong> Not sharing personal
                  information about themselves or others
                </li>
                <li>
                  <strong>Community Standards:</strong> Following established
                  community guidelines and school policies
                </li>
                <li>
                  <strong>Critical Thinking:</strong> Evaluating content
                  critically and not accepting everything as fact
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              IS Freedom Wall and its administrators are not liable for any
              damages, losses, or harm resulting from:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <ul className="list-disc list-inside text-gray-700 space-y-2 font-['Comic_Sans_MS']">
                <li>User-generated content posted on the platform</li>
                <li>Actions taken by users based on platform content</li>
                <li>Technical issues or platform downtime</li>
                <li>Misuse of the platform by users</li>
                <li>Content that may be offensive, inaccurate, or harmful</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              External Links
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              Users may share links to external websites or resources. IS
              Freedom Wall does not control, endorse, or take responsibility for
              the content, privacy policies, or practices of any third-party
              websites.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              School Policies
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              Use of IS Freedom Wall is subject to all applicable school
              policies, codes of conduct, and disciplinary procedures.
              Violations may result in platform access restrictions or school
              disciplinary action.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Reporting and Moderation
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              While we provide content moderation tools and administrative
              oversight, the effectiveness of these measures depends on user
              participation and reporting. Users are encouraged to report
              inappropriate content promptly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Changes to Disclaimer
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              This disclaimer may be updated periodically. Users will be
              notified of significant changes, and continued use of the platform
              constitutes acceptance of the updated disclaimer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              If you have questions about this disclaimer or concerns about
              platform content, please contact us through our Contact page or
              report inappropriate content using the platform's reporting tools.
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

export default Disclaimer;
