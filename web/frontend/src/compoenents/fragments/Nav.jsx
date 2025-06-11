import React, { useState, useEffect, useRef } from "react";

import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function Nav() {
  const [isProductOpen, setIsProductOpen] = useState(false);
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
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-semibold text-[#030521] flex gap-x-2"
        >
          <img className="max-w-8" src="/logo/sentiview.png" /> Sentiview
        </Link>
        <div className="flex items-center">
          <nav className="ml-10 hidden space-x-8 md:flex">
            <Link
              to="/sentiview-ai"
              className="flex items-center text-sm font-medium text-[#17134A]"
            >
              ✨ Sentiview AI
            </Link>
            <div className="relative" ref={productRef}>
              <button
                onClick={() => setIsProductOpen(!isProductOpen)}
                className="flex items-center text-sm font-medium text-[#17134A] cursor-pointer"
              >
                Product
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isProductOpen && (
                <div className="absolute left-0 mt-2 w-40 rounded-md bg-white shadow-lg transition-all duration-200 ease-out z-20">
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

            <Link href="#" className="text-sm font-medium text-[#17134A]">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-sm font-medium text-[#3A30BA]">
            Login
          </Link>
          <Link
            href="#"
            className="rounded-md border border-[#3A30BA] px-4 py-2 text-sm font-medium text-[#3A30BA]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
