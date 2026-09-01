import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ simple = false }) {
  const [open,setOpen]=useState(false); const location=useLocation();
  const href=(hash)=>location.pathname==="/"?hash:`/${hash}`;
  return (
    <header className={`nav-shell ${simple?"nav-simple":""}`}>
      <Link to="/" className="brand"><span className="brand-mark">⌂</span>Campus<span>Nest</span></Link>
      {!simple&&<><button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle menu"><i/><i/><i/></button><nav className={`nav-links ${open?"is-open":""}`}><a href={href("#homes")}>Find a home</a><a href={href("#opportunities")}>Jobs &amp; tuition</a><a href={href("#community")}>Our community</a></nav></>}
      <div className="nav-actions"><Link className="login-link" to="/login">Log in</Link><Link className="button button-dark" to="/login?mode=signup">Join CampusNest <span>↗</span></Link></div>
    </header>
  );
}
