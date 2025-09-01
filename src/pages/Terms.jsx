import { FileText, Shield, AlertTriangle } from "lucide-react";

function Terms() {
  return (
    <div className="w-full max-w-4xl mx-auto pt-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-24 h-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FileText className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 text-lg font-['Comic_Sans_MS'] max-w-3xl mx-auto">
          Please read these terms and conditions carefully before using IS
          Freedom Wall.
        </p>
      </div>

      {/* Terms Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              By accessing and using IS Freedom Wall, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Use License
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              Permission is granted to temporarily access IS Freedom Wall for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2 font-['Comic_Sans_MS']">
                You must not:
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 font-['Comic_Sans_MS']">
                <li>Use the materials for any commercial purpose</li>
                <li>
                  Attempt to reverse engineer any software on IS Freedom Wall
                </li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              User Conduct
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS'] mb-4">
              Users are responsible for all content they post and must follow
              these guidelines:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <Shield size={16} />
                  Allowed
                </h3>
                <ul className="list-disc list-inside text-green-800 text-sm space-y-1 font-['Comic_Sans_MS']">
                  <li>Respectful discussions</li>
                  <li>Constructive feedback</li>
                  <li>School-related topics</li>
                  <li>Positive community building</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2 font-['Comic_Sans_MS'] flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Prohibited
                </h3>
                <ul className="list-disc list-inside text-red-800 text-sm space-y-1 font-['Comic_Sans_MS']">
                  <li>Hate speech or bullying</li>
                  <li>Personal attacks</li>
                  <li>Inappropriate content</li>
                  <li>Spam or advertising</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Content Moderation
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              IS Freedom Wall reserves the right to monitor, edit, or remove any
              content that violates these terms. Users may report inappropriate
              content, and administrators will review reports promptly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Privacy & Data
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              Your privacy is important to us. Please review our Privacy Policy
              to understand how we collect, use, and protect your information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Termination
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              We may terminate or suspend access to IS Freedom Wall immediately,
              without prior notice, for any conduct that we believe violates
              these Terms & Conditions or is harmful to other users or the
              platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              IS Freedom Wall reserves the right to modify these terms at any
              time. Users will be notified of any changes, and continued use of
              the platform constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Comic_Sans_MS']">
              If you have any questions about these Terms & Conditions, please
              contact us through our Contact page.
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

export default Terms;
