import { useEffect, useRef, useState } from "react";

/**
 * Simplified Register modal (personal accounts only)
 * - Usage: <Register onClose={() => {}} onOpenLogin={() => {}} />
 * - Clean UI, client-side validation, subtle entrance animation, accessible
 */

export default function Register({ onClose, onOpenLogin }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    firstInputRef.current?.focus();

    function handleKey(e) {
      if (e.key === "Escape") onClose();
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
    setError("");
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!values.name.trim() || !values.email.trim() || !values.password || !values.confirm) {
      return "Please fill all fields.";
    }
    // simple email check
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(values.email)) return "Please enter a valid email.";
    if (values.password.length < 6) return "Password must be at least 6 characters.";
    if (values.password !== values.confirm) return "Passwords do not match.";
    return "";
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
      // TODO: replace with real API call to /api/auth/register
      // const res = await fetch("/api/auth/register", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name: values.name, email: values.email, password: values.password }) });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message || "Registration failed");

      // Simulated network delay for demo
      await new Promise((r) => setTimeout(r, 800));

      // On success: close and optionally open login
      setLoading(false);
      onClose();
      if (onOpenLogin) setTimeout(onOpenLogin, 260);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed. Try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 transform transition-all duration-400 ease-out animate-modal-in"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="register-title" className="text-2xl font-extrabold text-slate-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-slate-500">Sign up to try the authentication demo.</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto inline-flex p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded">{error}</div>}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Full name</span>
            <input
              ref={firstInputRef}
              name="name"
              value={values.name}
              onChange={onChange}
              type="text"
              required
              placeholder="Jane Doe"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              name="email"
              value={values.email}
              onChange={onChange}
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                name="password"
                value={values.password}
                onChange={onChange}
                type="password"
                required
                placeholder="At least 6 characters"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Confirm</span>
              <input
                name="confirm"
                value={values.confirm}
                onChange={onChange}
                type="password"
                required
                placeholder="Repeat password"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-sky-600 text-white font-medium shadow hover:bg-sky-700 disabled:opacity-60 transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-500">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenLogin) setTimeout(onOpenLogin, 160);
            }}
            className="text-sky-600 font-medium hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          60% {
            opacity: 1;
            transform: translateY(-6px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-modal-in {
          animation: modal-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-modal-in {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}