import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../../components/common/Navbar";
import { auth } from "../../lib/firebase";
import { authRequest, publicRequest } from "../../lib/api";

export default function HomeDashboard() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, async (user) => { setFirebaseUser(user); if (user) { try { setProfile((await authRequest("/auth/me", user)).user); } catch { setProfile(null); } } }); publicRequest("/homes").then((data) => setListings(data.listings)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)); return unsubscribe; }, []);
  async function createListing(event) { event.preventDefault(); setError(""); const body = Object.fromEntries(new FormData(event.currentTarget).entries()); try { const result = await authRequest("/homes", firebaseUser, { method: "POST", body: JSON.stringify(body) }); setListings((current) => [result.listing, ...current]); event.currentTarget.reset(); } catch (requestError) { setError(requestError.message); } }
  const visible = useMemo(() => { const query = search.toLowerCase().trim(); return query ? listings.filter((item) => [item.title, item.location, item.propertyType, item.genderPreference].some((value) => value.toLowerCase().includes(query))) : listings; }, [listings, search]);

  return <div className="explore-page"><Navbar /><main className="explore-main listing-main"><Link className="back-link" to="/dashboard">← Back to my profile</Link><section className="explore-heading"><p className="kicker">HOME & MESS</p><h1>Find a place that feels like home.</h1><p>Explore available rooms, flats and mess seats around Khulna.</p></section>
    <section className="explore-toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search by area, type or preference" /></section>
    {profile && (profile.role === "student" || profile.role === "homeowner") && <section className="tuition-form-card home-post-form"><div className="section-heading"><p className="kicker">POST A MESS</p><h2>Share a mess seat</h2></div><form className="tuition-form" onSubmit={createListing}><label>Title<input name="title" required placeholder="e.g. 2 seats in a student mess" /></label><label>Location<input name="location" required placeholder="e.g. Sonadanga, Khulna" /></label><label>Monthly rent (Tk)<input name="rent" required type="number" min="1" /></label><label>Available seats<input name="availableSeats" required type="number" min="1" step="1" /></label><label>Gender preference<select name="genderPreference" defaultValue="Any"><option>Any</option><option>Male</option><option>Female</option></select></label><label>Image URL<input name="imageUrl" required type="url" placeholder="https://..." /></label><label className="wide-field">Details<textarea name="description" rows="3" placeholder="Wifi, dining, utilities or other details" /></label><button className="button button-dark wide-field" type="submit">Publish mess post</button></form></section>}
    {error && <p className="notice notice-error">{error}</p>}<div className="listing-result-head"><h2>{loading ? "Loading homes…" : `${visible.length} places available`}</h2></div>
    <section className="listing-grid">{visible.map((item) => <article className="listing-tile" key={item._id}><div className="listing-image"><img src={item.imageUrl} alt={item.title} loading="lazy" /><b>{item.availableSeats} seat{item.availableSeats === 1 ? "" : "s"} available</b></div><div className="listing-body"><p className="listing-category">{item.propertyType} · {item.genderPreference}</p><h2>{item.title}</h2><p className="listing-location">⌖ {item.location}</p><p>{item.description}</p><div className="listing-bottom"><strong>Tk {item.rent.toLocaleString()}<small>/month</small></strong><button className="button button-dark">View details</button></div></div></article>)}</section>
  </main></div>;
}
