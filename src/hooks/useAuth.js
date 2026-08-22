import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// useAuth is a custom hook that provides easy
// access to the global SponsorFlow authentication state.
// Components use useAuth() instead of repeatedly calling
// useContext(AuthContext) throughout unrelated components.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
      "Wrap your app with <AuthProvider> in main.jsx."
    );
  }

  return context;
}
