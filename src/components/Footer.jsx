import { Heart, School, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-['Comic_Sans_MS']">
              🗽 IS Freedom Wall
            </h3>
            <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base font-['Comic_Sans_MS']">
              A safe space for IS students to share thoughts, ideas, and connect
              with their school community.
            </p>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Heart size={14} className="md:w-4 md:h-4 text-red-400" />
              <span className="text-xs md:text-sm font-['Comic_Sans_MS']">
                Made with love for IS students
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield size={14} className="md:w-4 md:h-4 text-blue-400" />
              <span className="text-xs md:text-sm font-['Comic_Sans_MS']">
                Your privacy and safety are our priority
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 font-['Comic_Sans_MS']">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
                >
                  Write a Post
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 font-['Comic_Sans_MS']">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* School Info */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 font-['Comic_Sans_MS']">
              School Info
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <School size={14} className="md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-['Comic_Sans_MS']">
                  IS School
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Users size={14} className="md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-['Comic_Sans_MS']">
                  Student Community
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 md:pt-8 text-center mt-6 md:mt-8">
          <p className="text-gray-400 text-xs md:text-sm font-['Comic_Sans_MS']">
            © 2025 IS Freedom Wall. All rights reserved. |
            <span className="text-gray-500">
              {" "}
              Designed for students, by students
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
