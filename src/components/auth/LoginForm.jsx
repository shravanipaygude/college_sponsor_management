import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * LoginForm — "Welcome Back" login form for SponsorFlow.
 * Uses theme variables for seamless Light & Dark theme support.
 */
export default function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const { login } = useAuth();

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-sans-ui">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Welcome Back</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Sign in to continue to Sponnect.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-[var(--accent-pink-bg)] border border-[var(--accent-pink)]/40 text-[var(--accent-pink)] px-4 py-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: "" }));
              setError("");
            }}
            placeholder="you@example.com"
            className={`w-full bg-[var(--bg-input)] border rounded-xl pl-10 pr-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all ${
              fieldErrors.email
                ? "border-red-400 focus:ring-red-400"
                : "border-[var(--border-subtle)] focus:border-[var(--brand-primary)]"
            }`}
            autoComplete="email"
          />
        </div>
        {fieldErrors.email && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: "" }));
              setError("");
            }}
            placeholder="Enter your password"
            className={`w-full bg-[var(--bg-input)] border rounded-xl pl-10 pr-10 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all ${
              fieldErrors.password
                ? "border-red-400 focus:ring-red-400"
                : "border-[var(--border-subtle)] focus:border-[var(--brand-primary)]"
            }`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.password}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] accent-[var(--brand-primary)] cursor-pointer"
        />
        <label
          htmlFor="rememberMe"
          className="text-xs text-[var(--text-secondary)] font-medium cursor-pointer select-none"
        >
          Remember Me
        </label>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Switch to Register */}
      <p className="text-center text-xs text-[var(--text-secondary)]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-[var(--accent-pink)] hover:underline cursor-pointer"
        >
          Create Account
        </button>
      </p>

      {/* Demo Accounts Hint */}
      <div className="mt-4 p-3 bg-[var(--bg-surface-alt)] rounded-xl border border-[var(--border-subtle)]">
        <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">
          Demo Accounts
        </p>
        <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
          <p><span className="font-semibold text-[var(--text-primary)]">Committee:</span> committee@sponnect.demo</p>
          <p><span className="font-semibold text-[var(--text-primary)]">Sponsor:</span> sponsor@sponnect.demo</p>
          <p className="text-[var(--text-muted)] mt-1 font-mono">Password: sponsor123</p>
        </div>
      </div>
    </form>
  );
}
