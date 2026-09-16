const COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Kiambu","Nakuru","Uasin Gishu","Kisii",
  "Machakos","Kajiado","Nyeri","Meru","Kilifi","Kakamega","Bungoma","Garissa"
];

const SEED = [
  { id: "p1", name: "Amina", age: 26, county: "Mombasa", town: "Nyali", dist: 3.2, mode: "Professional", religion: "Muslim",
    bio: "Coast sunsets, chai, and late walks on Nyali.", interests: ["travel","food","faith"],
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop" },
  { id: "p2", name: "Brian", age: 29, county: "Nairobi", town: "Westlands", dist: 1.4, mode: "Professional", religion: "Christian",
    bio: "Product designer in Westlands. Weekend football in Kasarani.", interests: ["design","football","coffee"],
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop" },
  { id: "p3", name: "Wanjiku", age: 24, county: "Kiambu", town: "Ruiru", dist: 8.1, mode: "Student", religion: "Christian",
    bio: "Student mode. Books, gospel playlists, Thika Road survivor.", interests: ["books","church","running"],
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop" },
  { id: "p4", name: "Otieno", age: 31, county: "Kisumu", town: "Milimani", dist: 12.0, mode: "Professional", religion: "Christian",
    bio: "Lake air and tilapia. Looking for someone kind, not loud.", interests: ["music","lake","family"],
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop" },
  { id: "p5", name: "Faith", age: 27, county: "Nakuru", town: "Milimani", dist: 18.5, mode: "Church", religion: "Christian",
    bio: "Nurse. Flamingos, hiking Menengai, quiet Sundays.", interests: ["health","hiking","church"],
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop" },
  { id: "p6", name: "Kevin", age: 28, county: "Uasin Gishu", town: "Eldoret", dist: 22.0, mode: "Professional", religion: "Christian",
    bio: "Eldoret mornings. Training, work, then nyama.", interests: ["running","work","food"],
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop" },
  { id: "p7", name: "Mercy", age: 23, county: "Nairobi", town: "Kilimani", dist: 2.6, mode: "Student", religion: "Christian",
    bio: "Campus hustle and Sunday service. Soft life, serious growth.", interests: ["fashion","gospel","netflix"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop" },
  { id: "p8", name: "Hassan", age: 28, county: "Mombasa", town: "Bamburi", dist: 6.0, mode: "Professional", religion: "Muslim",
    bio: "Old Town weekends. Can handle quiet dinners and loud weddings.", interests: ["history","football","tea"],
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop" }
];

const store = {
  get users() { return JSON.parse(localStorage.getItem("km_users") || "[]"); },
  set users(v) { localStorage.setItem("km_users", JSON.stringify(v)); },
  get session() { return JSON.parse(localStorage.getItem("km_session") || "null"); },
  set session(v) { v ? localStorage.setItem("km_session", JSON.stringify(v)) : localStorage.removeItem("km_session"); },
  get likes() { return JSON.parse(localStorage.getItem("km_likes") || "{}"); },
  set likes(v) { localStorage.setItem("km_likes", JSON.stringify(v)); },
  get chats() { return JSON.parse(localStorage.getItem("km_chats") || "{}"); },
  set chats(v) { localStorage.setItem("km_chats", JSON.stringify(v)); },
  get reports() { return JSON.parse(localStorage.getItem("km_reports") || "[]"); },
  set reports(v) { localStorage.setItem("km_reports", JSON.stringify(v)); }
};

const $ = (s) => document.querySelector(s);
const countyPills = $("#countyPills");
if (countyPills) countyPills.innerHTML = COUNTIES.map(c => `<span class="pill">${c}</span>`).join("");

let signupMode = false;
let deckIndex = 0;
let filterCounty = "All";
let filterMode = "All";
let activeChat = null;

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function currentUser() {
  const s = store.session;
  if (!s) return null;
  return store.users.find(u => u.email === s.email) || null;
}

function openAuth() { $("#authModal").classList.remove("hidden"); }
function closeAuth() { $("#authModal").classList.add("hidden"); }

$("#navAuth")?.addEventListener("click", openAuth);
$("#startBtn")?.addEventListener("click", () => { signupMode = true; syncAuthCopy(); openAuth(); });
$("#demoBtn")?.addEventListener("click", () => { ensureDemoUser(); enterApp(); });
$("#closeAuth")?.addEventListener("click", closeAuth);
$("#toggleAuth")?.addEventListener("click", () => { signupMode = !signupMode; syncAuthCopy(); });

function syncAuthCopy() {
  $("#authTitle").textContent = signupMode ? "Create your account" : "Welcome back";
  $("#toggleAuth").textContent = signupMode ? "Sign in instead" : "Create an account";
}

$("#authForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = String(fd.get("email")).toLowerCase();
  const password = String(fd.get("password"));
  let users = store.users;
  if (signupMode) {
    if (users.some(u => u.email === email)) return toast("Account exists. Sign in.");
    users.push({
      email, password, name: email.split("@")[0], age: 25,
      county: "Nairobi", bio: "New on Karibu Match.", interests: ["music"],
      mode: "Professional", lat: -1.2921, lng: 36.8219
    });
    store.users = users;
  } else {
    const u = users.find(x => x.email === email && x.password === password);
    if (!u) return toast("Check email or password.");
  }
  store.session = { email };
  closeAuth();
  enterApp();
});

function ensureDemoUser() {
  let users = store.users;
  if (!users.some(u => u.email === "demo@karibu.match")) {
    users.push({
      email: "demo@karibu.match", password: "demo", name: "Sam", age: 27,
      county: "Nairobi", bio: "Exploring nearby connections across Kenya.",
      interests: ["travel","food"], mode: "Professional", lat: -1.2921, lng: 36.8219
    });
    store.users = users;
  }
  store.session = { email: "demo@karibu.match" };
}

function requestLocation() {
  if (!navigator.geolocation) return toast("Geolocation not supported in this browser.");
  navigator.geolocation.getCurrentPosition((pos) => {
    const users = store.users;
    const u = currentUser();
    if (!u) return;
    const i = users.findIndex(x => x.email === u.email);
    users[i].lat = pos.coords.latitude;
    users[i].lng = pos.coords.longitude;
    users[i].located = true;
    store.users = users;
    toast("Location saved on this device.");
    render("profile");
  }, () => toast("Location permission denied. Pick a county instead."));
}

function enterApp() {
  document.querySelector("main")?.classList.add("hidden");
  document.querySelector(".nav")?.classList.add("hidden");
  document.querySelector("footer")?.classList.add("hidden");
  $("#appShell").classList.remove("hidden");
  render("discover");
}

$("#logoutBtn")?.addEventListener("click", () => {
  store.session = null;
  location.reload();
});

document.querySelectorAll(".side-link[data-view]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-link").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.view);
  });
});

function meKey() { return currentUser()?.email || "anon"; }
function likedSet() { return new Set(store.likes[meKey()] || []); }
function matches() {
  const mine = likedSet();
  return SEED.filter(p => mine.has(p.id));
}

function pool() {
  return SEED.filter(p =>
    (filterCounty === "All" || p.county === filterCounty) &&
    (filterMode === "All" || p.mode === filterMode)
  ).sort((a, b) => a.dist - b.dist);
}

function render(view) {
  const ws = $("#workspace");
  if (view === "discover") ws.innerHTML = discoverHTML();
  if (view === "likes") ws.innerHTML = listHTML("People you liked", [...likedSet()].map(id => SEED.find(p => p.id === id)).filter(Boolean));
  if (view === "matches") ws.innerHTML = listHTML("Matches", matches(), true);
  if (view === "chat") ws.innerHTML = chatHTML();
  if (view === "profile") ws.innerHTML = profileHTML();
  if (view === "safety") ws.innerHTML = safetyHTML();
  bindView(view);
}

function discoverHTML() {
  const list = pool();
  const p = list[deckIndex % Math.max(list.length, 1)];
  if (!list.length) return "<p class=lede>No people in this filter set.</p>";
  return `
    <div class="filters">
      <select id="countyFilter">
        <option>All</option>
        ${COUNTIES.map(c => `<option ${c===filterCounty?"selected":""}>${c}</option>`).join("")}
      </select>
      <select id="modeFilter">
        ${["All","Student","Professional","Church"].map(m => `<option ${m===filterMode?"selected":""}>${m}</option>`).join("")}
      </select>
      <span class="pill">Nearby first</span>
    </div>
    <div class="deck">
      <article class="person">
        <div class="photo" style="background-image:url('${p.photo}')">${p.name}, ${p.age}</div>
        <p class="meta">${p.town}, ${p.county} · ${p.dist} km · ${p.mode} · ${p.religion}</p>
        <p>${p.bio}</p>
        <p class="meta">${p.interests.map(i => "#" + i).join(" ")}</p>
        <div class="actions">
          <button class="btn ghost" id="passBtn">Pass</button>
          <button class="btn primary" id="likeBtn" data-id="${p.id}">Like</button>
        </div>
        <div class="actions">
          <button class="btn ghost" id="reportBtn" data-id="${p.id}">Report</button>
        </div>
      </article>
    </div>`;
}

function listHTML(title, people, canChat) {
  if (!people.length) return `<h2>${title}</h2><p class="lede">Nothing here yet. Like someone on Discover.</p>`;
  return `<h2>${title}</h2><div class="list">${people.map(p => `
    <div class="row">
      <div><strong>${p.name}, ${p.age}</strong><div class="meta">${p.county} · ${p.dist} km · ${p.mode}</div></div>
      ${canChat ? `<button class="btn primary open-chat" data-id="${p.id}">Chat</button>` : `<span class="pill">Liked</span>`}
    </div>`).join("")}</div>`;
}

function chatHTML() {
  const m = matches();
  const target = m.find(p => p.id === activeChat) || m[0];
  if (!target) return `<h2>Chat</h2><p class="lede">Match someone first to unlock chat.</p>`;
  const key = `${meKey()}:${target.id}`;
  const msgs = store.chats[key] || [{ from: target.name, text: `Sasa ${currentUser()?.name || ""}. Karibu.` }];
  return `
    <h2>Chat with ${target.name}</h2>
    <div class="filters">${m.map(p => `<button class="pill open-chat ${p.id===target.id?"active":""}" data-id="${p.id}">${p.name}</button>`).join("")}</div>
    <div class="chat-pane">
      <div class="msgs">${msgs.map(x => `<div class="bubble ${x.from==="me"?"me":""}">${x.text}</div>`).join("")}</div>
      <form id="chatForm" data-id="${target.id}">
        <input name="text" placeholder="Write a message…" autocomplete="off" />
        <button class="btn primary" type="submit">Send</button>
      </form>
    </div>`;
}

function profileHTML() {
  const u = currentUser() || {};
  return `
    <h2>My profile</h2>
    <form class="form-card" id="profileForm">
      <label>Name<input name="name" value="${u.name || ""}" required /></label>
      <label>Age<input name="age" type="number" min="18" max="80" value="${u.age || 25}" /></label>
      <label>County
        <select name="county">${COUNTIES.map(c => `<option ${c===u.county?"selected":""}>${c}</option>`).join("")}</select>
      </label>
      <label>Mode
        <select name="mode">${["Student","Professional","Church"].map(m => `<option ${m===u.mode?"selected":""}>${m}</option>`).join("")}</select>
      </label>
      <label>Bio<textarea name="bio" rows="4">${u.bio || ""}</textarea></label>
      <label>Interests (comma separated)<input name="interests" value="${(u.interests||[]).join(", ")}" /></label>
      <p class="meta ${u.located ? "loc-ok" : ""}">${u.located ? `GPS on · ${Number(u.lat).toFixed(3)}, ${Number(u.lng).toFixed(3)}` : "Location off. Production uses Geolocation + a geo database."}</p>
      <div class="actions">
        <button class="btn primary" type="submit">Save profile</button>
        <button class="btn ghost" type="button" id="locBtn">Use my location</button>
      </div>
    </form>`;
}

function safetyHTML() {
  const reports = store.reports.filter(r => r.by === meKey());
  return `
    <h2>Safety</h2>
    <p class="lede tight">Meet in public. Never send M-Pesa PINs or deposits to someone you have not met. Report and block stay one tap away.</p>
    <div class="card">
      <h3>Your reports on this device</h3>
      <p class="meta">${reports.length ? reports.map(r => `${r.name} · ${r.reason}`).join("<br>") : "None yet."}</p>
    </div>`;
}

function bindView(view) {
  $("#countyFilter")?.addEventListener("change", (e) => { filterCounty = e.target.value; deckIndex = 0; render("discover"); });
  $("#modeFilter")?.addEventListener("change", (e) => { filterMode = e.target.value; deckIndex = 0; render("discover"); });
  $("#passBtn")?.addEventListener("click", () => { deckIndex++; render("discover"); });
  $("#likeBtn")?.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const likes = store.likes;
    const set = new Set(likes[meKey()] || []);
    set.add(id);
    likes[meKey()] = [...set];
    store.likes = likes;
    toast("Liked. In production they must like you back.");
    deckIndex++;
    render("discover");
  });
  $("#reportBtn")?.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const p = SEED.find(x => x.id === id);
    const reason = prompt("Why are you reporting this profile?", "Fake / scam / harassment");
    if (!reason) return;
    store.reports = [...store.reports, { by: meKey(), id, name: p?.name, reason, at: Date.now() }];
    toast("Report saved on this device.");
    deckIndex++;
    render("discover");
  });
  document.querySelectorAll(".open-chat").forEach(b => b.addEventListener("click", () => {
    activeChat = b.dataset.id;
    document.querySelectorAll(".side-link").forEach(x => x.classList.remove("active"));
    document.querySelector('[data-view="chat"]')?.classList.add("active");
    render("chat");
  }));
  $("#chatForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    const text = new FormData(e.target).get("text");
    if (!text) return;
    const key = `${meKey()}:${id}`;
    const chats = store.chats;
    chats[key] = chats[key] || [];
    chats[key].push({ from: "me", text: String(text) });
    store.chats = chats;
    render("chat");
  });
  $("#profileForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const users = store.users;
    const i = users.findIndex(u => u.email === currentUser().email);
    users[i] = {
      ...users[i],
      name: fd.get("name"),
      age: Number(fd.get("age")),
      county: fd.get("county"),
      mode: fd.get("mode"),
      bio: fd.get("bio"),
      interests: String(fd.get("interests")).split(",").map(s => s.trim()).filter(Boolean)
    };
    store.users = users;
    toast("Profile saved on this device.");
  });
  $("#locBtn")?.addEventListener("click", requestLocation);
}

if (store.session && currentUser()) enterApp();
