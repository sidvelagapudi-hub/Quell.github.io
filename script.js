const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const demoState = {
  isDemo: true,
  user: { email: "alex@email.com", username: "AlexVale_", avatar: "🧙" },
  stats: { xp: 30, spentXp: 0, level: 1, streak: 14, bestStreak: 21, gold: 320 },
  tasks: [
    { id: 1, name: "Morning run", category: "Health", difficulty: "Hard", xp: 25, done: true, times: 42, streak: 14, notes: "Try to do this before 8am for bonus focus throughout the day.", lastDone: "Today" },
    { id: 2, name: "Morning meditation", category: "Focus", difficulty: "Easy", xp: 5, done: false, times: 0, streak: 0, notes: "", lastDone: "Never" },
    { id: 3, name: "Read 20 mins", category: "Wisdom", difficulty: "Easy", xp: 5, done: false, times: 0, streak: 0, notes: "", lastDone: "Never" },
    { id: 4, name: "Cold shower", category: "Health", difficulty: "Medium", xp: 10, done: false, times: 0, streak: 0, notes: "", lastDone: "Never" },
    { id: 5, name: "Journal entry", category: "Creative", difficulty: "Easy", xp: 5, done: true, times: 5, streak: 2, notes: "", lastDone: "Today" }
  ],
  rewards: [
    { id: 1, name: "Game time · 20 mins", icon: "🎮", cost: 100, redeemed: false },
    { id: 2, name: "Fancy coffee", icon: "☕", cost: 200, redeemed: false },
    { id: 3, name: "Watch an episode", icon: "🎬", cost: 150, redeemed: false }
  ],
  party: [
    { name: "AlexVale_", role: "Ranger", level: 1, hp: 85, you: true },
    { name: "Sam_Mage", role: "Mage", level: 8, hp: 60 },
    { name: "Jordan_W", role: "Warrior", level: 14, hp: 95 },
    { name: "Casey_S", role: "Scholar", level: 7, hp: 40 }
  ],
  boss: { hp: 340, max: 500 },
  notifications: [
    { title: "Streak at risk", body: "You have 4 hours left to complete today's quests and keep your 14-day streak alive.", time: "2 hours ago", read: false },
    { title: "Party attack", body: "Casey_S skipped a task. The Sloth King dealt 8 damage to your party.", time: "3 hours ago", read: false },
    { title: "Reward unlocked", body: "You earned enough XP to redeem Game time · 20 mins. Go treat yourself.", time: "Yesterday", read: false },
    { title: "Jordan_W joined your party", body: "Your party now has 4 members. Start a boss quest together.", time: "2 days ago", read: true },
    { title: "Level up", body: "You reached Level 12. New gear is available in the shop.", time: "Last week", read: true }
  ],
  gear: [
    { name: "Forest shield", type: "Ranger · Equipped", cost: 0, icon: "🛡️", owned: true },
    { name: "Oak crown", type: "Headgear · All classes", cost: 150, icon: "👑", owned: false },
    { name: "Shadow cloak", type: "Armour · All classes", cost: 200, icon: "🌬️", owned: false },
    { name: "Ember staff", type: "Weapon · Mage", cost: 250, icon: "🪄", owned: false }
  ]
};

const blankState = {
  isDemo: false,
  user: { email: "", username: "NewRanger_", avatar: "🧙" },
  stats: { xp: 0, spentXp: 0, level: 1, streak: 0, bestStreak: 0, gold: 0 },
  tasks: [],
  rewards: [],
  party: [],
  boss: { hp: 500, max: 500 },
  notifications: [
    { title: "Welcome to Quell", body: "Create your first quest to start earning XP.", time: "Just now", read: false }
  ],
  gear: [
    { name: "Forest shield", type: "Ranger", cost: 50, icon: "🛡️", owned: false },
    { name: "Oak crown", type: "Headgear · All classes", cost: 150, icon: "👑", owned: false },
    { name: "Shadow cloak", type: "Armour · All classes", cost: 200, icon: "🌬️", owned: false },
    { name: "Ember staff", type: "Weapon · Mage", cost: 250, icon: "🪄", owned: false }
  ]
};

