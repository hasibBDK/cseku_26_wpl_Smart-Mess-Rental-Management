import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="site-footer"><div><Link to="/" className="brand"><span className="brand-mark">⌂</span>Campus<span>Nest</span></Link><p>A trusted place for every part of student life.</p></div><div className="footer-links"><a href="#homes">Find a home</a><a href="#opportunities">Opportunities</a><Link to="/login">Log in</Link></div><p className="copyright">© {new Date().getFullYear()} CampusNest · Khulna University</p></footer>
  );
}
