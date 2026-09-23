import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { publicRequest } from "../../lib/api";

export default function HomeDashboard() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { publicRequest("/homes").then((data) => setListings(data.listings)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)); }, []);
  const visible = useMemo(() => { const query = search.toLowerCase().trim(); return query ? listings.filter((item) => [item.title, item.location, item.propertyType, item.genderPreference].some((value) => value.toLowerCase().includes(query))) : listings; }, [listings, search]);

  return <div className="explore-page"><Navbar /><main className="explore-main listing-main"><Link className="back-link" to="/dashboard">← Back to my profile</Link><section className="explore-heading"><p className="kicker">HOME & MESS</p><h1>Find a place that feels like home.</h1><p>Explore available rooms, flats and mess seats around Khulna.</p></section>
    <section className="explore-toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search by area, type or preference" /></section>
    {error && <p className="notice notice-error">{error}</p>}<div className="listing-result-head"><h2>{loading ? "Loading homes…" : `${visible.length} places available`}</h2></div>
    <section className="listing-grid">{visible.map((item) => <article className="listing-tile" key={item._id}><div className="listing-image"><img src={item.imageUrl} alt={item.title} loading="lazy" />{item.isDemo && <span className="demo-pill">Demo post</span>}<b>{item.availableSeats} seat{item.availableSeats === 1 ? "" : "s"} available</b></div><div className="listing-body"><p className="listing-category">{item.propertyType} · {item.genderPreference}</p><h2>{item.title}</h2><p className="listing-location">⌖ {item.location}</p><p>{item.description}</p><div className="listing-bottom"><strong>Tk {item.rent.toLocaleString()}<small>/month</small></strong><button className="button button-dark">View details</button></div></div></article>)}</section>
  </main></div>;
}