let state = structuredClone(blankState);
let selectedTaskId = null;

function toast(message){
  const t = $("#toast");
  t.textContent = message;
  t.classList.remove("hidden");
  setTimeout(()=>t.classList.add("hidden"), 1800);
}

function showView(id){
  $$(".view").forEach(v => v.classList.remove("active"));
  $("#" + id).classList.add("active");
}

function showScreen(id){
  $$(".app-screen").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.screen === id));
  window.scrollTo({top:0, behavior:"smooth"});
}

function completeSignup(){
  const username = $("#usernameInput").value.trim() || "NewRanger_";
  const email = $("#signupEmail").value.trim() || "hello@gmail.com";
  const rewardName = $("#firstRewardInput").value.trim();
  const avatar = $("#avatarChoices .selected")?.dataset.avatar || "🧙";
  const cost = Number($("#firstRewardCostChoices .selected")?.dataset.cost || 100);
  const icon = $("#rewardIconChoices .selected")?.dataset.icon || "🎁";

  state = structuredClone(blankState);
  state.user = { email, username, avatar };
  state.party = [{ name: username, role: "Ranger", level: 1, hp: 85, you: true }];
  if (rewardName) state.rewards.push({ id: Date.now(), name: rewardName, icon, cost, redeemed:false });
  enterApp();
  toast("Account created. Start by adding a quest.");
}

function freshLogin(){
  const email = $("#loginEmail").value.trim() || "alex@email.com";
  const username = email.includes("@") ? email.split("@")[0] : "NewRanger_";

  state = structuredClone(blankState);
  state.user = { email, username, avatar: "🧙" };
  state.party = [{ name: username, role: "Ranger", level: 1, hp: 85, you: true }];
  enterApp();
  toast("Signed in with a fresh account.");
}

function demoLogin(){
  state = structuredClone(demoState);
  enterApp();
}

function enterApp(){
  $("#authPage").classList.add("hidden");
  $("#dashboardPage").classList.remove("hidden");
  renderAll();
  showScreen("tasksScreen");
}

function signOut(){
  $("#dashboardPage").classList.add("hidden");
  $("#authPage").classList.remove("hidden");
  showView("loginView");
}

function spendableXp(){
  return Math.max(0, state.stats.xp - state.stats.spentXp);
}

function completedTasks(){
  return state.tasks.filter(t => t.done);
}

function calculateLevel(){
  const total = state.stats.xp;
  const level = Math.floor(total / 100) + 1;
  state.stats.level = level;
  return level;
}

function className(){
  const level = calculateLevel();
  if (level >= 12) return "Forest Ranger";
  if (level >= 5) return "Ranger";
  return "New Adventurer";
}

function normalizeFreshProgress(){
  if(state.isDemo) return;
  const doneCount = completedTasks().length;
  state.stats.streak = doneCount;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.streak);
  state.stats.xp = completedTasks().reduce((sum, task) => sum + task.xp, 0);
  if(state.stats.spentXp > state.stats.xp) state.stats.spentXp = state.stats.xp;
}

function renderAll(){
  normalizeFreshProgress();
  calculateLevel();
  renderTasks();
  renderStats();
  renderParty();
  renderRewards();
  renderProfile();
  renderNotifications();
  renderGear();
}

function renderTasks(){
  const list = $("#tasksList");
  list.innerHTML = "";
  const done = completedTasks().length;

  $("#taskCompletionText").textContent = `${done}/${state.tasks.length}`;
  $("#xpTodayText").textContent = completedTasks().reduce((sum,t)=>sum+t.xp,0);

  $("#emptyTasks").classList.toggle("hidden", state.tasks.length !== 0);

  state.tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = `task-card ${task.done ? "done" : ""}`;
    card.innerHTML = `
      <button class="task-check" data-complete="${task.id}">${task.done ? "✓" : ""}</button>
      <button class="plain-task" data-detail="${task.id}">
        <h3>${task.name}</h3>
        <p class="task-meta"><span class="${task.category}">${task.category}</span> · ${task.difficulty}</p>
      </button>
      <strong class="task-xp">+${task.xp} XP</strong>
    `;
    list.appendChild(card);
  });
}

