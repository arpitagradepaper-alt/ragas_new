import { Navigate, useLocation } from "react-router-dom";

// A user session is only valid while its JWT exists and is
// parseable / not expired. The "logged in" flag alone can be
// typed into the browser console, so the token is the
// source of truth for protecting pages.
function isUserTokenValid() {
  const token =
    localStorage.getItem("ragasUserToken") ||
    sessionStorage.getItem("ragasUserToken");

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Tokens without an expiry stay valid while the token
    // exists (matches the current backend).
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isUserTokenValid()) {
    return (
      <Navigate
        to="/user-login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
