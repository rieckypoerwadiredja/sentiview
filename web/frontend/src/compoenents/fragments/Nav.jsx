import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Nav() {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const productRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setIsProductOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
      <div className="flex h-16 items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-semibold text-[#030521] flex gap-x-2"
        >
          <img className="max-w-8" src="/logo/sentiview.png" alt="Logo" />
          Sentiview
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/sentiview-ai"
            className="text-sm font-medium text-[#17134A]"
          >
            ✨ Sentiview AI
          </Link>
          <div className="relative" ref={productRef}>
            <button
              onClick={() => setIsProductOpen(!isProductOpen)}
              className="flex items-center text-sm font-medium text-[#17134A]"
            >
              Product
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {isProductOpen && (
              <div className="absolute left-0 mt-2 w-40 rounded-md bg-white shadow-lg z-30">
                <div className="py-2">
                  <Link
                    to="/sentence"
                    className="block px-4 py-2 text-sm text-[#17134A] hover:bg-gray-100"
                  >
                    Check Sentence
                  </Link>
                  <Link
                    to="/sentiview-ecommerce"
                    className="block px-4 py-2 text-sm text-[#17134A] hover:bg-gray-100"
                  >
                    BetBuy
                  </Link>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-[#17134A] hover:bg-gray-100"
                  >
                    Integrations
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link to="#" className="text-sm font-medium text-[#17134A]">
            Pricing
          </Link>
        </div>

        {/* Right buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="#" className="text-sm font-medium text-[#3A30BA]">
            Login
          </Link>
          <Link
            to="#"
            className="rounded-md border border-[#3A30BA] px-4 py-2 text-sm font-medium text-[#3A30BA]"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#17134A]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40">
          <div className="flex flex-col px-4 py-4 space-y-2">
            <Link
              to="/sentiview-ai"
              className="text-sm font-medium text-[#17134A] px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ✨ Sentiview AI
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsProductOpen(!isProductOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-[#17134A] px-4 py-2"
              >
                Product
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isProductOpen && (
                <div className="mt-2 rounded-md bg-white shadow z-50">
                  <div className="py-2">
                    <Link
                      to="/sentence"
                      className="block px-4 py-2 text-sm text-[#17134A] hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Soon
                    </Link>
                    <Link
                      to="/sentiview-ecommerce"
                      className="block px-4 py-2 text-sm text-[#17134A] hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Soon
                    </Link>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-[#17134A] hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Soon
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="#"
              className="text-sm font-medium text-[#17134A] px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="#"
              className="rounded-md border border-[#3A30BA] px-4 py-2 text-sm text-center font-medium text-[#3A30BA]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="#"
              className="rounded-md border bg-[#3A30BA] px-4 py-2 text-sm text-center font-medium text-[#FFFFFF]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