function renderStats(){
  const level = calculateLevel();
  const xpIntoLevel = state.stats.xp % 100;
  $("#levelText").textContent = level;
  $("#classText").textContent = className();
  $("#totalQuestsText").textContent = state.tasks.length;
  $("#streakText").textContent = state.stats.streak;
  $("#bestStreakText").textContent = `Best streak: ${state.stats.bestStreak} days`;
  $("#levelXpText").textContent = xpIntoLevel;
  $("#nextLevelText").textContent = `${100 - xpIntoLevel} XP until next level`;
  $("#streakCurrentMini").textContent = state.stats.streak;
  $("#streakBestMini").textContent = state.stats.bestStreak;
  $("#streakTotalMini").textContent = completedTasks().reduce((sum,t)=>sum+(t.times||0),0);

  const skills = { Health:0, Wisdom:0, Focus:0, Strength:0, Creative:0 };
  state.tasks.forEach(t => { skills[t.category] = (skills[t.category] || 0) + (t.done ? t.xp : 0); });
  if (state.isDemo) Object.assign(skills, {Health:72,Wisdom:58,Focus:45,Strength:30});
  $("#skillRows").innerHTML = Object.entries(skills).slice(0,4).map(([name,val]) => `
    <div class="skill-row">
      <span>${name}</span>
      <div class="skill-bar"><div style="width:${Math.min(val,100)}%"></div></div>
      <strong>${val}</strong>
    </div>
  `).join("");

  $("#calendarGrid").innerHTML = "";
  for(let i=1;i<=28;i++){
    const cell = document.createElement("div");
    cell.className = "day-cell";
    if(state.stats.streak && i <= Math.min(state.stats.streak, 14)) cell.classList.add("complete");
    if(state.stats.streak && i === 9) cell.classList.add("perfect");
    $("#calendarGrid").appendChild(cell);
  }
}

function renderParty(){
  $("#partyCount").textContent = state.party.length;
  $("#partyMembers").innerHTML = state.party.map(m => `
    <div class="member-card ${m.you ? "active-member" : ""}">
      <div class="avatar">${m.you ? state.user.avatar : m.name[0]}</div>
      <div><strong>${m.name}${m.you ? " (you)" : ""}</strong><p>${m.role} · Lvl ${state.stats.level}</p></div>
      <span>${m.hp} HP</span>
    </div>
  `).join("");

  $("#bossHpText").textContent = `${state.boss.hp} / ${state.boss.max}`;
  $("#bossHealthFill").style.width = `${(state.boss.hp/state.boss.max)*100}%`;
  $("#bossActivity").innerHTML = completedTasks().length
    ? completedTasks().slice(-5).map(t => `<p>${state.user.username} · ${t.name} <strong>-${t.xp} HP</strong></p>`).join("")
    : `<p>No boss hits yet. Complete a task to attack.</p>`;
}

function renderRewards(){
  const list = $("#rewardsList");
  list.innerHTML = "";
  $("#spendableXpText").textContent = spendableXp();
  $("#emptyRewards").classList.toggle("hidden", state.rewards.length !== 0);

  state.rewards.forEach(reward => {
    const progress = Math.min(100, Math.round((spendableXp()/reward.cost)*100));
    const ready = spendableXp() >= reward.cost && !reward.redeemed;
    const card = document.createElement("div");
    card.className = `reward-card ${ready ? "redeem-ready" : ""}`;
    card.innerHTML = `
      <div class="reward-icon">${reward.icon}</div>
      <div>
        <h3>${reward.name}</h3>
        <p>${Math.min(spendableXp(), reward.cost)} / ${reward.cost} XP</p>
        <div class="reward-bar"><div style="width:${progress}%"></div></div>
        <small>${progress}%</small>
      </div>
      <button class="secondary-btn compact redeem-btn" data-redeem="${reward.id}" ${ready ? "" : "disabled"}>
        ${reward.redeemed ? "Redeemed" : "Redeem"}
      </button>
    `;
    list.appendChild(card);
  });
}

