import React, { useEffect, useRef, useState } from "react";

/**
 * Enhanced Login modal:
 * - glass UI + entrance animation
 * - safe JSON fetch handling (safeFetchJson)
 * - floating labels, show/hide password, spinner, social buttons (placeholders)
 * - stores auth.token / auth.user and dispatches "authChange"
 *
 * Props:
 * - onClose()
 * - onOpenRegister()
 */

export default function Login({ onClose, onOpenRegister }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    // animate in
    requestAnimationFrame(() => setMounted(true));

    const previouslyFocused = document.activeElement;
    // trap focus and set initial focus
    firstInputRef.current?.focus();

    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setError("");
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    if (!values.email || !values.password) return "Please enter both email and password.";
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(values.email)) return "Please enter a valid email address.";
    return "";
  }

  // Safe fetch helper that always reads text and tries to parse JSON.
  async function safeFetchJson(res) {
    const text = await res.text();
    if (!text) return { parsed: null, raw: "" };
    try {
      return { parsed: JSON.parse(text), raw: text };
    } catch {
      return { parsed: null, raw: text };
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const vErr = validate();
    if (vErr) {
      setError(vErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const { parsed, raw } = await safeFetchJson(res);
      const serverMessage = parsed?.message || (raw ? raw : null);

      if (!res.ok) {
        throw new Error(serverMessage || `Login failed (${res.status})`);
      }

      if (!parsed) {
        throw new Error(`Server returned non-JSON success response: ${raw || "<empty body>"}`);
      }

      const { token, user } = parsed;
      if (!token) {
        throw new Error(parsed?.message || "No token returned from server");
      }

      localStorage.setItem("auth.token", token);
      if (user) localStorage.setItem("auth.user", JSON.stringify(user));
      else localStorage.setItem("auth.user", JSON.stringify({ email: values.email }));

      window.dispatchEvent(new Event("authChange"));

      setLoading(false);
      // nice micro-delay so the user sees the success state
      setMounted(false);
      setTimeout(() => onClose?.(), 160);
    } catch (err) {
      setLoading(false);
      setError(err?.message || String(err));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={() => {
          // animate out then close
          setMounted(false);
          setTimeout(onClose, 160);
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className={`relative w-full max-w-md glass-card rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 ease-out ${
          mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-3"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="login-title" className="text-2xl font-extrabold text-slate-900">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-slate-500">Sign in to continue to your dashboard</p>
          </div>

          <button
            onClick={() => {
              setMounted(false);
              setTimeout(onClose, 160);
            }}
            aria-label="Close dialog"
            className="ml-auto inline-flex p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded flex items-center gap-2">
              <span aria-hidden>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Social sign-in (placeholders) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 rounded-md border bg-white/60 hover:shadow-md transition"
              onClick={() => alert("Demo only: social sign-in not implemented")}
            >
              <img src="/icons/google.svg" alt="" className="w-4 h-4" />
              <span className="text-sm">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 rounded-md border bg-white/60 hover:shadow-md transition"
              onClick={() => alert("Demo only: social sign-in not implemented")}
            >
              <img src="/icons/github.svg" alt="" className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <div className="relative">
            <input
              ref={firstInputRef}
              id="email"
              name="email"
              value={values.email}
              onChange={onChange}
              type="email"
              autoComplete="email"
              required
              className="peer w-full px-3 pt-5 pb-2 border rounded-md bg-transparent focus:outline-none"
              placeholder=" "
            />
            <label htmlFor="email" className="floating-label">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              value={values.password}
              onChange={onChange}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="peer w-full px-3 pt-5 pb-2 border rounded-md bg-transparent focus:outline-none"
              placeholder=" "
            />
            <label htmlFor="password" className="floating-label">
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-2 text-sm text-slate-500 px-2 py-1 rounded focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                name="remember"
                checked={values.remember}
                onChange={onChange}
                type="checkbox"
                className="h-4 w-4"
              />
              <span className="text-slate-600">Remember me</span>
            </label>

            <button
              type="button"
              className="text-sky-600 hover:underline text-sm"
              onClick={() => alert("Forgot password flow not implemented in demo.")}
            >
              Forgot?
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 py-2 rounded-md text-white font-medium shadow-lg transition transform ${
                loading ? "bg-sky-500/80 cursor-wait" : "bg-sky-600 hover:bg-sky-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.6)" strokeWidth="3"></circle>
                    <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="3"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMounted(false);
                setTimeout(onClose, 120);
              }}
              className="px-4 py-2 rounded-md border"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          New here?{" "}
          <button
            type="button"
            onClick={() => {
              // close then open register
              setMounted(false);
              setTimeout(() => {
                onClose?.();
                if (onOpenRegister) onOpenRegister();
              }, 160);
            }}
            className="text-sky-600 font-medium hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}