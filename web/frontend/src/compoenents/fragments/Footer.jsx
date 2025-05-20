import React from "react";
import { ArrowRight, Circle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#030521] border-t border-[#45426e]/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and status column */}
          <div className="space-y-6">
            <div className="text-4xl font-bold">Sentiview</div>

            <div className="flex items-center text-sm text-[#a2a1b7]">
              <Heart className="h-4 w-4 mr-2 text-red-600" />
              Sentiview honoring their innovation that empowers everyone to
              create effortlessly.
            </div>

            <div className="bg-[#221d21] rounded-md p-3 inline-block">
              <div className="flex items-center">
                <div className="ml-2">
                  <div className="flex items-center text-white">
                    <span className="text-[#ffcc85] text-xl font-bold">#1</span>
                    <span className="ml-1 text-sm font-bold">
                      Product of the Week
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#221d21] rounded-md p-3 flex items-center text-white">
              <Circle className="h-4 w-4 mr-2 text-[#33b17e] fill-[#33b17e]" />
              <span className="font-bold">All systems operation</span>
            </div>
          </div>

          {/* General links */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">General</h3>
            <ul className="space-y-3 text-[#a2a1b7]">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Sentiview
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Public Roadmap
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase">Resources</h3>
              <ul className="space-y-3 text-[#a2a1b7]">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tutorial Videos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sentiview Blog
                  </Link>
                </li>

                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    AI Tools Directory
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Write for Sentiview
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social and Partner Program */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase">Follow Us</h3>
              <ul className="space-y-3 text-[#a2a1b7]">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Discord <span className="ml-1 text-[#8c3bfc]">🎮</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    TikTok
                  </Link>
                </li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-sm font-bold mb-4 uppercase">
                Partner Program
              </h3>
              <p className="text-[#a2a1b7] mb-3">
                Earn up to 40% recurring commission
              </p>
              <Link
                href="#"
                className="text-[#8c3bfc] hover:text-[#9c4bfc] font-medium inline-flex items-center transition-colors"
              >
                Become a Partner <ArrowRight className="ml-1 h-4 w-4" />
              </Link>

              {/* Decorative curved line */}
              <div className="absolute right-0 -top-16 -z-10">
                <div className="w-32 h-64 border-l-4 border-t-4 rounded-tl-full border-[#8c3bfc]/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[#45426e]/30 flex flex-col md:flex-row justify-between items-center text-sm text-[#a2a1b7]">
          <div>© 2024 Sentiview, Inc. All rights reserved</div>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link href="#" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
