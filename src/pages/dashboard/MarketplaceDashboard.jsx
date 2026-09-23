import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { auth } from "../../lib/firebase";
import { authRequest, publicRequest } from "../../lib/api";

export default function MarketplaceDashboard() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const view = ["browse", "post", "mine"].includes(params.get("view")) ? params.get("view") : "browse";

  async function loadItems() {
    const data = await publicRequest("/marketplace");
    setItems(data.items);
  }

  useEffect(() => {
    loadItems().catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) { setProfile(null); setAuthReady(true); return; }
      try { setProfile((await authRequest("/auth/me", user)).user); }
      catch { setProfile(null); }
      finally { setAuthReady(true); }
    });
  }, []);

  useEffect(() => {
    if (view === "post" && authReady && !firebaseUser) return navigate("/login", { replace: true });
    if (view === "post" && profile && profile.role !== "student") navigate("/marketplace", { replace: true });
  }, [authReady, firebaseUser, navigate, profile, view]);

  async function createItem(event) {
    event.preventDefault();
    if (!firebaseUser) return navigate("/login");
    setSubmitting(true); setError(""); setNotice("");
    const formElement = event.currentTarget;
    const body = Object.fromEntries(new FormData(formElement).entries());
    try {
      const result = await authRequest("/marketplace", firebaseUser, { method: "POST", body: JSON.stringify(body) });
      formElement.reset(); setNotice(result.message); await loadItems(); setParams({ view: "mine" });
    } catch (requestError) { setError(requestError.message); }
    finally { setSubmitting(false); }
  }

  const visible = useMemo(() => {
    const source = view === "mine" ? items.filter((item) => String(item.seller?._id) === String(profile?._id)) : items;
    const query = search.toLowerCase().trim();
    return query ? source.filter((item) => [item.title, item.category, item.condition, item.location].some((value) => value.toLowerCase().includes(query))) : source;
  }, [items, profile, search, view]);

  return <div className="explore-page"><Navbar /><main className="explore-main listing-main"><Link className="back-link" to="/dashboard">← Back to my profile</Link><section className="explore-heading"><p className="kicker">CAMPUS MARKETPLACE</p><h1>{view === "post" ? "Sell something useful." : view === "mine" ? "Your marketplace posts." : "Useful finds from your community."}</h1><p>{view === "post" ? "Give an item a new home by sharing it with students in your campus community." : view === "mine" ? "See the products you have listed for sale." : "Buy affordable items directly from students around your campus."}</p></section>
    {profile?.role === "student" && <nav className="tuition-tabs"><Link className={view === "browse" ? "active" : ""} to="/marketplace?view=browse">Browse items</Link><Link className={view === "post" ? "active" : ""} to="/marketplace?view=post">Sell an item</Link><Link className={view === "mine" ? "active" : ""} to="/marketplace?view=mine">My items</Link></nav>}
    {error && <p className="notice notice-error">{error}</p>}{notice && <p className="notice">{notice}</p>}
    {view === "post" && profile?.role === "student" ? <section className="tuition-form-card"><div className="section-heading"><p className="kicker">NEW MARKETPLACE POST</p><h2>Item details</h2></div><form className="tuition-form" onSubmit={createItem}>
      <label>Product name<input name="title" required maxLength="120" placeholder="e.g. Study table with chair" /></label><label>Category<select name="category" required defaultValue=""><option value="" disabled>Select category</option><option>Electronics</option><option>Furniture</option><option>Books</option><option>Transport</option><option>Appliances</option><option>Other</option></select></label>
      <label>Condition<select name="condition" required defaultValue="Good"><option>Like New</option><option>Good</option><option>Used</option></select></label><label>Price (Tk)<input name="price" required type="number" min="1" placeholder="e.g. 2500" /></label>
      <label className="wide-field">Location<input name="location" required maxLength="160" placeholder="e.g. Khulna University" /></label><label className="wide-field">Product image URL<input name="imageUrl" required type="url" placeholder="https://example.com/product-image.jpg" /></label>
      <label className="wide-field">Description<textarea name="description" maxLength="1000" rows="4" placeholder="Describe the item, its age and any important details" /></label><button className="button button-dark wide-field" disabled={submitting}>{submitting ? "Publishing…" : "Publish item for sale"}</button>
    </form></section> : <><section className="explore-toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search items, categories or locations" /></section>
    <div className="listing-result-head"><h2>{loading ? "Loading items…" : `${visible.length} items available`}</h2></div><section className="market-grid">{visible.map((item) => <article className="market-tile" key={item._id}><div className="market-image"><img src={item.imageUrl} alt={item.title} loading="lazy" />{item.isDemo && <span className="demo-pill">Demo post</span>}<span className="condition-pill">{item.condition}</span></div><div className="market-body"><p>{item.category}</p><h2>{item.title}</h2><strong>Tk {item.price.toLocaleString()}</strong><small>⌖ {item.location} · Seller: {item.seller?.name || "CampusNest user"}</small><button className="button button-dark">View item</button></div></article>)}</section></>}
  </main></div>;
}
