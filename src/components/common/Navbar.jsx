import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { authRequest } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";

export default function Navbar({ simple = false }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(undefined);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    if (!currentUser) { setRole(null); setLanguage("en"); return; }
    try {
      const currentRole = (await authRequest("/auth/me", currentUser)).user.role;
      setRole(currentRole);
      if (currentRole !== "guardian") setLanguage("en");
    }
    catch { setRole(null); setLanguage("en"); }
  }), [setLanguage]);

  async function logout() {
    await signOut(auth);
    setOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <header className={`nav-shell ${simple ? "nav-simple" : ""}`}>
      <Link to="/" className="brand"><span className="brand-mark">⌂</span>Campus<span>Nest</span></Link>
      {!simple && <><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu"><i /><i /><i /></button><nav className={`nav-links ${open ? "is-open" : ""}`}><Link className="nav-option" to="/homes"><span>⌂</span> {t("Find Home/Mess")}</Link>{role !== "guardian" && <Link className="nav-option" to="/tuition"><span>⌁</span> {t("Find Tuition")}</Link>}<Link className="nav-option" to="/marketplace"><span>◫</span> {t("Buy/Sell")}</Link></nav></>}
      <div className="nav-actions">
        {role === "guardian" && <div className="language-switch" aria-label="Language"><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">EN</button><button className={language === "bn" ? "active" : ""} onClick={() => setLanguage("bn")} type="button">বাংলা</button></div>}
        {user === undefined ? null : user ? <><Link className="login-link profile-link" to="/dashboard">{t("My profile")}</Link><button className="button button-dark" type="button" onClick={logout}>{t("Log out")}</button></> : <><Link className="login-link" to="/login">{t("Log in")}</Link><Link className="button button-dark" to="/login?mode=signup">{t("Join CampusNest")} <span>↗</span></Link></>}
      </div>
    </header>
  );
}