function renderProfile(){
  $("#profileName").textContent = state.user.username;
  $("#profileAvatar").textContent = state.user.avatar;
  $("#profileClass").textContent = className();
  $("#profileLevel").textContent = state.stats.level;
  $("#profileQuestCount").textContent = state.tasks.length;
  $("#profileStreak").textContent = state.stats.streak;
  $("#profileGold").textContent = spendableXp();

  const badges = [
    {name:"First quest", earned:completedTasks().length >= 1, icon:"⭐"},
    {name:"3 quests complete", earned:completedTasks().length >= 3, icon:"✅"},
    {name:"7-day streak", earned:state.stats.streak >= 7, icon:"🔥"},
    {name:"Party member", earned:state.party.length > 1, icon:"👥"},
    {name:"First reward", earned:state.rewards.some(r => r.redeemed), icon:"🎁"},
    {name:"Gear owner", earned:state.gear.some(g => g.owned), icon:"🛡️"},
    {name:"Boss slayer", earned:state.boss.hp <= 0, icon:"💀"},
    {name:"30-day streak", earned:state.stats.streak >= 30, icon:"👑"}
  ];

  const earnedBadges = badges.filter(b => b.earned);

  $("#badgeGrid").innerHTML = earnedBadges.length
    ? earnedBadges.map(b => `<div class="badge earned">${b.icon}<br>${b.name}</div>`).join("")
    : `<div class="no-badges">No badges earned yet. Complete quests, redeem rewards, invite friends, or buy gear to unlock badges.</div>`;
}

function renderNotifications(){
  const unread = state.notifications.filter(n=>!n.read).length;
  $("#unreadBadge").textContent = unread;
  $("#unreadText").textContent = unread;
  $("#notificationsList").innerHTML = state.notifications.map(n => `
    <div class="notification-card ${n.read ? "read" : ""}">
      <h3>${n.title}</h3>
      <p>${n.body}</p>
      <small>${n.time}</small>
    </div>
  `).join("");
}

function renderGear(){
  $("#gearXpText").textContent = spendableXp();
  $("#gearList").innerHTML = state.gear.map((g,i) => {
    const canBuy = spendableXp() >= g.cost && !g.owned;
    return `
      <div class="gear-card ${g.owned ? "owned" : ""}">
        <div class="reward-icon">${g.icon}</div>
        <div><h3>${g.name}</h3><p class="muted">${g.type}</p></div>
        ${g.owned ? `<button class="owned-label">✓ Owned</button>` : `<button class="secondary-btn compact" data-buygear="${i}" ${canBuy ? "" : "disabled"}>${g.cost} XP</button>`}
      </div>
    `;
  }).join("");
}

// Event listeners
$$("[data-view]").forEach(btn => btn.addEventListener("click", () => {
  if(btn.dataset.view === "checkInboxView") $("#sentEmail").textContent = $("#resetEmail").value || "your email";
  showView(btn.dataset.view);
}));

$$("[data-screen]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.screen)));
$$(".nav-btn").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.screen)));

$("#loginForm").addEventListener("submit", e => { e.preventDefault(); freshLogin(); });
$("#finishOnboardingBtn").addEventListener("click", completeSignup);
$("#sidebarLogout").addEventListener("click", signOut);
$("#settingsSignOutBtn").addEventListener("click", signOut);

$("#showNewQuestBtn").addEventListener("click", () => showScreen("newQuestScreen"));
$("#emptyAddQuestBtn").addEventListener("click", () => showScreen("newQuestScreen"));

