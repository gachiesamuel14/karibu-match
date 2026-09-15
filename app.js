const COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Kiambu","Nakuru","Uasin Gishu","Kisii",
  "Machakos","Kajiado","Nyeri","Meru","Kilifi","Kakamega","Bungoma","Garissa"
];

const SEED = [
  { id: "p1", name: "Amina", age: 26, county: "Mombasa", dist: 3.2, bio: "Coast sunsets, chai, and late walks on Nyali.", interests: ["travel","food","faith"], photo: "linear-gradient(160deg,#c45c4a,#2b1a16)" },
  { id: "p2", name: "Brian", age: 29, county: "Nairobi", dist: 1.4, bio: "Product designer in Westlands. Weekend football in Kasarani.", interests: ["design","football","coffee"], photo: "linear-gradient(160deg,#3d5a80,#1b2838)" },
  { id: "p3", name: "Wanjiku", age: 24, county: "Kiambu", dist: 8.1, bio: "Student mode. Books, gospel playlists, Thika Road survivor.", interests: ["books","church","running"], photo: "linear-gradient(160deg,#b08d57,#3a2a16)" },
  { id: "p4", name: "Otieno", age: 31, county: "Kisumu", dist: 12.0, bio: "Lake air and tilapia. Looking for someone kind, not loud.", interests: ["music","lake","family"], photo: "linear-gradient(160deg,#2f6f5e,#12221c)" },
  { id: "p5", name: "Faith", age: 27, county: "Nakuru", dist: 18.5, bio: "Nurse. Flamingos, hiking Menengai, quiet Sundays.", interests: ["health","hiking","church"], photo: "linear-gradient(160deg,#7a4e7e,#241624)" },
  { id: "p6", name: "Kevin", age: 28, county: "Uasin Gishu", dist: 22.0, bio: "Eldoret mornings. Training, work, then nyama.", interests: ["running","work","food"], photo: "linear-gradient(160deg,#4a6fa5,#1a2433)" }
];

const store = {
  get users() { return JSON.parse(localStorage.getItem("km_users") || "[]"); },
  set users(v) { localStorage.setItem("km_users", JSON.stringify(v)); },
  get session() { return JSON.parse(localStorage.getItem("km_session") || "null"); },
  set session(v) { v ? localStorage.setItem("km_session", JSON.stringify(v)) : localStorage.removeItem("km_session"); },
  get likes() { return JSON.parse(localStorage.getItem("km_likes") || "{}"); },
  set likes(v) { localStorage.setItem("km_likes", JSON.stringify(v)); },
  get chats() { return JSON.parse(localStorage.getItem("km_chats") || "{}"); },
  set chats(v) { localStorage.setItem("km_chats", JSON.stringify(v)); }
};

const $ = (s) => document.querySelector(s);
const countyPills = $("#countyPills");
if (countyPills) countyPills.innerHTML = COUNTIES.map(c => `<span class="pill">${c}</span>`).join("");

let signupMode = false;
let deckIndex = 0;
let filterCounty = "All";
let activeChat = null;

function currentUser() {
  const s = store.session;
  if (!s) return null;
  return store.users.find(u => u.email === s.email) || null;
}

function openAuth() { $("#authModal").classList.remove("hidden"); }
function closeAuth() { $("#authModal").classList.add("hidden"); }

$("#navAuth")?.addEventListener("click", openAuth);
$("#startBtn")?.addEventListener("click", () => { signupMode = true; syncAuthCopy(); openAuth(); });
$("#demoBtn")?.addEventListener("click", () => {
  ensureDemoUser();
  enterApp();
});
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
    if (users.some(u => u.email === email)) return alert("Account exists. Sign in.");
    users.push({
      email, password, name: email.split("@")[0], age: 25,
      county: "Nairobi", bio: "New on Karibu Match.", interests: ["music"],
      lat: -1.2921, lng: 36.8219
    });
    store.users = users;
  } else {
    const u = users.find(x => x.email === email && x.password === password);
    if (!u) return alert("Check email or password.");
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
      interests: ["travel","food"], lat: -1.2921, lng: 36.8219
    });
    store.users = users;
  }
  store.session = { email: "demo@karibu.match" };
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

function likedSet() {
  return new Set(store.likes[meKey()] || []);
}

function matches() {
  const mine = likedSet();
  return SEED.filter(p => mine.has(p.id));
}

function render(view) {
  const ws = $("#workspace");
  if (view === "discover") ws.innerHTML = discoverHTML();
  if (view === "likes") ws.innerHTML = listHTML("People you liked", [...likedSet()].map(id => SEED.find(p => p.id === id)).filter(Boolean));
  if (view === "matches") ws.innerHTML = listHTML("Matches", matches(), true);
  if (view === "chat") ws.innerHTML = chatHTML();
  if (view === "profile") ws.innerHTML = profileHTML();
  bindView(view);
}

function discoverHTML() {
  const pool = SEED.filter(p => filterCounty === "All" || p.county === filterCounty);
  const p = pool[deckIndex % Math.max(pool.length,1)];
  if (!p) return "<p class=lede>No people in this county in the demo set.</p>";
  return `
    <div class="filters">
      <select id="countyFilter">
        <option>All</option>
        ${COUNTIES.map(c => `<option ${c===filterCounty?"selected":""}>${c}</option>`).join("")}
      </select>
      <span class="pill">Sorted by distance</span>
    </div>
    <div class="deck">
      <article class="person">
        <div class="photo" style="background:${p.photo}">${p.name}, ${p.age}</div>
        <p class="meta">${p.county} · ${p.dist} km away · ${p.interests.join(" · ")}</p>
        <p>${p.bio}</p>
        <div class="actions">
          <button class="btn ghost" id="passBtn">Pass</button>
          <button class="btn primary" id="likeBtn" data-id="${p.id}">Like</button>
        </div>
      </article>
    </div>`;
}

function listHTML(title, people, canChat) {
  if (!people.length) return `<h2>${title}</h2><p class="lede">Nothing here yet. Like someone on Discover.</p>`;
  return `<h2>${title}</h2><div class="list">${people.map(p => `
    <div class="row">
      <div><strong>${p.name}, ${p.age}</strong><div class="meta">${p.county} · ${p.dist} km</div></div>
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
    <div class="filters">${m.map(p => `<button class="pill open-chat" data-id="${p.id}">${p.name}</button>`).join("")}</div>
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
      <label>Bio<textarea name="bio" rows="4">${u.bio || ""}</textarea></label>
      <label>Interests (comma separated)<input name="interests" value="${(u.interests||[]).join(", ")}" /></label>
      <p class="meta">Location permission: this demo uses a Nairobi default. Production would use the Geolocation API + a backend.</p>
      <button class="btn primary" type="submit">Save profile</button>
    </form>`;
}

function bindView(view) {
  $("#countyFilter")?.addEventListener("change", (e) => { filterCounty = e.target.value; deckIndex = 0; render("discover"); });
  $("#passBtn")?.addEventListener("click", () => { deckIndex++; render("discover"); });
  $("#likeBtn")?.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const likes = store.likes;
    const set = new Set(likes[meKey()] || []);
    set.add(id);
    likes[meKey()] = [...set];
    store.likes = likes;
    alert("Liked. In production they must like you back before chat.");
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
      bio: fd.get("bio"),
      interests: String(fd.get("interests")).split(",").map(s => s.trim()).filter(Boolean)
    };
    store.users = users;
    alert("Profile saved on this device.");
  });
}

if (store.session && currentUser()) enterApp();
