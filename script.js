// ====== EDIT THESE THREE VALUES FOR YOUR SERVER ======
const SERVER_IP = 'play.redrootsmp.net';   // your Java/Bedrock connect address
const DISCORD_INVITE = 'https://discord.gg/redroot'; // your invite link
const DISCORD_GUILD_ID = '';               // your Discord server ID, see README for how to get it
// =======================================================

// Sticky nav background on scroll
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Floating embers in hero (only runs on pages that have the hero background)
const bg = document.getElementById('heroBg');
if (bg) {
  for (let i = 0; i < 24; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    const size = 2 + Math.random() * 4;
    e.style.width = size + 'px';
    e.style.height = size + 'px';
    e.style.left = Math.random() * 100 + '%';
    e.style.bottom = (Math.random() * 20) + '%';
    e.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    e.style.animationDuration = (7 + Math.random() * 8) + 's';
    e.style.animationDelay = (Math.random() * 10) + 's';
    bg.appendChild(e);
  }
}

// Toast helper
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.querySelector('span').textContent = msg;
  toast.classList.remove('show');
  void toast.offsetWidth; // restart animation
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function copyIP() {
  navigator.clipboard?.writeText(SERVER_IP).catch(() => {});
  showToast('IP copied \u2014 now go join the server!');
}

document.getElementById('ipWidget')?.addEventListener('click', copyIP);
document.getElementById('footerCopy')?.addEventListener('click', copyIP);
document.getElementById('discordWidget')?.addEventListener('click', () => {
  window.open(DISCORD_INVITE, '_blank', 'noopener');
});

// Fill in the static IP text wherever it appears
document.querySelectorAll('[data-server-ip]').forEach(el => el.textContent = SERVER_IP);
document.querySelectorAll('[data-discord-invite]').forEach(el => {
  el.textContent = DISCORD_INVITE.replace('https://', '');
});

// ====== LIVE PLAYER COUNT (Minecraft server status API) ======
// Uses the free, no-key-needed mcsrvstat.us API.
async function loadPlayerCount() {
  const el = document.getElementById('playerCount');
  if (!el) return;
  try {
    const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
    const data = await res.json();
    if (data.online && data.players) {
      el.textContent = `${data.players.online} players online`;
    } else {
      el.textContent = 'Server offline';
    }
  } catch (err) {
    // API unreachable or CORS blocked - leave existing placeholder text
    console.warn('Could not load player count', err);
  }
}

// ====== LIVE DISCORD MEMBER COUNT (Discord widget API) ======
// Requires "Server Widget" enabled in Discord Server Settings > Widget.
async function loadDiscordCount() {
  const el = document.getElementById('discordCount');
  if (!el || !DISCORD_GUILD_ID) return;
  try {
    const res = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`);
    const data = await res.json();
    if (typeof data.presence_count === 'number') {
      el.textContent = `${data.presence_count} users online`;
    }
  } catch (err) {
    console.warn('Could not load Discord count', err);
  }
}

loadPlayerCount();
loadDiscordCount();
// Refresh every 60 seconds so the counts stay current without a page reload
setInterval(loadPlayerCount, 60000);
setInterval(loadDiscordCount, 60000);
