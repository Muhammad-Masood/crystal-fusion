"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "thirdweb/react";
import { arbitrumSepolia } from "thirdweb/chains";
import { client } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">
              CrystalFusion
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {!isAdmin && (
              <>
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
              </>
            )}

            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => router.push("/sign-in")}
              >
                Login
              </Button>
            )}

            {isAdmin && (
              <ConnectButton client={client} chain={arbitrumSepolia} />
            )}
          </div>

          {/* Mobile Menu Button */}
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
          <div className="md:hidden mt-2 space-y-3 pb-4 px-2">
            {!isAdmin && (
              <>
                <Link
                  href="/"
                  className="block py-2 px-3 rounded text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#how-it-works"
                  className="block py-2 px-3 rounded text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/order"
                  className="block py-2 px-3 rounded text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Order
                </Link>
                <Link
                  href="/track"
                  className="block py-2 px-3 rounded text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Track Product
                </Link>
              </>
            )}

            {isSignedIn ? (
              <div className="px-3">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/sign-in");
                }}
              >
                Login
              </Button>
            )}

            {isAdmin && (
              <div className="pt-3 px-3">
                <ConnectButton client={client} chain={arbitrumSepolia} />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
