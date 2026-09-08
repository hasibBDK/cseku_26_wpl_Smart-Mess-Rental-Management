import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { authRequest } from "../../lib/api";

export default function Dashboard() {
  const navigate = useNavigate(); const [profile, setProfile] = useState(null); const [error, setError] = useState("");
  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => { if (!firebaseUser) return navigate("/login", { replace: true }); try { setProfile((await authRequest("/auth/me", firebaseUser)).user); } catch (requestError) { setError(requestError.message); } }), [navigate]);
  async function logout() { await signOut(auth); navigate("/login", { replace: true }); }
  return <main className="dashboard-page"><div className="dashboard-card"><Link className="brand" to="/"><span className="brand-mark">⌂</span>Campus<span>Nest</span></Link>{error ? <p className="notice notice-error">{error}</p> : !profile ? <p>Loading your account…</p> : <><p className="kicker">SIGNED IN</p><h1>Welcome, {profile.name}</h1><p className="role-badge">{profile.role}</p><p>{profile.email}</p><button className="button button-dark" onClick={logout}>Log out</button></>}</div></main>;
}