$("#addQuestBtn").addEventListener("click", () => {
  const name = $("#questName").value.trim();
  if(!name){ toast("Please enter a quest name."); return; }
  const cat = $("#questCategoryChoices .selected").dataset.category;
  const diff = $("#questDifficultyChoices .selected").dataset.difficulty;
  const xp = Number($("#questDifficultyChoices .selected").dataset.xp);
  state.tasks.push({id:Date.now(), name, category:cat, difficulty:diff, xp, done:false, times:0, streak:0, notes:$("#questNotes").value.trim(), lastDone:"Never"});
  $("#questName").value = ""; $("#questNotes").value = "";
  renderAll();
  showScreen("tasksScreen");
  toast("Quest added.");
});

$("#tasksList").addEventListener("click", e => {
  const completeBtn = e.target.closest("[data-complete]");
  const detailBtn = e.target.closest("[data-detail]");
  if(completeBtn){
    const task = state.tasks.find(t => t.id == completeBtn.dataset.complete);
    if(task){
      task.done = !task.done;
      if(task.done){
        task.times = (task.times||0)+1;
        task.streak = (task.streak||0)+1;
        task.lastDone = "Today";
        state.stats.xp += task.xp;
        state.boss.hp = Math.max(0, state.boss.hp - task.xp);
        state.stats.streak += 1;
        state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.streak);
      }
      renderAll();
    }
  }
  if(detailBtn){
    selectedTaskId = Number(detailBtn.dataset.detail);
    renderTaskDetail();
    showScreen("taskDetailScreen");
  }
});

function renderTaskDetail(){
  const task = state.tasks.find(t => t.id === selectedTaskId);
  if(!task) return;
  $("#detailTitle").textContent = task.name;
  $("#detailCategory").textContent = task.category;
  $("#detailDifficulty").textContent = `${task.difficulty} · +${task.xp} XP`;
  $("#detailCompletedTimes").textContent = task.times || 0;
  $("#detailStreak").textContent = `${task.streak || 0} days`;
  $("#detailEarnedXp").textContent = `${(task.times || 0) * task.xp} XP`;
  $("#detailLastDone").textContent = task.lastDone || "Never";
  $("#detailNotes").textContent = task.notes || "No notes yet.";
  $("#detailCompleteBtn").textContent = task.done ? "Mark incomplete" : "Mark complete";
}

$("#detailCompleteBtn").addEventListener("click", () => {
  const task = state.tasks.find(t => t.id === selectedTaskId);
  if(task){
    task.done = !task.done;
    if(task.done){ task.times=(task.times||0)+1; task.streak=(task.streak||0)+1; task.lastDone="Today"; state.stats.xp += task.xp; state.stats.streak += 1; state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.streak); state.boss.hp=Math.max(0,state.boss.hp-task.xp); }
    renderAll(); renderTaskDetail(); toast(task.done ? "Marked complete." : "Marked incomplete.");
  }
});

$("#deleteTaskBtn").addEventListener("click", () => {
  state.tasks = state.tasks.filter(t => t.id !== selectedTaskId);
  renderAll(); showScreen("tasksScreen"); toast("Quest deleted.");
});

$("#showRewardFormBtn").addEventListener("click", () => $("#rewardForm").classList.remove("hidden"));
$("#cancelRewardBtn").addEventListener("click", () => $("#rewardForm").classList.add("hidden"));
$("#addRewardBtn").addEventListener("click", () => {
  const name = $("#rewardNameInput").value.trim();
  const cost = Number($("#rewardCostInput").value);
  if(!name || !cost){ toast("Please add a reward name and cost."); return; }
  state.rewards.push({id:Date.now(), name, icon:$("#rewardIconInput").value || "🎁", cost, redeemed:false});
  $("#rewardForm").classList.add("hidden"); $("#rewardNameInput").value="";
  renderAll(); toast("Reward added.");
});

