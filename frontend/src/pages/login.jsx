import { useEffect, useRef, useState } from "react";

/**
 * Login modal with robust fetch handling (safe JSON parsing) and localStorage token/user save.
 * - Calls POST http://localhost:5000/api/auth/login
 * - Handles empty/non-JSON responses and surfaces raw text for easier debugging
 * - Stores token and user in localStorage on success and dispatches "authChange"
 *
 * Props:
 * - onClose(): close the modal
 * - onOpenRegister(): optional, open the register modal (close this first)
 *
 * Note: dispatching "authChange" ensures Navbar (and other same-tab listeners) update immediately.
 */

export default function Login({ onClose, onOpenRegister }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    firstInputRef.current?.focus();

    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
        // simple focus trap
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

      // If server returned JSON and included a message, use it; otherwise fall back to raw text
      const serverMessage = parsed?.message || (raw ? raw : null);

      if (!res.ok) {
        // Helpful error: include server message when available
        throw new Error(serverMessage || `Login failed (${res.status})`);
      }

      // Expecting parsed JSON like { token, user } — adapt if backend differs
      if (!parsed) {
        // success status but non-JSON body — surface the raw body for debugging
        throw new Error(`Server returned non-JSON success response: ${raw || "<empty body>"}`);
      }

      const { token, user } = parsed;

      if (!token) {
        throw new Error(parsed?.message || "No token returned from server");
      }

      // Save token/user to localStorage for app-wide auth persistence
      localStorage.setItem("auth.token", token);
      if (user) localStorage.setItem("auth.user", JSON.stringify(user));
      else localStorage.setItem("auth.user", JSON.stringify({ email: values.email }));

      // notify same-tab listeners that auth changed (so Navbar updates immediately)
      window.dispatchEvent(new Event("authChange"));

      // optionally respect "remember" (for demo we persist always)
      setLoading(false);
      onClose?.();
    } catch (err) {
      setLoading(false);
      setError(err?.message || String(err));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 transform transition-all duration-400 ease-out"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="login-title" className="text-2xl font-extrabold text-slate-900">
              Sign in
            </h2>
            <p className="mt-1 text-sm text-slate-500">Access your account</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto inline-flex p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded">{error}</div>}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              ref={firstInputRef}
              name="email"
              value={values.email}
              onChange={onChange}
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              name="password"
              value={values.password}
              onChange={onChange}
              type="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </label>

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
              className="flex-1 py-2 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700 disabled:opacity-60 transition"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <button
            type="button"
            onClick={() => {
              onClose?.();
              if (onOpenRegister) setTimeout(onOpenRegister, 120);
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