import React, { useEffect, useState } from "react";

/**
 * Navbar (glassmorphism + animations)
 * - Reads auth.user from localStorage and listens for "storage" and "authChange"
 * - Produces a glassy nav with subtle blur, entrance animation and mobile menu
 * - Keep behavior the same as your original implementation but styled to match the app's glass UI
 */

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth.user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onAuthChange() {
      try {
        const raw = localStorage.getItem("auth.user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    }

    onAuthChange();
    window.addEventListener("storage", onAuthChange);
    window.addEventListener("authChange", onAuthChange);

    return () => {
      window.removeEventListener("storage", onAuthChange);
      window.removeEventListener("authChange", onAuthChange);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.user");
    window.dispatchEvent(new Event("authChange"));
    setUser(null);
  }

  return (
    <header
      data-mounted={mounted}
      className={
        "fixed top-0 left-0 right-0 z-40 glass-nav transition-all " +
        (scrolled
          ? "glass-nav-scrolled shadow-sm border-b border-slate-100/40"
          : "glass-nav-top")
      }
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a href="/" className="flex items-center gap-3" aria-label="MERN Auth home">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-sky-600 text-white shadow-sm transform transition-transform duration-200 hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
              </svg>
            </span>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-slate-900 leading-tight">MERN Auth</div>
              <div className="text-xs text-slate-500 -mt-0.5">Secure sign-in</div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden sm:flex sm:items-center sm:gap-6" aria-label="Main">
            <a href="#features" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">
              Docs
            </a>
            <a href="#blog" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">
              Blog
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => (onOpenLogin ? onOpenLogin() : window.location.assign("/login"))}
                  className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign in
                </button>

                <button
                  onClick={() => (onOpenRegister ? onOpenRegister() : window.location.assign("/signup"))}
                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-sky-600 text-white text-sm font-medium shadow-sm hover:bg-sky-700 transition transform hover:-translate-y-0.5"
                >
                  Get started
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-2 py-1 rounded-md glass-user-card">
                  <span className="relative flex items-center">
                    <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse-fast shadow-sm inline-block" />
                    <span className="sr-only">Online</span>
                  </span>

                  <div className="text-sm text-slate-700 leading-tight">
                    <div className="font-medium">{user?.name || user?.email}</div>
                    <div className="text-xs text-slate-500 -mt-0.5">{user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="py-1 px-3 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="sm:hidden ml-1 inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span className="sr-only">Open main menu</span>
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - sliding panel */}
      <div
        id="mobile-menu"
        className={`sm:hidden border-t border-slate-100 overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out origin-top ${
          open ? "max-h-96 opacity-100 transform translate-y-0" : "max-h-0 opacity-0 transform -translate-y-2"
        }`}
        aria-hidden={!open}
      >
        <div className="px-4 pt-3 pb-4 space-y-1">
          <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 transition">
            Features
          </a>
          <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 transition">
            Pricing
          </a>
          <a href="#docs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 transition">
            Docs
          </a>
          <a href="#blog" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 transition">
            Blog
          </a>

          <div className="pt-2 border-t border-slate-100">
            {!user ? (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    if (onOpenLogin) onOpenLogin();
                    else window.location.assign("/login");
                  }}
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    if (onOpenRegister) onOpenRegister();
                    else window.location.assign("/signup");
                  }}
                  className="mt-2 block w-full text-center px-3 py-2 rounded-md bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
                >
                  Get started
                </button>
              </>
            ) : (
              <div className="px-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{user?.name || user?.email}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                  <span className="inline-block h-3 w-3 rounded-full bg-green-500 animate-pulse-fast" />
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-3 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}