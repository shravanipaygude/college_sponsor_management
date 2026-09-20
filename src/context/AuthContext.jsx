import React, { createContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the application and manages:
 * - user: the currently authenticated user object from backend
 * - role: the user's role ("committee" | "sponsor")
 * - isAuthenticated: whether a valid JWT session exists
 * - login / register / logout functions connecting to Node.js backend
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore persisted session on mount and verify token with backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken =
        localStorage.getItem("sf_jwt_token") ||
        sessionStorage.getItem("sf_jwt_token");

      const storedSession =
        localStorage.getItem("sf_session") ||
        sessionStorage.getItem("sf_session");

      if (storedToken && storedSession) {
        try {
          const parsedUser = JSON.parse(storedSession);
          if (parsedUser.role === "faculty") {
            // Clear unsupported faculty role session
            localStorage.removeItem("sf_jwt_token");
            localStorage.removeItem("sf_session");
            sessionStorage.removeItem("sf_jwt_token");
            sessionStorage.removeItem("sf_session");
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Verify token with backend
            const activeUser = await api.getCurrentUser();
            if (activeUser) {
              const fullUser = {
                ...parsedUser,
                ...activeUser,
                roleLabel:
                  activeUser.role === "sponsor"
                    ? "Corporate Sponsor"
                    : "Committee Head",
              };
              setUser(fullUser);
              setIsAuthenticated(true);
            } else {
              // Token expired or invalid
              logout();
            }
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * login() authenticates credentials via REST API, receives JWT, and persists session.
   */
  const login = async (email, password, rememberMe = false) => {
    const response = await api.loginUser(email, password);

    if (!response || !response.token) {
      throw new Error("Invalid response from authentication server.");
    }

    const { token, user: fetchedUser } = response;

    // Avatar initials
    const nameParts = (fetchedUser.name || "User").trim().split(" ");
    const avatar =
      nameParts.length >= 2
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : (fetchedUser.name || "US").slice(0, 2).toUpperCase();

    const roleLabel =
      fetchedUser.role === "sponsor" ? "Corporate Sponsor" : "Committee Head";

    const sessionData = {
      ...fetchedUser,
      avatar,
      roleLabel,
      college: fetchedUser.collegeName || fetchedUser.college || "VESIT",
      committee: fetchedUser.role === "committee" ? fetchedUser.organizationName : "",
      company: fetchedUser.role === "sponsor" ? fetchedUser.organizationName : "",
    };

    // Store JWT token and session according to Remember Me setting
    if (rememberMe) {
      localStorage.setItem("sf_jwt_token", token);
      localStorage.setItem("sf_session", JSON.stringify(sessionData));
      sessionStorage.removeItem("sf_jwt_token");
      sessionStorage.removeItem("sf_session");
    } else {
      sessionStorage.setItem("sf_jwt_token", token);
      sessionStorage.setItem("sf_session", JSON.stringify(sessionData));
      localStorage.removeItem("sf_jwt_token");
      localStorage.removeItem("sf_session");
    }

    setUser(sessionData);
    setIsAuthenticated(true);

    return sessionData;
  };

  /**
   * register() submits user registration to backend MongoDB.
   */
  const register = async (userData) => {
    const response = await api.registerUser(userData);
    return response.user;
  };

  /**
   * logout() purges JWT token and user session from storage and resets state.
   */
  const logout = () => {
    localStorage.removeItem("sf_jwt_token");
    localStorage.removeItem("sf_session");
    sessionStorage.removeItem("sf_jwt_token");
    sessionStorage.removeItem("sf_session");
    setUser(null);
    setIsAuthenticated(false);
  };

  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
