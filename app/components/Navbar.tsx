"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "thirdweb/react";
import { arbitrumSepolia } from "thirdweb/chains";
import { client } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathName = usePathname();
  const { user } = useUser();
  const router = useRouter();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">
              CrystanFusion
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/order"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Order
            </Link>
            <Link
              href="/track"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Track Product
            </Link>

            {/* {!user && <SignIn />} */}
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>

            {pathName.startsWith("/admin") && (
              <ConnectButton client={client} chain={arbitrumSepolia} />
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-slate-800" />
              ) : (
                <Menu className="h-6 w-6 text-slate-800" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4 animate-fade-in">
            <Link
              href="/"
              className="block text-slate-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              className="block text-slate-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/order"
              className="block text-slate-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Order
            </Link>
            <Link
              href="/track"
              className="block text-slate-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Track Product
            </Link>

            {/* {!user && <SignIn />} */}
            <Button
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
