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
  {
    id: "faculty",
    label: "Faculty Approver",
    icon: GraduationCap,
    desc: "Reviewing & approving deals",
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

/**
 * RegisterForm — "Create Your SponsorFlow Account" registration form.
 * Uses useState for all form fields, role selection, dynamic role-specific fields,
 * password visibility, validation, and loading state.
 * Role is selected ONLY during registration.
 */
export default function RegisterForm({ onSwitchToLogin, initialRole = "" }) {
  // useState manages local form state.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // useState manages dynamic role-specific fields.
  const [college, setCollege] = useState("");
  const [committeeName, setCommitteeName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [department, setDepartment] = useState("");

  // useState manages validation, loading, and result state.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();

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

    // Role-specific validation
    if (selectedRole === "committee") {
      if (!college.trim()) errors.college = "College name is required";
      if (!committeeName.trim()) errors.committeeName = "Committee name is required";
    }
    if (selectedRole === "sponsor") {
      if (!companyName.trim()) errors.companyName = "Company name is required";
      if (!industry) errors.industry = "Industry is required";
    }
    if (selectedRole === "faculty") {
      if (!college.trim()) errors.college = "College name is required";
      if (!department.trim()) errors.department = "Department is required";
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

      // Add role-specific fields
      if (selectedRole === "committee") {
        userData.college = college.trim();
        userData.committee = committeeName.trim();
      }
      if (selectedRole === "sponsor") {
        userData.company = companyName.trim();
        userData.industry = industry;
      }
      if (selectedRole === "faculty") {
        userData.college = college.trim();
        userData.department = department.trim();
      }

      await register(userData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-taupe/20 text-espresso">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-espresso">Account Created!</h2>
        <p className="text-sm text-brown">
          Your SponsorFlow account has been created successfully.
          <br />
          Sign in with your credentials to get started.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-all shadow-sm"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const inputClass = (fieldName) =>
    `w-full bg-offWhite/50 border rounded-xl px-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/40 focus:outline-none focus:ring-1 transition-all ${
      fieldErrors[fieldName]
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-taupe/30 focus:border-taupe focus:ring-taupe"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-espresso">
          Create Your SponsorFlow Account
        </h2>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-espresso uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/60" />
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
            }}
            placeholder="At least 6 characters"
            className={`${inputClass("password")} pl-10 pr-10`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-espresso transition-colors"
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
        <label className="text-xs font-bold text-espresso uppercase tracking-wider">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/60" />
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-espresso transition-colors"
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
        <label className="text-xs font-bold text-espresso uppercase tracking-wider">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border ${
                  isSelected
                    ? "bg-espresso text-offWhite border-espresso shadow-sm"
                    : "bg-offWhite/30 text-darkBrown border-taupe/30 hover:bg-offWhite hover:border-taupe/50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-darkBrown text-taupe" : "bg-taupe/20 text-brown"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isSelected ? "text-offWhite" : "text-espresso"}`}>
                    {role.label}
                  </p>
                  <p className={`text-[11px] ${isSelected ? "text-taupe" : "text-brown"}`}>
                    {role.desc}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 ml-auto text-taupe shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Role-Specific Fields */}
      {/* useState dynamically shows/hides these fields based on selectedRole */}
      {selectedRole === "committee" && (
        <div className="space-y-4 p-4 bg-offWhite/40 rounded-xl border border-taupe/20">
          <p className="text-[10px] font-bold text-brown uppercase tracking-wider">
            Committee Details
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso">
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso">
              Committee / Council Name
            </label>
            <input
              type="text"
              value={committeeName}
              onChange={(e) => {
                setCommitteeName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, committeeName: "" }));
              }}
              placeholder="e.g. CSI Student Chapter"
              className={inputClass("committeeName")}
            />
            {fieldErrors.committeeName && (
              <p className="text-[11px] text-red-500 font-medium">{fieldErrors.committeeName}</p>
            )}
          </div>
        </div>
      )}

      {selectedRole === "sponsor" && (
        <div className="space-y-4 p-4 bg-offWhite/40 rounded-xl border border-taupe/20">
          <p className="text-[10px] font-bold text-brown uppercase tracking-wider">
            Brand Details
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso">
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
            <label className="text-xs font-bold text-espresso">Industry</label>
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

      {selectedRole === "faculty" && (
        <div className="space-y-4 p-4 bg-offWhite/40 rounded-xl border border-taupe/20">
          <p className="text-[10px] font-bold text-brown uppercase tracking-wider">
            Faculty Details
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso">
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setFieldErrors((prev) => ({ ...prev, department: "" }));
              }}
              placeholder="e.g. Computer Engineering"
              className={inputClass("department")}
            />
            {fieldErrors.department && (
              <p className="text-[11px] text-red-500 font-medium">{fieldErrors.department}</p>
            )}
          </div>
        </div>
      )}

      {/* Register Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-espresso text-offWhite hover:bg-darkBrown disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
      <p className="text-center text-xs text-brown">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-espresso hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
