import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/Register";

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO / Content - focused on authentication demo only */}
        <section
          className={
            "relative overflow-hidden py-16 sm:py-24 transition-all duration-700 ease-out " +
            (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
          }
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm mb-4">
                    Demo · Secure authentication
                  </span>

                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Authentication made simple for MERN apps
                  </h1>

                  <p className="mt-6 text-lg text-slate-600">
                    This demo focuses solely on authentication: sign up as a personal or company account,
                    sign in, and explore secure authentication flows. No job-recommendation or product content is shown here.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-sky-600 text-white font-medium shadow-lg hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 transition"
                    >
                      Sign in
                    </button>

                    <button
                      onClick={() => setIsRegisterOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-sm hover:shadow-md transition"
                    >
                      Create account
                    </button>
                  </div>

                  <div className="mt-6 text-sm text-slate-500">
                    Tip: Use the Create account flow to register either a personal or company account. All auth flows in this demo are focused on login and registration functionality.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative mx-auto w-full max-w-md">
                  <div className="transform transition-transform duration-700 ease-out hover:-translate-y-2">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-slate-500">Account type (demo)</div>
                          <div className="text-base font-semibold text-slate-800">Company / Personal</div>
                        </div>
                        <div className="text-xs text-white bg-green-600 px-2 py-1 rounded">Demo</div>
                      </div>

                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div>Users</div>
                          <div className="font-medium text-slate-800">Demo data</div>
                        </div>

                        <div className="mt-6">
                          <button
                            onClick={() => setIsLoginOpen(true)}
                            className="w-full py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
                          >
                            Sign in (demo)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-12 w-48 h-48 rounded-full bg-gradient-to-br from-sky-300 to-indigo-300 opacity-30 blur-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AUTH FEATURES (simple, relevant items only) */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">Fast sign-in</h3>
                <p className="mt-2 text-sm text-slate-600">Secure, hashed passwords and JWT-backed sessions.</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">Company & personal</h3>
                <p className="mt-2 text-sm text-slate-600">Register personal or company accounts; manage basic demo data.</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">Privacy-first</h3>
                <p className="mt-2 text-sm text-slate-600">Demonstrates secure defaults suitable for production hardening later.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Modals (use your existing components) */}
        {isLoginOpen && (
          <Login
            onClose={() => setIsLoginOpen(false)}
            onOpenRegister={() => {
              setIsLoginOpen(false);
              setTimeout(() => setIsRegisterOpen(true), 140);
            }}
          />
        )}

        {isRegisterOpen && (
          <Register
            onClose={() => setIsRegisterOpen(false)}
            onOpenLogin={() => {
              setIsRegisterOpen(false);
              setTimeout(() => setIsLoginOpen(true), 140);
            }}
          />
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} MERN Auth — Authentication demo
      </footer>

      <style jsx>{`
        /* subtle entrance for hero blocks */
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        section[style] > div > div {
          animation: fadeUp 520ms ease forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .transition, .transition-all, .transition-transform {
            transition: none !important;
          }
          .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}