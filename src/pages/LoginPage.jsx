import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";

function ForgotPasswordModal({ onClose, onReset }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onReset(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div>
            <div className="bg-success/10 text-success rounded-lg p-4 mb-4 text-sm">
              Password reset email sent! Check your inbox (and spam folder).
            </div>
            <Button onClick={onClose} variant="primary" className="w-full">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-headline-md font-headline-md text-primary">Reset Password</h3>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface text-xl leading-none">&times;</button>
            </div>
            <p className="text-body-md text-on-surface-variant mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant block">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-outline/60"
                />
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
              <Button type="submit" variant="primary" loading={loading} className="flex-1">Send Reset Link</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.email === "panchasarav2007@gmail.com") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  function validate() {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (!password) return "Password is required";
    return "";
  }

  async function handleLogin(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
    } catch (err) {
      const msg = err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential"
        ? "Invalid email or password"
        : err.code === "auth/invalid-email"
        ? "Please enter a valid email"
        : err.code === "auth/too-many-requests"
        ? "Too many attempts. Please try again later."
        : err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="fixed top-4 right-4 z-20">
        <button
          type="button"
          onClick={() => { localStorage.setItem("admin_auth", "true"); window.location.href = "/admin"; }}
          className="text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all cursor-pointer border border-white/20"
        >
          Admin Login
        </button>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover scale-110"
          alt="Background"
          src="/background_log.jpeg"
          style={{ filter: "blur(4px)" }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-5 md:px-0">
        <div className="glass-card rounded-xl shadow-lg p-8 md:p-10 border border-white/20">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-4 shadow-sm">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Traveloop</h1>
            <p className="font-body-md text-on-surface-variant mt-2 text-center">Welcome back, Traveler</p>
          </div>

          {error && (
            <div className="bg-danger/10 text-danger text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-outline/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-primary font-label-md text-label-md hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-outline/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-container text-white font-headline-md text-headline-md py-4 rounded-lg shadow-sm active:scale-95 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[rgba(255,255,255,0.88)] px-4 text-label-md text-outline font-label-md">OR CONTINUE WITH</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-3 border border-outline-variant py-3 rounded-lg hover:bg-surface-container-low transition-all active:scale-95 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-label-md text-label-md text-on-surface">Continue with Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-on-surface-variant font-body-md">
            Don't have an account?{" "}
            <Link to="/signup" className="text-secondary font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 flex justify-center items-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="text-xs font-label-md">Secure Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">public</span>
            <span className="text-xs font-label-md">24/7 Global Support</span>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotModal(false)}
          onReset={resetPassword}
        />
      )}
    </div>
  );
}
