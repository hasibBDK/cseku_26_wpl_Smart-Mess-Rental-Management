import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { auth } from "../../lib/firebase";
import { authRequest } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";

export default function TuitionDashboard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const guardianView = ["post", "mine", "applicants"].includes(params.get("view")) ? params.get("view") : "mine";

  async function load(user) {
    const [account, tuitionData] = await Promise.all([
      authRequest("/auth/me", user),
      authRequest("/tuitions", user),
    ]);
    setProfile(account.user);
    setPosts(tuitionData.posts);
  }

  useEffect(() => onAuthStateChanged(auth, async (user) => {
    if (!user) return navigate("/login", { replace: true });
    setFirebaseUser(user);
    try { await load(user); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }), [navigate]);

  async function createPost(event) {
    event.preventDefault();
    setSubmitting(true); setError(""); setNotice("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());
    try {
      await authRequest("/tuitions", firebaseUser, { method: "POST", body: JSON.stringify(body) });
      formElement.reset();
      setNotice("Your tuition requirement is now live.");
      await load(firebaseUser);
      setParams({ view: "mine" });
    } catch (requestError) { setError(requestError.message); }
    finally { setSubmitting(false); }
  }

  async function apply(postId) {
    setError(""); setNotice("");
    try {
      const result = await authRequest(`/tuitions/${postId}/apply`, firebaseUser, { method: "POST" });
      setNotice(result.message);
      await load(firebaseUser);
    } catch (requestError) { setError(requestError.message); }
  }

  async function selectStudent(postId, studentId) {
    setError(""); setNotice("");
    try {
      const result = await authRequest(`/tuitions/${postId}/select/${studentId}`, firebaseUser, { method: "PATCH" });
      setNotice(result.message);
      await load(firebaseUser);
    } catch (requestError) { setError(requestError.message); }
  }

  const visiblePosts = useMemo(() => {
    const rolePosts = profile?.role === "guardian" ? posts.filter((post) => String(post.guardian?._id) === String(profile._id)) : posts;
    const query = search.trim().toLowerCase();
    if (!query) return rolePosts;
    return rolePosts.filter((post) => [post.childClass, post.subject, post.expectedDepartment, post.location].some((value) => value.toLowerCase().includes(query)));
  }, [posts, profile, search]);

  const guardianHeading = guardianView === "post" ? ["Post a tuition requirement.", "Tell students what kind of tutor your child needs."] : guardianView === "applicants" ? ["Choose the right student tutor.", "Review applicants for your tuition posts and select one student."] : ["Manage your tuition posts.", "See the requirements you have published and their current status."];

  return <div className="explore-page"><Navbar /><main className="explore-main tuition-main">
    <Link className="back-link" to="/dashboard">← {t("Back to my profile")}</Link>
    <section className="explore-heading"><p className="kicker">{t("Tuition")}</p><h1>{t(profile?.role === "guardian" ? guardianHeading[0] : "Find the right tuition match.")}</h1><p>{t(profile?.role === "guardian" ? guardianHeading[1] : "Explore tuition opportunities posted by guardians and apply directly.")}</p></section>
    {error && <p className="notice notice-error" role="alert">{t(error)}</p>}{notice && <p className="notice" role="status">{t(notice)}</p>}

    {profile?.role === "guardian" && guardianView === "post" && <section className="tuition-form-card"><div className="section-heading"><p className="kicker">{t("NEW REQUIREMENT")}</p><h2>{t("Post a tuition")}</h2></div><form className="tuition-form" onSubmit={createPost}>
      <label>{t("Child's class")}<input name="childClass" required maxLength="50" placeholder={language === "bn" ? "যেমন: অষ্টম শ্রেণি" : "e.g. Class 8"} /></label>
      <label>{t("Subject")}<input name="subject" required maxLength="100" placeholder={language === "bn" ? "যেমন: গণিত ও বিজ্ঞান" : "e.g. Mathematics and Science"} /></label>
      <label>{t("Expected teacher department")}<input name="expectedDepartment" required maxLength="100" placeholder={language === "bn" ? "যেমন: সিএসই বা গণিত" : "e.g. CSE, Mathematics or any department"} /></label>
      <label>{t("Offered salary (Tk/month)")}<input name="offeredSalary" required type="number" min="1" placeholder="e.g. 5000" /></label>
      <label className="wide-field">{t("Location")}<input name="location" required maxLength="160" placeholder={language === "bn" ? "যেমন: সোনাডাঙ্গা, খুলনা" : "e.g. Sonadanga, Khulna"} /></label>
      <label className="wide-field">{t("More details")}<textarea name="description" maxLength="1000" rows="4" placeholder={language === "bn" ? "সময়সূচি, শিক্ষকের লিঙ্গ বা অন্য প্রয়োজন" : "Preferred schedule, teacher gender or other requirements"} /></label>
      <button className="button button-dark wide-field" disabled={submitting} type="submit">{t(submitting ? "Publishing…" : "Publish tuition requirement")}</button>
    </form></section>}

    {(profile?.role !== "guardian" || guardianView !== "post") && <><section className="explore-toolbar"><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Search by class, subject, department or location")} aria-label={t("Search by class, subject, department or location")} /></section>
    <section className="tuition-list"><div className="section-heading"><p className="kicker">{t(profile?.role === "guardian" ? guardianView === "applicants" ? "TUTOR APPLICATIONS" : "MY TUITION POSTS" : "AVAILABLE POSTS")}</p><h2>{loading ? t("Loading tuition posts…") : language === "bn" ? `${visiblePosts.length}টি টিউশন পোস্ট` : `${visiblePosts.length} tuition ${visiblePosts.length === 1 ? "post" : "posts"}`}</h2></div>
      {!loading && !visiblePosts.length ? <div className="empty-state"><span>⌁</span><h2>{t("No tuition posts found")}</h2><p>{t("Guardian tuition requirements will appear here after they are published.")}</p></div> : visiblePosts.map((post) => <article className="tuition-card" key={post._id}>
        <div className="tuition-card-head"><div><span className={`status-pill ${post.status}`}>{t(post.status === "open" ? "Accepting applications" : "Student selected")}</span><h2>{post.subject}</h2><p>{language === "bn" ? `${post.childClass}-এর জন্য` : `For ${post.childClass}`}</p></div><strong>{language === "bn" ? `${post.offeredSalary.toLocaleString()} টাকা` : `Tk ${post.offeredSalary.toLocaleString()}`}<small>{language === "bn" ? "/ মাস" : "/ month"}</small></strong></div>
        <div className="tuition-meta"><span>⌖ {post.location}</span><span>{t("Expected department")}: {post.expectedDepartment}</span><span>{t("Posted by")} {post.guardian?.name || t("Guardian")}</span><span>{language === "bn" ? `${post.applicantCount} জন আবেদনকারী` : `${post.applicantCount} applicant${post.applicantCount === 1 ? "" : "s"}`}</span></div>
        {post.description && <p className="tuition-description">{post.description}</p>}
        {profile?.role === "student" && <button className="button button-dark" disabled={post.hasApplied || post.status !== "open"} onClick={() => apply(post._id)}>{t(post.hasApplied ? "Applied" : post.status === "open" ? "Apply for this tuition" : "Applications closed")}</button>}
        {profile?.role === "guardian" && guardianView === "applicants" && <div className="applicant-panel"><h3>{t("Student applicants")}</h3>{!post.applicants?.length ? <p>{t("No student has applied yet.")}</p> : post.applicants.map(({ student }) => <div className="applicant-row" key={student._id}><div className="mini-avatar">{student.name.charAt(0).toUpperCase()}</div><div><strong>{student.name}</strong><small>{student.email}</small></div><button className="button button-dark" disabled={post.status === "selected"} onClick={() => selectStudent(post._id, student._id)}>{t(String(post.selectedStudent?._id) === String(student._id) ? "Selected" : "Select student")}</button></div>)}</div>}
      </article>)}
    </section></>}
  </main></div>;
}
