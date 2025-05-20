import React from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#030521]">
          Sentiview
        </Link>
        <div className="flex items-center">
          <nav className="ml-10 hidden space-x-8 md:flex">
            <Link
              href="#"
              className="flex items-center text-sm font-medium text-[#17134A]"
            >
              ✨ Sentiview AI
            </Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-[#17134A]">
                Product
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <Link href="#" className="text-sm font-medium text-[#17134A]">
              Templates
            </Link>
            <Link href="#" className="text-sm font-medium text-[#17134A]">
              Pricing
            </Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-[#17134A]">
                Resources
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
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
