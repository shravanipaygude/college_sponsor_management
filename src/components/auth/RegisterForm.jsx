import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  Users,
  Building2,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const roleOptions = [
  {
    id: "committee",
    label: "College Committee",
    icon: Users,
    desc: "Organizing events & seeking sponsors",
  },
  {
    id: "sponsor",
    label: "Corporate Sponsor / Brand",
    icon: Building2,
    desc: "Offering sponsorships to colleges",
  },
];

const industryOptions = [
  "AI / Technology",
  "Education",
  "Food & Beverage",
  "FinTech",
  "Software",
  "Local Business",
  "Other",
];

const councilPresets = ["CSI", "ISTE", "IEEE", "ISA", "Other"];

export default function RegisterForm({ onSwitchToLogin, initialRole = "" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const [college, setCollege] = useState("");
  const [selectedPresetCouncil, setSelectedPresetCouncil] = useState("CSI");
  const [customCouncilName, setCustomCouncilName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();

  const getFinalCouncilName = () => {
    if (selectedPresetCouncil === "Other") {
      return customCouncilName.trim();
    }
    return selectedPresetCouncil;
  };

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Full name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "At least 6 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm password";
    else if (password !== confirmPassword) errors.confirmPassword = "Passwords don't match";
    if (!selectedRole) errors.role = "Please select a role";

    if (selectedRole === "committee") {
      if (!college.trim()) errors.college = "College name is required";
      const councilName = getFinalCouncilName();
      if (!councilName) errors.committeeName = "Council / Committee name is required";
    }
    if (selectedRole === "sponsor") {
      if (!companyName.trim()) errors.companyName = "Company name is required";
      if (!industry) errors.industry = "Industry is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
      };

      if (selectedRole === "committee") {
        const finalCouncil = getFinalCouncilName();
        userData.college = college.trim() || "VESIT";
        userData.collegeName = college.trim() || "VESIT";
        userData.committee = finalCouncil;
        userData.organizationName = finalCouncil;
      }
      if (selectedRole === "sponsor") {
        userData.company = companyName.trim();
        userData.organizationName = companyName.trim();
        userData.industry = industry;
      }

      await register(userData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading ? null : setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-4 font-sans-ui">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Account Created!</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Your Sponnect account has been created successfully.
          <br />
          Sign in with your credentials to get started.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-all shadow-md cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const inputClass = (fieldName) =>
    `w-full bg-[var(--bg-input)] border rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all ${
      fieldErrors[fieldName]
        ? "border-red-400 focus:ring-red-400"
        : "border-[var(--border-subtle)] focus:border-[var(--brand-primary)]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-sans-ui">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          Create Your Sponnect Account
        </h2>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-[var(--accent-pink-bg)] border border-[var(--accent-pink)]/40 text-[var(--accent-pink)] px-4 py-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="Your full name"
            className={`${inputClass("name")} pl-10`}
          />
        </div>
        {fieldErrors.name && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.name}</p>
        )}
      </div>

      {/* Email */}
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
            className={`${inputClass("email")} pl-10`}
            autoComplete="email"
          />
        </div>
        {fieldErrors.email && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password */}
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
            }}
            placeholder="At least 6 characters"
            className={`${inputClass("password")} pl-10 pr-10`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            placeholder="Re-enter your password"
            className={`${inputClass("confirmPassword")} pl-10 pr-10`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
          I am registering as:
        </label>
        {fieldErrors.role && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.role}</p>
        )}
        <div className="grid grid-cols-1 gap-2">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                type="button"
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setFieldErrors((prev) => ({ ...prev, role: "" }));
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-md"
                    : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-white/20 text-white" : "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isSelected ? "text-white" : "text-[var(--text-primary)]"}`}>
                    {role.label}
                  </p>
                  <p className={`text-[11px] ${isSelected ? "text-white/80" : "text-[var(--text-secondary)]"}`}>
                    {role.desc}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 ml-auto text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Role-Specific Fields */}
      {selectedRole === "committee" && (
        <div className="space-y-4 p-4 bg-[var(--bg-surface-alt)] rounded-xl border border-[var(--border-subtle)]">
          <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
            Committee Details
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">
              College / Institute Name
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => {
                setCollege(e.target.value);
                setFieldErrors((prev) => ({ ...prev, college: "" }));
              }}
              placeholder="e.g. VESIT"
              className={inputClass("college")}
            />
            {fieldErrors.college && (
              <p className="text-[11px] text-red-500 font-medium">{fieldErrors.college}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-primary)]">
              Select Council / Committee Suggestion
            </label>
            <div className="flex flex-wrap gap-2">
              {councilPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => {
                    setSelectedPresetCouncil(preset);
                    setFieldErrors((prev) => ({ ...prev, committeeName: "" }));
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPresetCouncil === preset
                      ? "bg-[var(--brand-primary)] text-white shadow-sm"
                      : "bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            {selectedPresetCouncil === "Other" && (
              <div className="pt-2 space-y-1">
                <label className="text-xs font-semibold text-[var(--brand-royal)]">
                  Enter Custom Council / Committee Name
                </label>
                <input
                  type="text"
                  value={customCouncilName}
                  onChange={(e) => {
                    setCustomCouncilName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, committeeName: "" }));
                  }}
                  placeholder="e.g. ACM, IETE, E-Cell, NSS, Robotics Club"
                  className={inputClass("committeeName")}
                />
              </div>
            )}
            {fieldErrors.committeeName && (
              <p className="text-[11px] text-red-500 font-medium">{fieldErrors.committeeName}</p>
            )}
          </div>
        </div>
      )}

      {selectedRole === "sponsor" && (
        <div className="space-y-4 p-4 bg-[var(--bg-surface-alt)] rounded-xl border border-[var(--border-subtle)]">
          <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
            Brand Details
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">
              Company / Brand Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, companyName: "" }));
              }}
              placeholder="e.g. NovaAI Technologies"
              className={inputClass("companyName")}
            />
            {fieldErrors.companyName && (
              <p className="text-[11px] text-red-500 font-medium">{fieldErrors.companyName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">Industry</label>
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setFieldErrors((prev) => ({ ...prev, industry: "" }));
              }}
              className={inputClass("industry")}
            >
              <option value="">Select Industry</option>
              {industryOptions.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            {fieldErrors.industry && (
              <p className="text-[11px] text-red-500 font-medium">{fieldErrors.industry}</p>
            )}
          </div>
        </div>
      )}

      {/* Register Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Switch to Login */}
      <p className="text-center text-xs text-[var(--text-secondary)]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-[var(--accent-pink)] hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
