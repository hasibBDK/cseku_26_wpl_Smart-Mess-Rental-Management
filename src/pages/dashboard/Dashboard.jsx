import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { auth } from "../../lib/firebase";
import { authRequest } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";

const roleContent = {
  student: {
    label: "Student",
    title: "Your student profile",
    description: "Find a suitable home, explore tuition opportunities and connect with the CampusNest community.",
    actions: [["⌂", "Find a home", "Browse available rooms and mess seats", "/homes"], ["⌁", "Explore tuition", "Find tuition opportunities near you", "/tuition"], ["◫", "Buy or sell", "Trade useful items with students", "/marketplace"]],
  },
  homeowner: {
    label: "Home / Mess Owner",
    title: "Your owner profile",
    description: "Publish your available rooms or seats and manage interested students from one place.",
    actions: [["+", "Post a listing", "Add a home, room or available mess seat", "/homes"], ["⌂", "My listings", "Review and update your published spaces", "/homes"], ["✓", "Student requests", "See students interested in your listings", "/homes"]],
  },
  guardian: {
    label: "Guardian",
    title: "Your guardian profile",
    description: "Post tuition requirements and connect with suitable student tutors in your area.",
    actions: [["+", "Post tuition", "Create a new tuition requirement", "/tuition?view=post"], ["⌁", "My tuition posts", "Manage your active requirements", "/tuition?view=mine"], ["✓", "Tutor applications", "Review interested tutor profiles", "/tuition?view=applicants"]],
  },
  admin: {
    label: "Administrator",
    title: "Administration profile",
    description: "Manage CampusNest users, listings and community activity.",
    actions: [["♙", "Manage users", "Review registered user accounts", "/dashboard"], ["⌂", "Review listings", "Approve or remove community posts", "/homes"], ["◫", "Platform overview", "See CampusNest activity at a glance", "/dashboard"]],
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) return navigate("/login", { replace: true });
    try { setProfile((await authRequest("/auth/me", firebaseUser)).user); }
    catch (requestError) { setError(requestError.message); }
  }), [navigate]);

  async function logout() {
    await signOut(auth);
    navigate("/", { replace: true });
  }

  const content = profile ? (roleContent[profile.role] || roleContent.student) : null;

  return <div className="profile-page"><Navbar /><main className="profile-main">
    {error ? <section className="profile-loading"><p className="notice notice-error">{error}</p><Link to="/">Back to home</Link></section> : !profile ? <section className="profile-loading"><p>Loading your account…</p></section> : <>
      <section className="profile-hero"><div className="profile-avatar">{profile.name.charAt(0).toUpperCase()}</div><div><p className="kicker">{t("SIGNED IN")}</p><h1>{t("Welcome, {name}", { name: profile.name })}</h1><span className="role-badge">{t(content.label)}</span><p>{t(content.description)}</p></div></section>
      <section className="profile-layout"><div className="profile-info"><div className="section-heading"><p className="kicker">{t("ACCOUNT")}</p><h2>{t(content.title)}</h2></div><dl><div><dt>{t("Full name")}</dt><dd>{profile.name}</dd></div><div><dt>{t("Email address")}</dt><dd>{profile.email}</dd></div><div><dt>{t("Account type")}</dt><dd>{t(content.label)}</dd></div><div><dt>{t("Member since")}</dt><dd>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "CampusNest member"}</dd></div></dl><button className="button button-dark" onClick={logout}>{t("Log out")}</button></div>
      <div className="profile-actions"><div className="section-heading"><p className="kicker">{t("QUICK ACTIONS")}</p><h2>{t("What would you like to do?")}</h2></div><div className="action-grid">{content.actions.map(([icon, title, description, path]) => <Link to={path} className="action-card" key={title}><span>{icon}</span><div><h3>{t(title)}</h3><p>{t(description)}</p></div><b>→</b></Link>)}</div></div></section>
    </>}
  </main></div>;
}
