import React, { useEffect, useRef, useState } from "react";

/**
 * Enhanced Register modal:
 * - glass UI + entrance animation
 * - floating labels, password strength hint, animated success banner
 * - creates account via POST /api/auth/register and shows friendly messages
 *
 * Props:
 * - onClose()
 * - onOpenLogin()
 */

export default function Register({ onClose, onOpenLogin }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    firstInputRef.current?.focus();
  }, []);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  }

  function strength() {
    const p = values.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0..4
  }

  function validate() {
    const { name, email, password, confirm } = values;
    if (!name || !email || !password || !confirm) return "All fields are required!";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email)) return "Please enter a valid email address.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://mern-auth-login-register.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Account created successfully! Redirecting to sign in...");
      setValues({ name: "", email: "", password: "", confirm: "" });

      setTimeout(() => {
        setMounted(false);
        setTimeout(() => {
          onClose?.();
          if (onOpenLogin) onOpenLogin();
        }, 120);
      }, 1100);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  const pwdScore = strength();
  const scoreLabel = ["Very weak", "Weak", "Okay", "Good", "Strong"][pwdScore];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={() => {
          setMounted(false);
          setTimeout(onClose, 160);
        }}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-md glass-card rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 ease-out ${
          mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-3"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
      >
        <h2 id="register-title" className="text-2xl font-extrabold text-slate-900">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">Start your secure demo account</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && <div className="text-red-700 bg-red-50 px-3 py-2 rounded">{error}</div>}
          {success && <div className="text-green-700 bg-green-50 px-3 py-2 rounded">{success}</div>}

          <div className="relative">
            <input
              ref={firstInputRef}
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              type="text"
              required
              className="peer w-full px-3 pt-5 pb-2 border rounded-md bg-transparent focus:outline-none"
              placeholder=" "
            />
            <label htmlFor="name" className="floating-label">
              Full name
            </label>
          </div>

          <div className="relative">
            <input
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              type="email"
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
              onChange={handleChange}
              type="password"
              required
              className="peer w-full px-3 pt-5 pb-2 border rounded-md bg-transparent focus:outline-none"
              placeholder=" "
            />
            <label htmlFor="password" className="floating-label">
              Password
            </label>
            <div className="mt-2 text-xs text-slate-500">Use at least 8 characters for a stronger password.</div>

            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-width duration-300 ${
                  pwdScore <= 1 ? "bg-red-400 w-1/5" : pwdScore === 2 ? "bg-yellow-400 w-2/5" : pwdScore === 3 ? "bg-emerald-400 w-3/5" : "bg-green-500 w-4/5"
                }`}
                style={{ width: `${(pwdScore / 4) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-600">{scoreLabel}</div>
          </div>

          <div className="relative">
            <input
              id="confirm"
              name="confirm"
              value={values.confirm}
              onChange={handleChange}
              type="password"
              required
              className="peer w-full px-3 pt-5 pb-2 border rounded-md bg-transparent focus:outline-none"
              placeholder=" "
            />
            <label htmlFor="confirm" className="floating-label">
              Confirm password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium shadow-lg transition ${
              loading ? "bg-sky-500/80 cursor-wait" : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-slate-600">
          Already have an account?{" "}
          <button
            onClick={() => {
              // close then open login
              setMounted(false);
              setTimeout(() => {
                onClose?.();
                if (onOpenLogin) onOpenLogin();
              }, 160);
            }}
            className="text-sky-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}