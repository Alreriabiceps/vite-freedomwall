import { Heart, School, Users, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 font-['Comic_Sans_MS']">
              🗽 ECA Freedom Wall
            </h3>
            <p className="text-gray-300 mb-4 font-['Comic_Sans_MS']">
              A safe space for students to share thoughts, ideas, and connect
              with their school community.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <Heart size={16} className="text-red-400" />
              <span className="text-sm font-['Comic_Sans_MS']">
                Made with love for ECA students
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-['Comic_Sans_MS']">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS']"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/create"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS']"
                >
                  Write a Post
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors font-['Comic_Sans_MS']"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* School Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-['Comic_Sans_MS']">
              School Info
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <School size={16} />
                <span className="text-sm font-['Comic_Sans_MS']">
                  ECA School
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Users size={16} />
                <span className="text-sm font-['Comic_Sans_MS']">
                  Student Community
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Shield size={16} />
                <span className="text-sm font-['Comic_Sans_MS']">
                  Safe & Secure
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm font-['Comic_Sans_MS']">
            © 2025 ECA Freedom Wall. All rights reserved. |
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
