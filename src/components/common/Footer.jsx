import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer"><div><Link to="/" className="brand"><span className="brand-mark">⌂</span>Campus<span>Nest</span></Link><p>{t("A trusted place for every part of student life.")}</p></div><div className="footer-links"><a href="#homes">{t("Find a home")}</a><a href="#opportunities">{t("Opportunities")}</a><Link to="/login">{t("Log in")}</Link></div><p className="copyright">© {new Date().getFullYear()} CampusNest · {t("Khulna University")}</p></footer>
  );
}