$("#rewardsList").addEventListener("click", e => {
  const btn = e.target.closest("[data-redeem]");
  if(!btn) return;
  const reward = state.rewards.find(r => r.id == btn.dataset.redeem);
  if(reward && spendableXp() >= reward.cost && !reward.redeemed){
    state.stats.spentXp += reward.cost;
    reward.redeemed = true;
    state.notifications.unshift({title:"Reward redeemed", body:`You redeemed ${reward.name}. Enjoy it!`, time:"Just now", read:false});
    renderAll();
    toast("Reward redeemed!");
  }
});

$("#addFriendDemoBtn").addEventListener("click", () => {
  const n = state.party.length + 1;
  state.party.push({name:`Friend_${n}`, role:"Ranger", level:1, hp:80});
  state.notifications.unshift({title:"Friend joined your party", body:`Friend_${n} joined your party.`, time:"Just now", read:false});
  renderAll(); toast("Friend added.");
});

$("#markAllReadBtn").addEventListener("click", () => {
  state.notifications.forEach(n=>n.read=true);
  renderAll(); toast("All notifications marked read.");
});

$("#gearList").addEventListener("click", e => {
  const btn = e.target.closest("[data-buygear]");
  if(!btn) return;
  const gear = state.gear[Number(btn.dataset.buygear)];
  if(gear && spendableXp() >= gear.cost){
    state.stats.spentXp += gear.cost;
    gear.owned = true;
    renderAll(); toast(`${gear.name} purchased.`);
  }
});

$("#deleteAccountBtn").addEventListener("click", () => {
  if(confirm("Delete this prototype account and return to sign up?")){
    state = structuredClone(blankState);
    signOut(); showView("signupView"); renderAll();
  }
});

function selectable(containerSelector, itemSelector, className="selected"){
  $(containerSelector).addEventListener("click", e => {
    const item = e.target.closest(itemSelector);
    if(!item) return;
    $$(containerSelector + " " + itemSelector).forEach(x => x.classList.remove(className));
    item.classList.add(className);
  });
}
selectable("#avatarChoices", ".choice");
selectable("#firstRewardCostChoices", ".choice");
selectable("#rewardIconChoices", ".choice");
selectable("#questCategoryChoices", ".pill-choice");
selectable("#questDifficultyChoices", ".difficulty");

$("#togglePassword").addEventListener("click", () => {
  const inp = $(".password-row input");
  inp.type = inp.type === "password" ? "text" : "password";
});

// make task title button plain via JS-added class styles fallback
const style = document.createElement("style");
style.textContent = `.plain-task{background:transparent;border:0;color:inherit;text-align:left;padding:0}.plain-task:hover h3{color:var(--orange)}`;
document.head.appendChild(style);

renderAll();


// Final polish: make Google/Apple buttons do something useful in a front-end-only prototype.
// Real Google/Apple auth and real email sending need Firebase/Auth0/Supabase or a backend.
// This prototype simulates the auth choice and starts a fresh account.
document.addEventListener("click", (event) => {
  const oauthButton = event.target.closest(".oauth-btn");
  if (!oauthButton) return;

  const provider = oauthButton.dataset.provider || "OAuth";
  const isSignup = !!oauthButton.closest("#signupView");

  state = structuredClone(blankState);
  state.user = {
    email: `${provider.toLowerCase()}user@example.com`,
    username: `${provider}User`,
    avatar: provider === "Apple" ? "🍎" : "🧙"
  };
  state.party = [{ name: state.user.username, role: "Ranger", level: 1, hp: 85, you: true }];

  enterApp();
  toast(`${provider} ${isSignup ? "account created" : "sign in"} simulated.`);
});

const resetButton = document.getElementById("sendResetBtn");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    const email = document.getElementById("resetEmail")?.value || "your email";
    const subject = encodeURIComponent("Quell password reset link");
    const body = encodeURIComponent(
      `Hi,\n\nHere is your Quell password reset link:\n\nhttps://quell.example/reset?email=${email}\n\nThis is a prototype email draft. In a real website, this would be sent using a backend email service.\n\nQuell`
    );

    // Opens the user's mail app with a draft. This is the closest a static HTML/CSS/JS site can get to "sending" email.
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
}
