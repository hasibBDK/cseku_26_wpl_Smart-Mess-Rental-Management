import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { useLanguage } from "../../context/LanguageContext";

const pages = {
  homes: {
    kicker: "HOME & MESS",
    title: "Find a place that feels right.",
    description: "Browse rooms, flats and mess seats shared by CampusNest homeowners.",
    search: "Search by area or location",
    emptyTitle: "Home listings are coming next",
    emptyText: "This dashboard is ready. Published home and mess listings will appear here.",
  },
  tuition: {
    kicker: "TUITION",
    title: "Find the right tuition match.",
    description: "Explore tuition opportunities posted by guardians and students.",
    search: "Search by subject or location",
    emptyTitle: "Tuition posts are coming next",
    emptyText: "This dashboard is ready. New tuition requirements will appear here.",
  },
  marketplace: {
    kicker: "BUY & SELL",
    title: "Your campus marketplace.",
    description: "Discover useful items offered by students in the CampusNest community.",
    search: "Search campus items",
    emptyTitle: "Marketplace posts are coming next",
    emptyText: "This dashboard is ready. Products listed by students will appear here.",
  },
};

export default function Explore({ type }) {
  const { t } = useLanguage();
  const page = pages[type];
  return <div className="explore-page"><Navbar /><main className="explore-main">
    <Link className="back-link" to="/dashboard">← {t("Back to my profile")}</Link>
    <section className="explore-heading"><p className="kicker">{t(page.kicker)}</p><h1>{t(page.title)}</h1><p>{t(page.description)}</p></section>
    <section className="explore-toolbar"><input type="search" placeholder={t(page.search)} aria-label={t(page.search)} /><button className="button button-dark" type="button">{t("Search")}</button></section>
    <section className="empty-state"><span>{type === "homes" ? "⌂" : type === "tuition" ? "⌁" : "◫"}</span><h2>{t(page.emptyTitle)}</h2><p>{t(page.emptyText)}</p></section>
  </main></div>;
}
