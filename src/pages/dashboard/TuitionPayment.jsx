import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { auth } from "../../lib/firebase";
import { authRequest } from "../../lib/api";

export default function TuitionPayment() {
  const navigate = useNavigate(); const [user, setUser] = useState(null); const [post, setPost] = useState(null); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => { if (!firebaseUser) return navigate("/login", { replace: true }); try { setUser(firebaseUser); const data = await authRequest("/tuitions/selected/me", firebaseUser); setPost(data.posts[0] || null); } catch (e) { setError(e.message); } }), [navigate]);
  async function submit(event) { event.preventDefault(); setError(""); setMessage(""); const body = Object.fromEntries(new FormData(event.currentTarget).entries()); try { const result = await authRequest(`/tuitions/${post._id}/payment`, user, { method: "POST", body: JSON.stringify(body) }); setMessage(result.message); setPost({ ...post, paymentStatus: "paid", paymentMethod: body.method }); } catch (e) { setError(e.message); } }
  const payable = post ? Math.round(post.offeredSalary * 0.15) : 0;
  return <div className="explore-page"><Navbar /><main className="explore-main tuition-main"><Link className="back-link" to="/dashboard">← Back to my profile</Link><section className="explore-heading"><p className="kicker">TEACHER PAYMENT</p><h1>Complete your tuition payment</h1><p>Choose bKash, Nagad or Rocket and submit your transaction ID. Admin will verify the payment before forwarding the tuition.</p></section>{error && <p className="notice notice-error">{error}</p>}{message && <p className="notice">{message}</p>}{!post ? <div className="empty-state"><h2>No selected tuition found</h2><p>A guardian selection will appear here.</p></div> : <section className="tuition-form-card"><h2>{post.subject} · {post.childClass}</h2><p>Guardian: {post.guardian?.name}</p><div className="tuition-meta"><span>Total tuition offer: Tk {Number(post.offeredSalary ?? 0).toLocaleString()}</span><span>15% payment: Tk {Number(payable ?? 0).toLocaleString()}</span></div><p className="payment-number">Send payment to: <strong>01791690434</strong></p>{post.paymentStatus === "paid" ? <p className="status-pill">Payment submitted via {post.paymentMethod}</p> : <form className="tuition-form" onSubmit={submit}><label>Payment method<select name="method" defaultValue="bKash"><option>bKash</option><option>Nagad</option><option>Rocket</option></select></label><label>Transaction ID<input name="transactionId" required placeholder="Enter your transaction ID" /></label><button className="button button-dark wide-field" type="submit">Pay 15% (Tk {Number(payable ?? 0).toLocaleString()}) to Confirm Tuition</button></form>}</section>}</main></div>;
}

