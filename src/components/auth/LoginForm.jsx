import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * LoginForm — "Welcome Back" login form for SponsorFlow.
 * Uses useState for form fields, validation, loading, and password visibility.
 * Uses useAuth() custom hook for the login() function.
 */
export default function LoginForm({ onSwitchToRegister }) {
  // useState manages local form and filter state.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // useAuth is a custom hook for accessing AuthContext.
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
      // Login success — AuthContext updates isAuthenticated,
      // App.jsx will automatically render the dashboard.
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-espresso">Welcome Back</h2>
        <p className="text-xs text-brown mt-1">
          Sign in to continue to SponsorFlow.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-espresso uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/60" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: "" }));
              setError("");
            }}
            placeholder="you@example.com"
            className={`w-full bg-offWhite/50 border rounded-xl pl-10 pr-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/40 focus:outline-none focus:ring-1 transition-all ${
              fieldErrors.email
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-taupe/30 focus:border-taupe focus:ring-taupe"
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
        <label className="text-xs font-bold text-espresso uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/60" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: "" }));
              setError("");
            }}
            placeholder="Enter your password"
            className={`w-full bg-offWhite/50 border rounded-xl pl-10 pr-10 py-2.5 text-sm text-darkBrown placeholder:text-brown/40 focus:outline-none focus:ring-1 transition-all ${
              fieldErrors.password
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-taupe/30 focus:border-taupe focus:ring-taupe"
            }`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-espresso transition-colors"
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
          className="w-4 h-4 rounded border-taupe/40 text-espresso focus:ring-taupe accent-espresso"
        />
        <label
          htmlFor="rememberMe"
          className="text-xs text-brown font-medium cursor-pointer select-none"
        >
          Remember Me
        </label>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-espresso text-offWhite hover:bg-darkBrown disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
      <p className="text-center text-xs text-brown">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-espresso hover:underline"
        >
          Create Account
        </button>
      </p>

      {/* Demo Accounts Hint */}
      <div className="mt-4 p-3 bg-offWhite/60 rounded-xl border border-taupe/20">
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Demo Accounts
        </p>
        <div className="space-y-1 text-[11px] text-darkBrown/80">
          <p><span className="font-semibold">Committee:</span> committee@sponsorflow.demo</p>
          <p><span className="font-semibold">Sponsor:</span> sponsor@sponsorflow.demo</p>
          <p><span className="font-semibold">Faculty:</span> faculty@sponsorflow.demo</p>
          <p className="text-brown/60 mt-1">Password: sponsor123</p>
        </div>
      </div>
    </form>
  );
}
