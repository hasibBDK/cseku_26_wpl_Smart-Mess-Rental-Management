import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { auth } from "../../lib/firebase";
import { authRequest } from "../../lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); const [posts, setPosts] = useState([]); const [error, setError] = useState("");
  async function load(firebaseUser) { const account = await authRequest("/auth/me", firebaseUser); if (account.user.role !== "admin") return navigate("/dashboard", { replace: true }); setUser(firebaseUser); setPosts((await authRequest("/tuitions/admin/selected", firebaseUser)).posts); }
  useEffect(() => onAuthStateChanged(auth, (firebaseUser) => { if (!firebaseUser) return navigate("/login", { replace: true }); load(firebaseUser).catch((e) => setError(e.message)); }), [navigate]);
  async function forward(id) { try { await authRequest(`/tuitions/admin/${id}/forward`, user, { method: "PATCH" }); setPosts((current) => current.filter((post) => post._id !== id)); } catch (e) { setError(e.message); } }
  return <div className="explore-page"><Navbar /><main className="explore-main tuition-main"><Link className="back-link" to="/dashboard">← Back to my profile</Link><section className="explore-heading"><p className="kicker">ADMIN PANEL</p><h1>Selected tuition payments</h1><p>Review selected tutors, confirm received payment, and forward the tuition to the teacher.</p></section>{error && <p className="notice notice-error">{error}</p>}<section className="tuition-list">{!posts.length ? <div className="empty-state"><h2>No selected tuition is waiting</h2><p>New guardian selections will appear here.</p></div> : posts.map((post) => <article className="tuition-card" key={post._id}><div className="tuition-card-head"><div><span className="status-pill">Payment {post.paymentStatus}</span><h2>{post.subject}</h2><p>{post.childClass} · {post.location}</p></div><strong>Tk {post.offeredSalary.toLocaleString()}<small>/ month</small></strong></div><div className="tuition-meta"><span>Guardian: {post.guardian?.name} ({post.guardian?.email})</span><span>Teacher: {post.selectedStudent?.name} ({post.selectedStudent?.email})</span></div>{post.status === "selected" ? <button className="button button-dark" onClick={() => forward(post._id)}>Payment received — forward to teacher</button> : <span className="status-pill">Forwarded</span>}</article>)}</section></main></div>;
}
