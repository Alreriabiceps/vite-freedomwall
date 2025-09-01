import { Coffee, Heart, Star } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "../components/AnimatedComponents";

function BuyMeACoffee() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pt-20 pb-8">
      <StaggerContainer>
        {/* Header Section */}
        <FadeIn delay={0.2} className="text-center mb-12">
          <StaggerItem className="mb-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Coffee size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-4">
              Buy Me a Kopi
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-['Comic_Sans_MS'] max-w-2xl mx-auto">
              If you enjoy using IS Freedom Wall and want to support its
              development, scan the QR code below! Any amount helps - even if
              it's just enough for a kopi peng! 🧊☕
            </p>
          </StaggerItem>
        </FadeIn>

        {/* QR Code Section */}
        <StaggerItem className="mb-12">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-6">
              Scan to Support
            </h2>

            <div className="mb-6">
              <img
                src="/qr.png"
                alt="Payment QR Code"
                className="w-64 h-64 mx-auto border-4 border-white shadow-lg rounded-lg"
              />
            </div>

            <p className="text-lg text-gray-700 font-['Comic_Sans_MS'] mb-4">
              Use your preferred payment app to scan the QR code above
            </p>

            <div className="bg-white rounded-xl p-4 inline-block">
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                💙 Your support means the world to us! Every contribution helps
                keep the project running! ☕
              </p>
            </div>
          </div>
        </StaggerItem>

        {/* Why Support Section */}
        <StaggerItem className="mb-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-6 text-center">
              Why Support IS Freedom Wall?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-['Comic_Sans_MS'] mb-2">
                  Built with Love (and Coffee)
                </h3>
                <p className="text-gray-600 font-['Comic_Sans_MS']">
                  Created with love to provide a safe space for students to
                  express themselves freely. Plus, coffee makes everything
                  better! ☕💕
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-['Comic_Sans_MS'] mb-2">
                  Always Free (Like Air!)
                </h3>
                <p className="text-gray-600 font-['Comic_Sans_MS']">
                  The platform will always remain free for students to use.
                  Because freedom shouldn't cost a thing! ✨
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-['Comic_Sans_MS'] mb-2">
                  Your Support = More Coffee
                </h3>
                <p className="text-gray-600 font-['Comic_Sans_MS']">
                  Every contribution helps improve the platform and keep it
                  running. More coffee = better code! 🚀☕
                </p>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Simple Message */}
        <StaggerItem>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-4">
              Thank You! 💙
            </h2>
            <p className="text-lg text-gray-700 font-['Comic_Sans_MS']">
              Your support means the world to us and helps keep IS Freedom Wall
              running smoothly for all students. You're basically our hero! 🦸‍♂️💪
            </p>
            <p className="text-base text-gray-600 font-['Comic_Sans_MS'] mt-4">
              Every kopi helps fuel new features and improvements! And keeps our
              caffeine levels dangerously high! ☕⚡
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}

export default BuyMeACoffee;
