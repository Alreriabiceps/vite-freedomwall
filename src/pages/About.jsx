import {
  Heart,
  Users,
  Shield,
  MessageCircle,
  PenTool,
  Globe,
} from "lucide-react";

function About() {
  return (
    <div className="w-full max-w-4xl mx-auto pt-6">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-24 md:h-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl">
            <Heart className="text-white" size={24} />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-['Comic_Sans_MS']">
          About IS Freedom Wall
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-['Comic_Sans_MS'] max-w-2xl md:max-w-3xl mx-auto px-4 md:px-0">
          A safe, anonymous space for students to express themselves and connect
          with their school community.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 font-['Comic_Sans_MS']">
          Our Mission
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base font-['Comic_Sans_MS'] mb-4 md:mb-6">
          IS Freedom Wall was created to provide students with a platform where
          they can freely express their thoughts, share experiences, and connect
          with peers in a safe, anonymous environment. We believe that every
          student deserves a voice and that open communication fosters a
          stronger school community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS']">
              Safe Space
            </h3>
            <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
              Anonymous expression without fear
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS']">
              Community
            </h3>
            <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
              Connect with fellow students
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Shield className="w-8 h-8 md:w-10 md:h-10 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS']">
              Protected
            </h3>
            <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
              Content moderation for safety
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 font-['Comic_Sans_MS']">
          Key Features
        </h2>
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <PenTool className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-1">
                Anonymous Posting
              </h3>
              <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
                Share your thoughts without revealing your identity. Your
                privacy is our priority.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-1">
                Community Interaction
              </h3>
              <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
                Like, comment, and engage with posts from your school community.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-1">
                Content Moderation
              </h3>
              <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
                Built-in reporting system and content filtering to maintain a
                safe environment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-1">
                Accessible Design
              </h3>
              <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
                Mobile-friendly interface that works on all devices, anytime,
                anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 font-['Comic_Sans_MS']">
          Community Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-green-50 p-4 md:p-5 rounded-xl border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 md:mb-4 font-['Comic_Sans_MS'] text-sm md:text-base">
              ✅ What We Encourage
            </h3>
            <ul className="space-y-2 text-xs md:text-sm font-['Comic_Sans_MS']">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-green-800">
                  Respectful discussions and debates
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-green-800">
                  Constructive feedback and suggestions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-green-800">
                  School-related topics and experiences
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-green-800">
                  Positive community building
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 md:p-5 rounded-xl border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3 md:mb-4 font-['Comic_Sans_MS'] text-sm md:text-base">
              ❌ What We Don't Allow
            </h3>
            <ul className="space-y-2 text-xs md:text-sm font-['Comic_Sans_MS']">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-red-800">
                  Hate speech or discrimination
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-red-800">
                  Personal attacks or bullying
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-red-800">
                  Inappropriate or offensive content
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-red-800">Spam or advertising</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 font-['Comic_Sans_MS']">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-xl font-bold font-['Comic_Sans_MS']">
              1
            </div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-2">
              Write Your Post
            </h3>
            <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
              Share your thoughts, ideas, or experiences anonymously
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-xl font-bold font-['Comic_Sans_MS']">
              2
            </div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-2">
              Connect & Engage
            </h3>
            <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
              Interact with posts from your school community
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-xl font-bold font-['Comic_Sans_MS']">
              3
            </div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS'] mb-2">
              Build Community
            </h3>
            <p className="text-gray-600 text-xs md:text-sm font-['Comic_Sans_MS']">
              Help create a stronger, more connected school
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 font-['Comic_Sans_MS']">
            Ready to Join the Conversation?
          </h3>
          <p className="text-gray-300 mb-4 md:mb-6 font-['Comic_Sans_MS'] text-sm md:text-base max-w-2xl mx-auto px-4 md:px-0">
            Start sharing your thoughts and connecting with your school
            community today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a
              href="/create"
              className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl transition-colors transform hover:scale-105 inline-flex items-center gap-2 font-['Comic_Sans_MS'] font-semibold text-sm md:text-base"
            >
              <PenTool size={16} className="md:w-5 md:h-5" />
              Write a Post
            </a>
            <a
              href="/"
              className="border border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-xl transition-colors transform hover:scale-105 inline-flex items-center gap-2 font-['Comic_Sans_MS'] font-semibold text-sm md:text-base"
            >
              <MessageCircle size={16} className="md:w-5 md:h-5" />
              View Posts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
