// E2E test for RAGAS CAREER WORLD - run with backend on :5000
require("dotenv").config({ path: "/Users/trimplingroup/Downloads/RAGAS CAREER WORLD 5/backend/.env" });
const M = require("mongoose");
const B = "http://localhost:5000";
let pass = 0, fail = 0;
const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " | " + n + (x ? " | " + x : "")); };
const J = (r) => r.json();

(async () => {
  await M.connect(process.env.MONGO_URI, { family: 4 });
  const db = M.connection;
  const bcrypt = require("bcryptjs");

  // setup temp admin
  const adminEmail = "e2e-admin@test.local";
  await db.collection("admins").deleteMany({ email: adminEmail });
  await db.collection("admins").insertOne({
    fullName: "E2E Admin", email: adminEmail, phone: "9000000001",
    password: await bcrypt.hash("E2eTest@1234", 10), role: "admin",
  });

  // 1. admin login
  let r = await fetch(B + "/api/auth/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: adminEmail, password: "E2eTest@1234" }) });
  let d = await J(r);
  ok("admin login", r.ok && d.success && d.token, d.message || "");
  const AH = { "Content-Type": "application/json", Authorization: "Bearer " + d.token };
  const AG = { Authorization: "Bearer " + d.token };

  // 2. guards
  ok("candidates 401 w/o token", (await fetch(B + "/api/candidates")).status === 401);
  ok("applications 401 w/o token", (await fetch(B + "/api/applications")).status === 401);
  ok("chatbot-logs 401 w/o token", (await fetch(B + "/api/chatbot-logs")).status === 401);
  r = await fetch(B + "/api/candidates", { headers: AG }); d = await J(r);
  ok("candidates 200 with admin token", r.ok && d.success, d.message || "");
  r = await fetch(B + "/api/applications", { headers: AG }); d = await J(r);
  ok("applications 200 with admin token", r.ok && d.success, d.message || "");
  r = await fetch(B + "/api/jobs/admin/all", { headers: AG }); d = await J(r);
  ok("jobs/admin/all 200 with token", r.ok && d.success, d.message || "");

  // 3. partner register (multipart like real site)
  const pEmail = "e2e-partner@test.local";
  const fd = new FormData();
  fd.append("companyName", "E2E Test Partners"); fd.append("partnerType", "Staffing Partner");
  fd.append("contactPerson", "E2E Tester"); fd.append("email", pEmail);
  fd.append("phone", "9000000002"); fd.append("password", "Partner@1234");
  fd.append("city", "Mumbai"); fd.append("country", "India");
  r = await fetch(B + "/api/partners", { method: "POST", body: fd });
  d = await J(r);
  ok("partner register (instant account)", r.ok && d.success, JSON.stringify(d.message || ""));

  // 4. partner login + me
  r = await fetch(B + "/api/auth/partner/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: pEmail, password: "Partner@1234" }) });
  d = await J(r);
  ok("partner login", r.ok && d.success && d.token, d.message || "");
  const PH = { "Content-Type": "application/json", Authorization: "Bearer " + d.token };
  const PG = { Authorization: "Bearer " + d.token };
  r = await fetch(B + "/api/partners/me", { headers: PG });
  d = await J(r);
  const pdata = d.data || d.partner || {};
  ok("partner /me", r.ok && d.success, "status=" + pdata.status);
  const pId = String(pdata._id);

  // 5. unverified: draft ok, publish blocked
  r = await fetch(B + "/api/jobs", { method: "POST", headers: PH, body: JSON.stringify({ jobTitle: "E2E Draft Job", companyName: "E2E Test Partners", category: "IT", location: "Mumbai", jobType: "Full Time", description: "test", openings: 3, publish: false }) });
  d = await J(r);
  const jw = d.data || d.job || {};
  ok("unverified partner saves DRAFT", r.ok && d.success, JSON.stringify(d.message || ""));
  ok("draft status = Draft", jw.status === "Draft", jw.status);
  const draftId = String(jw._id);
  r = await fetch(B + "/api/jobs", { method: "POST", headers: PH, body: JSON.stringify({ jobTitle: "E2E Pub", companyName: "E2E Test Partners", category: "IT", location: "Mumbai", jobType: "Full Time", description: "t", publish: true }) });
  d = await J(r);
  ok("unverified publish BLOCKED 403", r.status === 403, JSON.stringify(d.message || ""));
  r = await fetch(B + "/api/partners/jobs/" + draftId + "/publish", { method: "PATCH", headers: PG });
  d = await J(r);
  ok("publish endpoint blocks unverified 403", r.status === 403, JSON.stringify(d.message || ""));

  // 6. admin verifies partner (password must survive)
  r = await fetch(B + "/api/partners/" + pId + "/approve", { method: "PATCH", headers: AH });
  d = await J(r);
  ok("admin verify partner", r.ok && d.success, JSON.stringify(d.message || ""));
  r = await fetch(B + "/api/auth/partner/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: pEmail, password: "Partner@1234" }) });
  ok("partner password NOT reset by approval", r.ok);

  // 7. verified: publish works -> Pending queue
  r = await fetch(B + "/api/partners/jobs/" + draftId + "/publish", { method: "PATCH", headers: PG });
  d = await J(r);
  ok("verified partner PUBLISHES draft", r.ok && d.success, JSON.stringify(d.message || ""));
  r = await fetch(B + "/api/partners/jobs/" + draftId, { headers: PG });
  d = await J(r);
  ok("published job = Pending for admin", (d.data || d.job || {}).status === "Pending");

  // 8. admin approves -> public
  r = await fetch(B + "/api/jobs/" + draftId + "/status", { method: "PATCH", headers: AH, body: JSON.stringify({ status: "Approved" }) });
  d = await J(r);
  ok("admin approve job", r.ok && d.success, JSON.stringify(d.message || ""));
  r = await fetch(B + "/api/jobs/" + draftId);
  d = await J(r);
  ok("public sees approved job", r.ok && d.success);
  ok("openings persisted (U5)", (d.data || {}).openings === 3, "openings=" + (d.data || {}).openings);

  // 9. user register + login + apply
  const uEmail = "e2e-user@test.local";
  r = await fetch(B + "/api/auth/user/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: "E2E User", email: uEmail, phone: "9000000003", password: "User@12345", location: "Pune" }) });
  d = await J(r);
  ok("user register", r.ok && d.success, JSON.stringify(d.message || ""));
  r = await fetch(B + "/api/auth/user/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: uEmail, password: "User@12345" }) });
  d = await J(r);
  ok("user login", r.ok && d.success && d.token, d.message || "");
  const UG = { Authorization: "Bearer " + d.token };
  const fd2 = new FormData();
  fd2.append("jobId", draftId); fd2.append("jobTitle", "E2E Draft Job");
  fd2.append("fullName", "E2E User"); fd2.append("email", uEmail); fd2.append("phone", "9000000003");
  fd2.append("resume", new Blob(["%PDF-1.4 e2e"], { type: "application/pdf" }), "e2e-resume.pdf");
  r = await fetch(B + "/api/applications", { method: "POST", headers: UG, body: fd2 });
  d = await J(r);
  const aw = d.data || d.application || {};
  ok("user applies with resume", r.ok && d.success, JSON.stringify(d.message || ""));
  ok("application linked to partner", !!aw.partnerId);
  ok("originalFileName stored (B4b)", !!aw.originalFileName, aw.originalFileName || "");
  const appId = String(aw._id);
  const resumeFile = aw.resumeFile;

  // 10. tracking + admin status + no-token blocked
  r = await fetch(B + "/api/applications/candidate?email=" + encodeURIComponent(uEmail), { headers: UG });
  d = await J(r);
  ok("user tracks own application", r.ok && d.success && (d.data || []).length === 1);
  r = await fetch(B + "/api/applications/" + appId + "/status", { method: "PATCH", headers: AH, body: JSON.stringify({ status: "Shortlisted" }) });
  d = await J(r);
  ok("admin updates status", r.ok && d.success, JSON.stringify(d.message || ""));
  r = await fetch(B + "/api/applications/" + appId + "/status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Selected" }) });
  ok("status change 401 w/o token", r.status === 401);

  // 11. partner sees application + chatbot lead + dedupe
  r = await fetch(B + "/api/partners/applications", { headers: PG });
  d = await J(r);
  ok("partner sees own application", r.ok && d.success && (d.data || []).length >= 1, (d.data || []).length + " apps");
  r = await fetch(B + "/api/candidates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "E2E Lead", email: "e2e-lead@test.local", phone: "9000000004", skills: "React" }) });
  d = await J(r);
  ok("chatbot lead created (U4)", r.ok && d.success, JSON.stringify(d.message || ""));
  r = await fetch(B + "/api/candidates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "E2E Lead 2", email: "e2e-lead@test.local", phone: "9000000004" }) });
  d = await J(r);
  ok("chatbot dedupe by email", r.ok && d.success && (d.data || {}).name === "E2E Lead", (d.data || {}).name);

  // resume download
  r = await fetch(B + "/api/applications/resume/" + encodeURIComponent(resumeFile));
  ok("resume file downloadable", r.ok, String(r.status));

  // cleanup
  console.log("\n--- cleanup ---");
  await db.collection("jobs").deleteOne({ _id: new M.Types.ObjectId(draftId) });
  await db.collection("partners").deleteMany({ email: pEmail });
  await db.collection("users").deleteMany({ email: uEmail });
  await db.collection("applications").deleteMany({ email: uEmail });
  await db.collection("candidates").deleteMany({ email: "e2e-lead@test.local" });
  await db.collection("admins").deleteMany({ email: adminEmail });
  const fs = require("fs");
  const dir = "/Users/trimplingroup/Downloads/RAGAS CAREER WORLD 5/backend/uploads/applications";
  try {
    fs.readdirSync(dir).filter((f) => f === resumeFile).forEach((f) => fs.unlinkSync(dir + "/" + f));
    console.log("test resume file removed");
  } catch (e) { console.log("upload cleanup note:", e.message); }
  console.log("DB cleanup done (admin/partner/user/job/application/candidate)");
  console.log("\nRESULT: " + pass + " passed, " + fail + " failed");
  await M.disconnect();
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("E2E CRASH:", e.message); process.exit(1); });
