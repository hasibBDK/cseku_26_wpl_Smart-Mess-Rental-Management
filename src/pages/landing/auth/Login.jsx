import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, deleteUser, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Navbar from "../../../components/common/Navbar";
import { auth } from "../../../lib/firebase";
import { authRequest } from "../../../lib/api";

const messages = { "auth/email-already-in-use": "An account already exists with this email.", "auth/invalid-credential": "Email or password is incorrect.", "auth/invalid-email": "Please enter a valid email address.", "auth/weak-password": "Use a stronger password with at least 6 characters.", "auth/too-many-requests": "Too many attempts. Please try again later." };

export default function Login() {
  const [params] = useSearchParams(); const navigate = useNavigate();
  const signup = params.get("mode") === "signup";
  const [show, setShow] = useState(false); const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(""); const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    const form = new FormData(event.currentTarget); const email = form.get("email").trim(); const password = form.get("password");
    try {
      if (signup) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          const name = form.get("name").trim(); await updateProfile(credential.user, { displayName: name });
          await authRequest("/auth/register", credential.user, { method: "POST", body: JSON.stringify({ name, role: form.get("role") }) });
          await credential.user.getIdToken(true);
        } catch (backendError) { await deleteUser(credential.user).catch(() => {}); throw backendError; }
      } else {
        await setPersistence(auth, form.get("remember") ? browserLocalPersistence : browserSessionPersistence);
        const credential = await signInWithEmailAndPassword(auth, email, password); await authRequest("/auth/me", credential.user);
      }
      navigate("/dashboard");
    } catch (submitError) { setError(messages[submitError.code] || submitError.message || "Authentication failed."); }
    finally { setLoading(false); }
  }

  async function forgotPassword() {
    const email = document.querySelector('input[name="email"]')?.value.trim();
    if (!email) return setError("Enter your email address first.");
    try { await sendPasswordResetEmail(auth, email); setError(""); setNotice("Password reset email sent. Check your inbox."); }
    catch (resetError) { setError(messages[resetError.code] || resetError.message); }
  }

  return <div className="auth-page"><Navbar simple /><main className="auth-main"><section className="auth-panel">
    <Link className="back-link" to="/">← Back to home</Link><div className="auth-heading"><p className="kicker">✦ &nbsp; {signup ? "Join the community" : "Welcome back"}</p><h1>{signup ? "Create your nest." : "Good to see you."}</h1><p>{signup ? "Choose your role and join CampusNest." : "Log in to continue to your account."}</p></div>
    <form onSubmit={submit}>{signup && <label>Full name<input name="name" required maxLength="80" placeholder="Your full name" /></label>}{signup && <label>I am joining as<select name="role" defaultValue="student"><option value="student">Student</option><option value="guardian">Guardian</option><option value="homeowner">Home / mess owner</option><option value="admin">Admin (approved emails only)</option></select></label>}<label>Email address<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Password<div className="password"><input name="password" required minLength="6" autoComplete={signup ? "new-password" : "current-password"} type={show ? "text" : "password"} placeholder="At least 6 characters" /><button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button></div></label>{!signup && <div className="form-row"><label><input name="remember" type="checkbox" /> Remember me</label><button className="link-button" type="button" onClick={forgotPassword}>Forgot password?</button></div>}<button className="button button-dark submit" disabled={loading} type="submit">{loading ? "Please wait..." : signup ? "Create free account →" : "Log in →"}</button>{error && <p className="notice notice-error" role="alert">{error}</p>}{notice && <p className="notice" role="status">{notice}</p>}</form>
    <p className="switch">{signup ? "Already have an account? " : "New to CampusNest? "}<Link to={signup ? "/login" : "/login?mode=signup"}>{signup ? "Log in" : "Create an account"}</Link></p>
  </section><aside className="auth-art"><div className="quote"><b>“</b><h2>Finding a safe place near campus shouldn’t feel like a full-time job.</h2><p>CampusNest brings the right people closer.</p></div><div className="house"><span /><i /><b>♧</b></div><div className="art-pill">Made for the university community ♥</div></aside></main></div>;
}
