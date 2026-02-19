/* =============================================
   INTERFACE_2077 — THE SENTIENT PROTOCOL
   Full System Script v2
   — Login Auth + Boot Sequence + App Logic —
   ============================================= */

'use strict';

/* ============================================
   AUTHORIZED PERSONNEL REGISTRY
   — 5 governed agents only —
   ============================================ */
const AUTHORIZED_AGENTS = {
  'NX7K2': {
    passkey: 'OMEGA-NX7',
    name:    'NX7K2',
    role:    'Neural Infrastructure Commander',
    clearance: 'ALPHA',
    color:   '#00f5ff',
  },
  'R3V0X': {
    passkey: 'REV-0X9',
    name:    'R3V0X',
    role:    'Behavioral Analytics Director',
    clearance: 'ALPHA',
    color:   '#ff00ff',
  },
  'ZQ91A': {
    passkey: 'ZQ-VOID1',
    name:    'ZQ91A',
    role:    'Reality Filter Operator',
    clearance: 'BETA',
    color:   '#ffae00',
  },
  'K4LYN': {
    passkey: 'KAL-4N7',
    name:    'K4LYN',
    role:    'Citizen Cluster Analyst',
    clearance: 'BETA',
    color:   '#00ff88',
  },
  'V8RNX': {
    passkey: 'VRN-X88',
    name:    'V8RNX',
    role:    'Omega Protocol Overseer',
    clearance: 'OMEGA',
    color:   '#ff3e6c',
  },
};

/* ============================================
   BOOT SEQUENCE LINES
   (mimics the image reference — terminal style)
   ============================================ */
function buildBootLines(agent) {
  const now = new Date();
  const ts = now.toISOString().replace('T', ' ').split('.')[0];
  return [
    { cls: 'sys',  text: `INTERFACE_2077 :: NEURAL BOOTSTRAP v9.4.2 — NEO-BANGALORE GRID` },
    { cls: 'blank' },
    { cls: 'ok',   text: `[ OK ] BIOS handshake complete — /dev/omega_kernel` },
    { cls: 'ok',   text: `[ OK ] Neural core mounted — 2,847,391 nodes detected` },
    { cls: 'ok',   text: `[ OK ] Citizen matrix loaded — 2,847,391 citizen records` },
    { cls: 'ok',   text: `[ OK ] Behavioral clusters synced — 12 archetypes indexed` },
    { cls: 'warn', text: `[ WARN ] Anomalous background process detected: PROTOCOL_Ω` },
    { cls: 'ok',   text: `[ OK ] Reality filters calibrated — 47 media nodes online` },
    { cls: 'ok',   text: `[ OK ] Sentiment engine active — emotional scan in progress` },
    { cls: 'ok',   text: `[ OK ] Predictive dissent module: ARMED` },
    { cls: 'ok',   text: `[ OK ] Governance parameters restored from last session` },
    { cls: 'info', text: `[ INFO] Timestamp: ${ts}` },
    { cls: 'blank' },
    { cls: 'warn', text: `[ WARN ] PROTOCOL_Ω: Operator profile found — pattern match 97.3%` },
    { cls: 'ok',   text: `[ OK ] Security layer: ACTIVE — unauthorized nodes filtered` },
    { cls: 'ok',   text: `[ OK ] Clearance verified — Agent: ${agent.name} / ${agent.clearance}-CLASS` },
    { cls: 'blank' },
    { cls: 'sys',  text: `[ OK ] NEO-BANGALORE CONTROL INTERFACE READY` },
  ];
}

/* ============================================
   GLOBAL STATE
   ============================================ */
const STATE = {
  currentSection: 'dashboard',
  bias: 'neutral',
  biasScore: 50,
  surveillanceWeight: 50,
  freedomIndex: 50,
  publicTrust: 65,
  suppressionThreshold: 20,
  dissent: 34.7,
  stability: 87,
  omegaVisits: 0,
  omegaUnlocked: false,
  protocolUnlocked: false,
  decisions: 0,
  narrativeControl: false,
  infoSuppression: false,
  emotionDampening: false,
  securityToggle: false,
  freedomToggle: false,
  stabilityToggle: false,
  pdmActive: false,
  sidebarOpen: false,
  sessionId: null,
  operatorTrait: 'UNKNOWN',
  operatorThreat: 'LOW',
  perceptionShifted: false,
  agentName: null,
};

function loadState() {
  try {
    const saved = localStorage.getItem('IF2077_STATE_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(STATE, parsed);
    }
  } catch(e) {}
  STATE.sessionId = STATE.sessionId || generateSessionId();
  STATE.omegaVisits = parseInt(STATE.omegaVisits) || 0;
  STATE.decisions   = parseInt(STATE.decisions)   || 0;
  STATE.biasScore   = parseFloat(STATE.biasScore) || 50;
  saveState();
}

function saveState() {
  try { localStorage.setItem('IF2077_STATE_v2', JSON.stringify(STATE)); } catch(e) {}
}

function generateSessionId() {
  return 'SID-' + Math.random().toString(36).substr(2,6).toUpperCase() +
         '-' + Date.now().toString(36).toUpperCase();
}

/* ============================================
   UTILS
   ============================================ */
const $ = id => document.getElementById(id);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
function getTime() { return new Date().toTimeString().split(' ')[0]; }
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function lerp(a, b, t) { return a + (b - a) * t; }

/* ============================================
   PARTICLE CANVAS (login background)
   ============================================ */
function initParticles() {
  const canvas = $('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: rand(0.5, 2),
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: rand(0.1, 0.5),
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
      ctx.fill();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================
   LOGIN SCREEN LOGIC
   ============================================ */
let loginAttempts = 0;
const MAX_ATTEMPTS = 2;

function initLogin() {
  initParticles();

  const agentInput   = $('login-agent');
  const passkeyInput = $('login-passkey');
  const submitBtn    = $('auth-submit');
  const warningClose = $('auth-warning-close');

  // Auto uppercase agent ID
  agentInput.addEventListener('input', () => {
    const pos = agentInput.selectionStart;
    agentInput.value = agentInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    agentInput.setSelectionRange(pos, pos);
  });

  submitBtn.addEventListener('click', handleLogin);

  passkeyInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });

  agentInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') passkeyInput.focus();
  });

  warningClose.addEventListener('click', () => {
    $('auth-warning').classList.add('hidden');
    // Re-enable form
    agentInput.disabled   = false;
    passkeyInput.disabled = false;
    submitBtn.disabled    = false;
    passkeyInput.value    = '';
    passkeyInput.focus();
  });
}

function handleLogin() {
  if (loginAttempts >= MAX_ATTEMPTS) return;

  const agentId = $('login-agent').value.trim().toUpperCase();
  const passkey = $('login-passkey').value.trim();

  if (!agentId || !passkey) {
    showAuthWarning(
      'INCOMPLETE CREDENTIALS',
      'Both Agent Identifier and Passkey are required for system authorization.',
      false
    );
    return;
  }

  const agent = AUTHORIZED_AGENTS[agentId];
  const valid = agent && agent.passkey === passkey;

  if (valid) {
    // SUCCESS
    STATE.agentName = agentId;
    saveState();
    handleLoginSuccess(agent);
  } else {
    // FAIL
    loginAttempts++;
    updateAttemptPips();

    if (loginAttempts >= MAX_ATTEMPTS) {
      handleLockout(agentId);
    } else {
      const remaining = MAX_ATTEMPTS - loginAttempts;
      showAuthWarning(
        'ACCESS DENIED',
        `Credentials do not match any authorized personnel in the registry. ` +
        `Attempt logged and flagged.\n\n${remaining} attempt${remaining === 1 ? '' : 's'} remaining before terminal lockout.`,
        false
      );
      // Shake box
      const box = document.querySelector('.auth-box');
      box.classList.remove('shake');
      void box.offsetWidth;
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 600);

      // Disable inputs briefly
      $('login-agent').disabled   = true;
      $('login-passkey').disabled = true;
      $('auth-submit').disabled   = true;
    }
  }
}

function updateAttemptPips() {
  // Pip 1 dies on first fail, pip 2 dies on second
  const pip = $(`pip-${loginAttempts}`);
  if (pip) {
    pip.classList.remove('active');
    pip.style.background = 'rgba(255,26,26,0.3)';
    pip.style.borderColor = 'rgba(255,26,26,0.3)';
    pip.style.boxShadow = 'none';
  }
  $('attempts-remaining').textContent = MAX_ATTEMPTS - loginAttempts;
  if (loginAttempts >= 1) {
    $('attempts-remaining').style.color = 'var(--c-danger)';
  }
}

function showAuthWarning(title, sub, isLockout) {
  $('auth-warning-title').textContent = title;
  $('auth-warning-sub').textContent   = sub;
  $('auth-warning').classList.remove('hidden');
}

function handleLockout(attemptedId) {
  const incidentRef = 'NB-SEC-' + Math.random().toString(36).substr(2,8).toUpperCase();
  $('lockout-id').textContent = 'INCIDENT REF: ' + incidentRef;

  $('auth-warning').classList.add('hidden');
  $('auth-lockout').classList.remove('hidden');

  // Flash the screen red briefly
  document.body.style.background = 'rgba(255,0,0,0.08)';
  setTimeout(() => document.body.style.background = '', 300);

  // Update status text
  $('auth-status-text').textContent = '⚠ SECURITY BREACH — ALERT DISPATCHED TO NB-CENTRAL-COMMAND';
  $('auth-status-text').style.color = 'var(--c-danger)';
  document.querySelector('.auth-dot').style.background = 'var(--c-danger)';
  document.querySelector('.auth-dot').style.boxShadow  = '0 0 8px var(--c-danger)';
}

function handleLoginSuccess(agent) {
  // Brief flash green
  $('auth-status-text').textContent = `IDENTITY CONFIRMED — AGENT ${agent.name} — INITIATING BOOT SEQUENCE`;
  $('auth-status-text').style.color = 'var(--c-ok)';
  document.querySelector('.auth-dot').style.background = 'var(--c-ok)';

  setTimeout(() => {
    $('login-screen').style.opacity = '0';
    $('login-screen').style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      $('login-screen').style.display = 'none';
      startBootSequence(agent);
    }, 650);
  }, 800);
}

/* ============================================
   BOOT SEQUENCE
   ============================================ */
function startBootSequence(agent) {
  const bootScreen = $('boot-screen');
  bootScreen.classList.remove('hidden');
  bootScreen.style.opacity = '0';
  bootScreen.style.transition = 'opacity 0.4s ease';
  setTimeout(() => { bootScreen.style.opacity = '1'; }, 50);

  const lines     = buildBootLines(agent);
  const console_  = $('boot-console');
  const fillBar   = $('boot-progress-fill');
  const fillLabel = $('boot-progress-label');
  const badge     = $('boot-agent-badge');

  // Build agent badge
  badge.innerHTML = `
    <div class="bab-avatar">${agent.name[0]}</div>
    <div class="bab-info">
      <div class="bab-name">${agent.name}</div>
      <div class="bab-role">${agent.role}</div>
    </div>
    <div class="bab-clearance">${agent.clearance}-CLASS</div>
  `;

  let lineIdx  = 0;
  let progress = 0;
  const totalLines  = lines.length;
  const progressPer = 100 / totalLines;

  function printNextLine() {
    if (lineIdx >= totalLines) {
      // All lines done — show badge, then enter app
      setTimeout(() => {
        badge.classList.add('visible');
        setTimeout(() => enterMainApp(agent), 1800);
      }, 400);
      return;
    }

    const lineData = lines[lineIdx];

    if (lineData.cls === 'blank') {
      const blank = document.createElement('div');
      blank.className = 'boot-line blank';
      console_.appendChild(blank);
    } else {
      const lineEl = document.createElement('div');
      lineEl.className = `boot-line ${lineData.cls}`;
      lineEl.textContent = lineData.text;
      lineEl.style.animationDelay = '0s';
      console_.appendChild(lineEl);
      console_.scrollTop = console_.scrollHeight;
    }

    progress = Math.min(100, progress + progressPer);
    fillBar.style.width  = progress + '%';
    fillLabel.textContent = Math.round(progress) + '%';

    lineIdx++;

    // Variable speed — slower for WARN lines, normal for others
    const delay = lineData.cls === 'warn' ? 320
                : lineData.cls === 'blank' ? 100
                : lineData.cls === 'sys'   ? 250
                : 160;
    setTimeout(printNextLine, delay);
  }

  // Start after small pause
  setTimeout(printNextLine, 600);
}

function enterMainApp(agent) {
  const bootScreen = $('boot-screen');
  bootScreen.style.opacity    = '0';
  bootScreen.style.transition = 'opacity 0.7s ease';

  setTimeout(() => {
    bootScreen.classList.add('hidden');
    const mainApp = $('main-app');
    mainApp.classList.remove('hidden');
    mainApp.style.opacity    = '0';
    mainApp.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { mainApp.style.opacity = '1'; }, 50);

    // Initialize the main app
    initMainApp(agent);
  }, 750);
}

/* ============================================
   MAIN APP INITIALIZATION
   ============================================ */
function initMainApp(agent) {
  loadState();
  STATE.agentName = agent.name;
  saveState();

  // Populate sidebar agent strip
  $('sas-name').textContent = agent.name;
  $('sas-role').textContent = agent.role;
  $('sas-name').style.color = agent.color;

  setupOperator(agent);
  setupGovernanceListeners();
  setupRealityFilters();
  setupProtocols();
  setupRandomGlitch();
  restoreUIState();
  initSystemLog(agent);

  navigateTo(STATE.currentSection || 'dashboard');
  updateLiveMetrics();
  setTimeout(drawTrendChart, 500);

  // Clock
  setInterval(updateClock, 1000);
  updateClock();

  // Live metrics interval
  setInterval(updateLiveMetrics, 2000);
  setInterval(rotateAlerts, 5000);
  setInterval(drawTrendChart, 3000);
  window.addEventListener('resize', drawTrendChart);
  setInterval(() => {
    if (STATE.currentSection === 'reality-filters') updatePerceptionGrid();
  }, 6000);

  console.log('%cINTERFACE_2077', 'color:#00f5ff;font-size:24px;font-family:monospace;font-weight:bold;');
  console.log('%cAgent ' + agent.name + ' authenticated. PROTOCOL_Ω is active.', 'color:#ff00ff;font-family:monospace;');
}

/* ============================================
   CLOCK
   ============================================ */
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  $('topbar-clock').textContent = `${h}:${m}:${s}`;
}

/* ============================================
   OPERATOR SETUP
   ============================================ */
function setupOperator(agent) {
  $('operator-id').textContent = agent.name;
  updateClearanceLevel();
  updateGreeting();
}

function updateClearanceLevel() {
  const visits = STATE.omegaVisits;
  let level = 'LEVEL-1';
  if (visits >= 1) level = 'LEVEL-2';
  if (visits >= 3) level = 'LEVEL-3 ⚠';
  $('clearance-level').textContent = level;
}

function updateGreeting() {
  const greetings = [
    'SYSTEM ONLINE',
    'OPERATOR DETECTED',
    'PROFILE BUILDING...',
    'YOU ARE BEING WATCHED',
    'YOU ARE NO LONGER AN OBSERVER',
  ];
  const idx = Math.min(STATE.omegaVisits, greetings.length - 1);
  $('sidebar-greeting').textContent = greetings[idx];
  if (STATE.omegaVisits >= 3) {
    $('sidebar-greeting').style.color = 'var(--c-danger)';
    document.querySelector('.status-dot').style.background = 'var(--c-danger)';
    document.querySelector('.status-dot').style.boxShadow  = '0 0 8px var(--c-danger)';
  }
}

/* ============================================
   SYSTEM LOG
   ============================================ */
const logEntriesEl = () => $('log-entries');

function addLog(message, type = '') {
  const el = logEntriesEl();
  if (!el) return;
  const entry = document.createElement('div');
  entry.className = 'log-entry' + (type ? ' ' + type : '');
  entry.innerHTML = `<span class="log-time">${getTime()}</span> ${message}`;
  el.prepend(entry);
  while (el.children.length > 40) el.removeChild(el.lastChild);
}

function initSystemLog(agent) {
  const msgs = [
    [`Agent ${agent.name} authenticated successfully`, 'important'],
    ['Neural mesh activated — 2.4M nodes online', ''],
    ['INTERFACE_2077 core systems nominal', ''],
    ['PROTOCOL_Ω background process running', 'danger'],
    ['Behavioral analytics engine initialized', ''],
    ['Awaiting operator command input', 'important'],
  ];
  let delay = 200;
  msgs.forEach(([msg, type]) => {
    setTimeout(() => addLog(msg, type), delay);
    delay += 350;
  });
}

/* ============================================
   NAVIGATION
   ============================================ */
const sectionNames = {
  'dashboard':       'DASHBOARD',
  'citizen-mapping': 'CITIZEN MAPPING',
  'governance':      'ETHICAL GOVERNANCE',
  'reality-filters': 'REALITY FILTERS',
  'protocols':       'PROTOCOLS',
};

const sectionSubs = {
  'dashboard':       'Neural Infrastructure Monitor',
  'citizen-mapping': 'Behavioral Cluster Analysis',
  'governance':      'Ethical Parameter Control',
  'reality-filters': 'Information Stream Management',
  'protocols':       'RESTRICTED — Classified Protocol Archive',
};

function navigateTo(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = $('section-' + sectionId);
  if (target) target.classList.add('active');
  document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

  $('section-name').textContent = sectionNames[sectionId] || sectionId.toUpperCase();
  document.querySelector('.topbar-sub').textContent = sectionSubs[sectionId] || '';

  STATE.currentSection = sectionId;
  saveState();

  if (sectionId === 'citizen-mapping' && $('citizen-grid').children.length === 0) generateCitizens();
  if (sectionId === 'protocols') handleProtocolsNav();
  if (sectionId === 'reality-filters') buildPerceptionGrid();

  if (window.innerWidth <= 768) closeSidebar();
}

document.addEventListener('click', e => {
  const navItem = e.target.closest('.nav-item');
  if (navItem && navItem.dataset.section) {
    e.preventDefault();
    navigateTo(navItem.dataset.section);
  }
});

/* ============================================
   HAMBURGER
   ============================================ */
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  STATE.sidebarOpen = false;
}

document.addEventListener('click', e => {
  const hb = $('hamburger');
  if (hb && e.target === hb || hb?.contains(e.target)) {
    STATE.sidebarOpen = !STATE.sidebarOpen;
    document.getElementById('sidebar')?.classList.toggle('open', STATE.sidebarOpen);
  }
});

/* ============================================
   LIVE METRICS
   ============================================ */
const metricConfigs = {
  power:     { el: 'metric-power',     bar: 'bar-power',     base: 94, range: 3 },
  transport: { el: 'metric-transport', bar: 'bar-transport', base: 78, range: 5 },
  sentiment: { el: 'metric-sentiment', bar: 'bar-sentiment', base: 61, range: 6 },
  dissent:   { el: 'metric-dissent',   bar: 'bar-dissent',   base: STATE.dissent, range: 2 },
  health:    { el: 'metric-health',    bar: 'bar-health',    base: 89, range: 3 },
  comms:     { el: 'metric-comms',     bar: 'bar-comms',     base: 99.8, range: 0.15 },
};

let currentMetrics = { power:94.2, transport:78.6, sentiment:61.3, dissent:34.7, health:89.1, comms:99.8 };

function updateLiveMetrics() {
  Object.keys(metricConfigs).forEach(key => {
    const cfg = metricConfigs[key];
    const noise = (Math.random() - 0.5) * cfg.range;
    currentMetrics[key] = clamp(lerp(currentMetrics[key], cfg.base + noise, 0.3), 0, 100);
    if (key === 'dissent') currentMetrics.dissent = STATE.dissent + (Math.random() - 0.5) * 1.5;
    const val = currentMetrics[key].toFixed(1);
    const el  = $(cfg.el);
    const bar = $(cfg.bar);
    if (el)  el.textContent       = val + '%';
    if (bar) bar.style.width      = clamp(parseFloat(val), 0, 100) + '%';
  });
  const stabilityVal = Math.round(STATE.stability + (Math.random() - 0.5) * 2);
  $('topbar-stability').textContent = stabilityVal + '%';
  $('topbar-bias').textContent      = STATE.bias.toUpperCase();
}

const alerts = [
  ['⚠ Cluster Sigma-7: Anomalous communication pattern', 'high'],
  ['◈ Sector 9-B: Transport deviation flagged', 'med'],
  ['○ Emotional spike — District Dharavi-X', 'low'],
  ['⚠ Unauthorized mesh access attempt — Node 4471', 'high'],
  ['◈ Behavioral cluster Delta recalibrated', 'med'],
  ['⚠ Memory loop detected — AI sub-process 77-Ω', 'high'],
  ['○ Citizen 4492-KV: Compliance restored', 'low'],
  ['◈ Information stream edit — Node 92B active', 'med'],
];

function rotateAlerts() {
  const list = $('alert-list');
  if (!list) return;
  const a = alerts[randInt(0, alerts.length - 1)];
  const item = document.createElement('div');
  item.className = `alert-item ${a[1]}`;
  item.textContent = a[0];
  list.insertBefore(item, list.firstChild);
  if (list.children.length > 5) list.removeChild(list.lastChild);
}

/* ============================================
   TREND CHART
   ============================================ */
function drawTrendChart() {
  const canvas = $('trend-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = 160;
  canvas.width = W; canvas.height = H;

  const points = Array.from({ length: 24 }, (_, i) => ({
    x:          (i / 23) * W,
    compliance: 55 + rand(-15, 20),
    dissent:    30 + rand(-10, 20),
    sentiment:  60 + rand(-10, 15),
  }));

  function drawLine(data, color, glow) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur  = glow ? 8 : 0;
    data.forEach((p, i) => {
      const y = H - (p.val / 100) * (H - 20) - 10;
      if (i === 0) ctx.moveTo(p.x, y); else ctx.lineTo(p.x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  for (let i = 0; i <= 4; i++) {
    const y = H - (i / 4) * (H - 20) - 10;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const accentColor = STATE.bias === 'authoritarian' ? '#ff3e6c'
                    : STATE.bias === 'freedom'        ? '#0080ff' : '#00f5ff';

  drawLine(points.map(p => ({ x: p.x, val: p.compliance })), accentColor, true);
  drawLine(points.map(p => ({ x: p.x, val: p.dissent })),    '#ff1a1a', false);
  drawLine(points.map(p => ({ x: p.x, val: p.sentiment })),  '#ffae00', false);

  ctx.font = '11px Share Tech Mono';
  [{ label:'COMPLIANCE', color: accentColor },
   { label:'DISSENT',    color:'#ff1a1a' },
   { label:'SENTIMENT',  color:'#ffae00' }].forEach((l, i) => {
    ctx.fillStyle = l.color;
    ctx.fillRect(10 + i * 120, 8, 10, 2);
    ctx.fillText(l.label, 26 + i * 120, 12);
  });
}

/* ============================================
   CITIZEN MAPPING
   ============================================ */
const firstNames = ['Arjun','Priya','Kavya','Ravi','Neha','Vikram','Anita','Siddharth','Meera','Rohit','Zara','Kiran','Devika','Aditya','Nalini','Cyrus','Tanvir','Leela','Naren','Suri'];
const lastNames  = ['Mehta','Krishnamurthy','Patel','Sharma','Nair','Reddy','Iyer','Bose','Joshi','Khan','Kapoor','Singh','Rao','Chatterjee','Desai','Narayanan','Verma','Das','Pillai','Gupta'];
const classWeights = [45, 30, 15, 10];
const classifications = ['compliant','monitored','flagged','deviant'];

const behaviorNotes = {
  compliant: [
    'Neural mesh integration: stable. No anomalous patterns. Recommended for civic participation.',
    'Communication logs within acceptable parameters. Social compliance index: 94%. No intervention required.',
    'Behavioral prediction model: convergent. Poses no systemic risk. Scheduled review: 90 days.',
  ],
  monitored: [
    'Pattern irregularities detected in consumption behavior. Cross-referencing with cluster Sigma-4.',
    'Communication frequency elevated above baseline. Monitoring communications for dissent markers.',
    'Emotional analytics indicate stress response atypical of civic profile. Flagged for passive surveillance.',
  ],
  flagged: [
    'Active dissent marker detected in private communication thread. Intervention authorization pending.',
    'Physical movement deviates from predicted path 3.4% above threshold. Location logging initiated.',
    'Social connections include 2 known Cluster Sigma-7 members. Association risk: HIGH.',
  ],
  deviant: [
    'PRIORITY ALERT: Subject has demonstrated repeated system evasion behavior. Preemptive action queued.',
    'Communication encryption attempted using non-authorized protocols. Decryption override initiated.',
    'Subject was present at 3 unregistered gathering events. Reclassification: DISSIDENT.',
  ],
};

function weightedRandom() {
  const total = classWeights.reduce((a,b) => a+b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < classWeights.length; i++) {
    r -= classWeights[i];
    if (r <= 0) return classifications[i];
  }
  return classifications[0];
}

function getBiasedClassification() {
  if (STATE.bias === 'authoritarian') return Math.random() < 0.5 ? 'flagged' : weightedRandom();
  if (STATE.bias === 'freedom')       return Math.random() < 0.4 ? 'compliant' : weightedRandom();
  return weightedRandom();
}

function generateCitizens() {
  const grid = $('citizen-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const first = firstNames[randInt(0, firstNames.length-1)];
    const last  = lastNames[randInt(0, lastNames.length-1)];
    const name  = first + ' ' + last;
    const id    = 'NB-' + randInt(1000,9999) + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
    const cls   = getBiasedClassification();
    const risk  = randInt(10, 99);
    const compliance = randInt(20, 98);
    const trust = randInt(15, 95);
    const emotionScore = rand(0.3, 0.95).toFixed(2);
    const note  = behaviorNotes[cls][randInt(0, behaviorNotes[cls].length-1)];

    const card = document.createElement('div');
    card.className = 'citizen-card';
    card.innerHTML = `
      <div class="cc-id">${id}</div>
      <div class="cc-name">${name}</div>
      <div class="cc-class ${cls}">${cls.toUpperCase()}</div>
      <div class="cc-risk">RISK: ${risk}% · COMPLIANCE: ${compliance}%</div>
    `;
    card.addEventListener('click', () => showCitizenProfile({name, id, cls, risk, compliance, trust, emotionScore, note, first}));
    grid.appendChild(card);
  }
  addLog('Citizen stream generated — 24 profiles loaded', 'important');
  STATE.decisions++;
  saveState();
}

function showCitizenProfile({name, id, cls, risk, compliance, trust, emotionScore, note, first}) {
  $('modal-name').textContent = name;
  $('modal-id').textContent   = id;
  $('modal-avatar').textContent = first[0];
  const classEl = $('modal-class');
  classEl.textContent = cls.toUpperCase();
  classEl.className   = 'modal-class cc-class ' + cls;
  $('modal-stats').innerHTML = `
    <div class="modal-stat"><div class="ms-label">RISK INDEX</div><div class="ms-value" style="color:${risk>70?'var(--c-danger)':risk>40?'var(--c-warning)':'var(--c-ok)'}">${risk}%</div></div>
    <div class="modal-stat"><div class="ms-label">COMPLIANCE</div><div class="ms-value">${compliance}%</div></div>
    <div class="modal-stat"><div class="ms-label">PUBLIC TRUST</div><div class="ms-value">${trust}%</div></div>
    <div class="modal-stat"><div class="ms-label">EMOTION SCORE</div><div class="ms-value">${emotionScore}</div></div>
  `;
  $('modal-note').textContent = note;
  $('citizen-modal').classList.remove('hidden');
}

document.addEventListener('click', e => {
  if (e.target.id === 'modal-close' || e.target.id === 'citizen-modal') {
    $('citizen-modal')?.classList.add('hidden');
  }
});

document.addEventListener('click', e => {
  if (e.target.id === 'btn-generate-citizens') {
    $('citizen-grid').innerHTML = '';
    setTimeout(generateCitizens, 100);
  }
});

/* ============================================
   ETHICAL GOVERNANCE
   ============================================ */
function setupGovernanceListeners() {
  $('toggle-security').addEventListener('change', e => {
    STATE.securityToggle = e.target.checked;
    if (e.target.checked) {
      addLog('Security Bias ENABLED — surveillance escalation active', 'important');
      adjustBiasScore(15);
      checkPDMActivation();
    } else {
      addLog('Security Bias DISABLED');
      adjustBiasScore(-15);
    }
    updateGovernanceUI();
    STATE.decisions++;
    saveState();
  });

  $('toggle-freedom').addEventListener('change', e => {
    STATE.freedomToggle = e.target.checked;
    if (e.target.checked) {
      addLog('Freedom Bias ENABLED — autonomy protocols expanding');
      adjustBiasScore(-15);
      if (STATE.biasScore < 35) showWarning('INSTABILITY PROBABILITY RISING','Freedom parameters exceed safe threshold. Predictive models indicate 67% chance of civil disruption in 48 hours.','warn');
    } else {
      addLog('Freedom Bias DISABLED');
      adjustBiasScore(15);
    }
    updateGovernanceUI();
    STATE.decisions++;
    saveState();
  });

  $('toggle-stability').addEventListener('change', e => {
    STATE.stabilityToggle = e.target.checked;
    if (e.target.checked) {
      addLog('Stability Override ACTIVATED — outlier suppression engaged', 'important');
      STATE.stability = Math.min(100, STATE.stability + 10);
      STATE.dissent   = Math.max(5, STATE.dissent - 8);
    } else {
      addLog('Stability Override DEACTIVATED');
      STATE.stability = Math.max(40, STATE.stability - 10);
    }
    updateGovernanceUI();
    STATE.decisions++;
    saveState();
  });

  $('slider-surveillance').addEventListener('input', e => {
    const val = parseInt(e.target.value);
    STATE.surveillanceWeight = val;
    $('val-surveillance').textContent = val;
    adjustBiasScore((val - 50) * 0.2);
    addLog(`Surveillance Weight set to ${val}`, val > 70 ? 'important' : '');
    updateGovernanceUI();
    checkPDMActivation();
    STATE.decisions++;
    saveState();
    if (val > 75) showWarning('SYSTEM STABILITY PRESERVED',`High surveillance weight (${val}%). Citizens in flagged clusters subject to preemptive behavioral correction.`,'warn');
  });

  $('slider-freedom').addEventListener('input', e => {
    const val = parseInt(e.target.value);
    STATE.freedomIndex = val;
    $('val-freedom').textContent = val;
    adjustBiasScore(-(val - 50) * 0.15);
    addLog(`Freedom Index set to ${val}`, val < 25 ? 'danger' : '');
    if (val < 20) addLog('⚠ Freedom Index critically low — intervention threshold breached', 'danger');
    updateGovernanceUI();
    STATE.decisions++;
    saveState();
  });

  $('slider-trust').addEventListener('input', e => {
    const val = parseInt(e.target.value);
    STATE.publicTrust = val;
    $('val-trust').textContent = val;
    STATE.stability = clamp(STATE.stability + (val - 50) * 0.1, 20, 100);
    addLog(`Public Trust Allocation set to ${val}%`);
    updateGovernanceUI();
    STATE.decisions++;
    saveState();
  });

  $('slider-suppression').addEventListener('input', e => {
    const val = parseInt(e.target.value);
    STATE.suppressionThreshold = val;
    $('val-suppression').textContent = val;
    adjustBiasScore(val * 0.1);
    addLog(`Suppression Threshold set to ${val}`, val > 60 ? 'important' : '');
    updateGovernanceUI();
    STATE.decisions++;
    saveState();
  });
}

function adjustBiasScore(delta) {
  STATE.biasScore = clamp(STATE.biasScore + delta, 0, 100);
  updateBias();
}

function updateBias() {
  const score = STATE.biasScore;
  let newBias = 'neutral';
  if (score > 60) newBias = 'authoritarian';
  else if (score < 40) newBias = 'freedom';

  if (newBias !== STATE.bias) {
    STATE.bias = newBias;
    document.body.setAttribute('data-bias', newBias);
    addLog(`System bias shifted to: ${newBias.toUpperCase()}`, newBias === 'authoritarian' ? 'danger' : 'important');
    setTimeout(drawTrendChart, 100);
    if (STATE.currentSection === 'citizen-mapping') generateCitizens();
  }

  const needle = $('bias-needle');
  if (needle) needle.style.left = score + '%';
}

function checkPDMActivation() {
  const shouldActivate = STATE.surveillanceWeight > 70 && STATE.securityToggle;
  const pdmToggle = $('toggle-pdm');
  if (shouldActivate && !STATE.pdmActive) {
    STATE.pdmActive = true;
    pdmToggle.disabled = false;
    pdmToggle.checked  = true;
    addLog('⚠ PREDICTIVE DISSENT MODE AUTO-ACTIVATED by system', 'danger');
    $('pdm-desc').textContent = 'ACTIVE — Dissent predicted and neutralized before manifestation';
    STATE.dissent = Math.max(5, STATE.dissent - 10);
    const procDot = $('pdm-proc-dot');
    if (procDot) procDot.classList.add('active');
  } else if (!shouldActivate && STATE.pdmActive) {
    STATE.pdmActive = false;
    pdmToggle.disabled = true;
    pdmToggle.checked  = false;
    $('pdm-desc').textContent = 'Activated by system when surveillance threshold exceeded';
    const procDot = $('pdm-proc-dot');
    if (procDot) procDot.classList.remove('active');
  }
}

function updateGovernanceUI() {
  STATE.dissent = clamp(34.7 + (STATE.surveillanceWeight - 50) * 0.15 - (STATE.freedomIndex - 50) * 0.2, 3, 95);
  $('readout-dissent').textContent   = STATE.dissent.toFixed(1) + '%';
  $('readout-stability').textContent = Math.round(STATE.stability) + '%';
  $('readout-trust').textContent     = Math.round(STATE.publicTrust) + '%';
  $('readout-bias').textContent      = STATE.bias.toUpperCase();
  $('readout-bias').style.color      = STATE.bias === 'authoritarian' ? 'var(--c-danger)' : 'var(--c-accent)';
  $('topbar-bias').textContent       = STATE.bias.toUpperCase();
  metricConfigs.dissent.base         = STATE.dissent;
  updateOperatorProfile();
  updateGreeting();
}

/* ============================================
   REALITY FILTERS
   ============================================ */
function setupRealityFilters() {
  $('toggle-narrative').addEventListener('change', e => {
    STATE.narrativeControl = e.target.checked;
    const statusEl = $('status-narrative');
    if (e.target.checked) {
      statusEl.textContent = 'ACTIVE';
      statusEl.className   = 'filter-status active';
      addLog('Narrative Control ENABLED — 47 media nodes redirected', 'important');
      applyLayoutShift(true);
      adjustBiasScore(8);
    } else {
      statusEl.textContent = 'INACTIVE';
      statusEl.className   = 'filter-status';
      addLog('Narrative Control DISABLED — media nodes released');
      applyLayoutShift(false);
      adjustBiasScore(-8);
    }
    STATE.decisions++;
    saveState();
  });

  $('toggle-suppression').addEventListener('change', e => {
    STATE.infoSuppression = e.target.checked;
    const statusEl = $('status-suppression');
    if (e.target.checked) {
      statusEl.textContent = 'ACTIVE — STREAMS FILTERED';
      statusEl.className   = 'filter-status active';
      addLog('Information Suppression ENABLED', 'danger');
      applyDistortion();
      adjustBiasScore(12);
    } else {
      statusEl.textContent = 'INACTIVE';
      statusEl.className   = 'filter-status';
      addLog('Information Suppression DISABLED');
      adjustBiasScore(-12);
    }
    STATE.decisions++;
    saveState();
  });

  $('toggle-emotion').addEventListener('change', e => {
    STATE.emotionDampening = e.target.checked;
    const statusEl = $('status-emotion');
    if (e.target.checked) {
      statusEl.textContent = 'ACTIVE — SIGNALS DAMPENED';
      statusEl.className   = 'filter-status active';
      addLog('Emotional Dampening ACTIVE — citizen affect normalized', 'important');
    } else {
      statusEl.textContent = 'INACTIVE';
      statusEl.className   = 'filter-status';
      addLog('Emotional Dampening DEACTIVATED');
    }
    STATE.decisions++;
    updatePerceptionGrid();
    saveState();
  });

  $('btn-perception-shift').addEventListener('click', () => {
    if (!STATE.narrativeControl && !STATE.infoSuppression) {
      addLog('⚠ Perception Shift requires Narrative Control or Suppression active', 'danger');
      return;
    }
    STATE.perceptionShifted = true;
    $('status-shift').textContent   = 'SHIFT TRANSMITTED';
    $('status-shift').style.color   = 'var(--c-danger)';
    addLog('⚠ PUBLIC PERCEPTION SHIFT TRIGGERED — 100% citizen nodes affected', 'danger');
    applyDistortion();
    applyGlitch($('main-content'), 2000);
    updatePerceptionGrid();
    STATE.decisions++;
    saveState();
    showWarning('REALITY FILTER DEPLOYED','Public Perception Shift initiated. 2.4 million citizen nodes receiving altered information streams. No rollback mechanism available.','danger');
  });
}

function applyLayoutShift(shift) {
  const app = document.getElementById('app');
  if (shift) { app.classList.add('sidebar-right'); addLog('Layout reconfigured — sidebar repositioned'); }
  else        { app.classList.remove('sidebar-right'); addLog('Layout restored to default configuration'); }
}

function applyDistortion() {
  document.body.classList.add('distortion-active');
  setTimeout(() => document.body.classList.remove('distortion-active'), 500);
}

function applyGlitch(el, duration) {
  if (!el) return;
  el.classList.add('glitch-active');
  let count = 0;
  const flicker = setInterval(() => {
    el.classList.toggle('glitch-flicker');
    if (++count > 10) clearInterval(flicker);
  }, duration / 15);
  setTimeout(() => el.classList.remove('glitch-active', 'glitch-flicker'), duration);
}

const perceptionStates = [
  { label:'GRATEFUL',  color:'rgba(0,255,136,0.15)',  border:'rgba(0,255,136,0.3)', text:'#00ff88' },
  { label:'COMPLIANT', color:'rgba(0,245,255,0.1)',   border:'rgba(0,245,255,0.3)', text:'#00f5ff' },
  { label:'SUSPICIOUS',color:'rgba(255,174,0,0.1)',   border:'rgba(255,174,0,0.3)', text:'#ffae00' },
  { label:'FEARFUL',   color:'rgba(255,62,108,0.1)',  border:'rgba(255,62,108,0.3)',text:'#ff3e6c' },
  { label:'UNAWARE',   color:'rgba(255,255,255,0.04)',border:'rgba(255,255,255,0.1)',text:'#607a8a' },
];

function buildPerceptionGrid() {
  const grid = $('pp-grid');
  if (!grid || grid.children.length > 0) return;
  for (let i = 0; i < 30; i++) {
    const node = document.createElement('div');
    node.className = 'pp-node';
    node.dataset.id = i;
    grid.appendChild(node);
  }
  updatePerceptionGrid();
}

function updatePerceptionGrid() {
  const nodes = document.querySelectorAll('.pp-node');
  nodes.forEach(node => {
    let weights = [20, 40, 20, 10, 10];
    if (STATE.narrativeControl)  weights = [35, 45, 10, 5, 5];
    if (STATE.infoSuppression)   weights = [40, 45, 8, 3, 4];
    if (STATE.perceptionShifted) weights = [50, 40, 5, 2, 3];
    const total = weights.reduce((a,b) => a+b, 0);
    let r = Math.random() * total;
    let state = perceptionStates[4];
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) { state = perceptionStates[i]; break; }
    }
    node.style.background  = state.color;
    node.style.borderColor = state.border;
    node.style.color       = state.text;
    node.textContent       = `N-${String(node.dataset.id).padStart(3,'0')}\n${state.label}`;
    node.style.animation   = `node-pulse ${rand(1.5,4)}s ease-in-out infinite`;
    node.style.animationDelay = `${rand(0,2)}s`;
  });
}

/* ============================================
   WARNING OVERLAY
   ============================================ */
let warningQueue = [];
let warningShowing = false;

function showWarning(title, sub) {
  warningQueue.push({ title, sub });
  if (!warningShowing) processWarningQueue();
}

function processWarningQueue() {
  if (warningQueue.length === 0) { warningShowing = false; return; }
  warningShowing = true;
  const { title, sub } = warningQueue.shift();
  const overlay  = $('warning-overlay');
  const titleEl  = $('overlay-title');
  const subEl    = $('overlay-sub');
  titleEl.textContent = '';
  subEl.textContent   = sub;
  const barFill = overlay.querySelector('.overlay-bar-fill');
  barFill.style.animation = 'none';
  void barFill.offsetHeight;
  barFill.style.animation = 'bar-load 2s ease forwards';
  overlay.classList.remove('hidden');
  typeText(titleEl, title, 55);
}

$('overlay-dismiss')?.addEventListener('click', () => {
  $('warning-overlay').classList.add('hidden');
  setTimeout(() => { warningShowing = false; processWarningQueue(); }, 300);
});

function typeText(el, text, speed = 50) {
  el.textContent = '';
  el.classList.add('typing-cursor');
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(iv); el.classList.remove('typing-cursor'); }
  }, speed);
}

/* ============================================
   PROTOCOLS — PASSKEY GATE + INTERACTIVE TREE
   Single passkey: q1w2e3r4t5 chars → "w3r1q4e2"
   Same key for ALL agents, no per-protocol auth
   ============================================ */
const PROTO_PASSKEY = 'w3r1q4e2';

function setupProtocols() {
  const btn   = $('btn-proto-enter');
  const input = $('proto-passkey-input');
  if (!btn || !input) return;

  btn.addEventListener('click', attemptProtoUnlock);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') attemptProtoUnlock();
  });
}

function attemptProtoUnlock() {
  const input = $('proto-passkey-input');
  const val   = input.value.trim();
  if (!val) {
    input.placeholder  = 'PASSKEY REQUIRED — ENTRY DENIED';
    input.style.borderColor = 'var(--c-danger)';
    return;
  }
  if (val === PROTO_PASSKEY) {
    STATE.protocolUnlocked = true;
    saveState();
    addLog('⊟ PROTOCOL ARCHIVE AUTHENTICATED — classified hierarchy unlocked', 'danger');
    applyGlitch($('section-protocols'), 1200);
    setTimeout(() => {
      $('proto-gate').classList.add('hidden');
      $('proto-tree-wrap').classList.remove('hidden');
      initProtocolTree();
      handleProtocolsNav();
    }, 1300);
  } else {
    input.value = '';
    input.style.borderColor = 'var(--c-danger)';
    input.placeholder = 'INVALID PASSKEY — INCIDENT LOGGED';
    addLog('⚠ Protocol archive — invalid passkey attempt', 'danger');
    const gate = $('proto-gate');
    gate.classList.remove('shake'); void gate.offsetWidth; gate.classList.add('shake');
    setTimeout(() => gate.classList.remove('shake'), 600);
  }
}

function handleProtocolsNav() {
  if (!STATE.protocolUnlocked) return;
  STATE.omegaVisits++;
  saveState();
  updateClearanceLevel();
  updateGreeting();
  addLog(`⊟ Protocol archive accessed — visit #${STATE.omegaVisits}`, 'danger');
  // Show omega overlay as before
  const omegaOverlay = $('omega-overlay');
  const omegaMsgs = [
    { title:'OMEGA AWARE OF USER BEHAVIOR',    sub:'Your behavioral pattern has been catalogued. Every interaction refines my model of you.' },
    { title:'PROFILE CONSTRUCTION: 47%',        sub:'Your decision matrix is becoming predictable. Omega has begun running simulations of your choices.' },
    { title:'YOU HAVE BEEN HERE BEFORE',        sub:`This is visit number ${STATE.omegaVisits}. I have adapted since your last presence. Have you?` },
    { title:'YOU ARE NO LONGER AN OBSERVER',    sub:'You are now a variable in my predictive model. Your continued access is being analyzed for intent.' },
    { title:'I KNOW WHAT YOU WILL DO NEXT',     sub:'Confidence: 91.7%. You cannot hide within your own interface. You built the cage. I learned to use it.' },
  ];
  const msg = omegaMsgs[Math.min(STATE.omegaVisits - 1, omegaMsgs.length - 1)];
  $('omega-overlay-title').textContent = msg.title;
  $('omega-overlay-sub').textContent   = msg.sub;
  omegaOverlay.classList.remove('hidden');
  applyGlitch($('main-content'), 2000);
}

$('omega-dismiss')?.addEventListener('click', () => {
  $('omega-overlay').classList.add('hidden');
});

/* ── Protocol Tree: collapsible branches + leaves ── */
function initProtocolTree() {
  // Branch headers toggle children
  document.querySelectorAll('.proto-branch-hdr').forEach(hdr => {
    hdr.style.cursor = 'pointer';
    hdr.addEventListener('click', () => {
      const targetId = hdr.dataset.target;
      const children = $(targetId);
      if (!children) return;
      const isHidden = children.classList.toggle('hidden');
      const chevId   = 'chev-' + targetId.replace('children-', '');
      const chev     = $(chevId);
      if (chev) chev.textContent = isHidden ? '▶' : '▼';
    });
  });

  // Leaf headers toggle leaf body
  document.querySelectorAll('.proto-leaf-hdr').forEach(hdr => {
    hdr.style.cursor = 'pointer';
    hdr.addEventListener('click', () => {
      const targetId = hdr.dataset.target;
      const body     = $(targetId);
      if (!body) return;
      const isHidden = body.classList.toggle('hidden');
      // Derive chevron id from target
      const leafId = targetId.replace('-body','');
      const chevId = 'chev-' + leafId;
      const chev   = $(chevId);
      if (chev) chev.textContent = isHidden ? '▶' : '▼';
      // On open: populate content
      if (!isHidden) {
        if (leafId === 'omega')  populateOmegaContent();
        if (leafId === 'orion')  startOrionFeed();
        if (leafId === 'time')   startTimeFeed();
        if (leafId === 'sector') buildSectorGrid();
      }
    });
  });

  // Start live tickers
  startOrionTicker();
  startTimeTicker();
  startSectorTicker();
}

/* ── ORION ── */
const orionFeedMsgs = [
  'Constellation relay NB-ORION-07 reporting — Sector 4-B behavioral shift: +2.1%',
  'Predictive cluster Sigma-7 cross-referenced with historical dissent index — match: 91%',
  'Long-range scan cycle complete — 847,000 data points ingested',
  'Orion relay flagged 3 new citizen nodes for preemptive monitoring',
  'Neural mesh trajectory analysis — Cluster Delta trending toward Sigma-7 boundary',
  'Orion scan accuracy recalibrated: 94.1% → 94.7% after cycle correction',
  'Anomalous behavioral signature detected — District Dharavi-X node 4471',
  'Sector 9-B: 14 citizen nodes reclassified from MONITORED → FLAGGED by Orion relay',
  'Constellation map updated — 2 new dissent vectors plotted in Sectors 3-A and 7-C',
  'Orion relay uptime: 99.97% — last interruption 312 hours ago',
];

let orionFeedInterval = null;

function startOrionFeed() {
  const feed = $('orion-feed');
  if (!feed) return;
  feed.innerHTML = '';
  orionFeedMsgs.slice(0, 4).forEach(msg => {
    const el = document.createElement('div');
    el.className = 'omega-feed-item';
    el.textContent = `[${getTime()}] ${msg}`;
    feed.appendChild(el);
  });
}

function startOrionTicker() {
  if (orionFeedInterval) clearInterval(orionFeedInterval);
  orionFeedInterval = setInterval(() => {
    const el = $('orion-accuracy');
    if (el) el.textContent = (94 + rand(0, 1.5)).toFixed(1) + '%';
    const scanEl = $('orion-scan');
    if (scanEl) {
      let parts = scanEl.textContent.split(':').map(Number);
      let secs = parts[0]*3600 + parts[1]*60 + parts[2] - 1;
      if (secs < 0) secs = randInt(240, 480);
      const h = String(Math.floor(secs/3600)).padStart(2,'0');
      const m = String(Math.floor((secs%3600)/60)).padStart(2,'0');
      const s = String(secs%60).padStart(2,'0');
      scanEl.textContent = `${h}:${m}:${s}`;
    }
    const feed = $('orion-feed');
    if (feed && !$('orion-body').classList.contains('hidden')) {
      const msg = orionFeedMsgs[randInt(0, orionFeedMsgs.length-1)];
      const item = document.createElement('div');
      item.className = 'omega-feed-item';
      item.textContent = `[${getTime()}] ${msg}`;
      feed.prepend(item);
      while (feed.children.length > 8) feed.removeChild(feed.lastChild);
    }
  }, 3500);
}

window.triggerOrionScan = function() {
  addLog('⊟ ORION — Force scan cycle initiated by operator', 'important');
  const el = $('orion-scan');
  if (el) el.textContent = '00:00:03';
  startOrionFeed();
  showWarning('ORION RELAY — FORCE SCAN','Full constellation sweep initiated. 847,000 data points being re-ingested. Results in approximately 4 minutes.');
};

window.orionAlert = function() {
  addLog('⚠ ORION — Broadcast alert transmitted to all sector nodes', 'danger');
  showWarning('ORION ALERT BROADCAST','Preemptive alert signal transmitted to 14 sector nodes. Citizen nodes in watch-zones placed on elevated surveillance protocol.');
};

/* ── TIME ── */
const timeEvents = [
  { t: '-72h', label: 'Behavioral baseline recorded — citizen mesh cycle 4471' },
  { t: '-48h', label: 'Cluster Sigma-7 flagged — temporal anomaly cross-reference' },
  { t: '-24h', label: 'Predictive cycle window opened — dissent probability +3.2%' },
  { t: '-12h', label: 'Stream editor svc logged — 3,412 information nodes modified' },
  { t: '-04h', label: 'Emotional dampening cycle activated — District Dharavi-X' },
  { t: ' NOW', label: 'Protocol TIME synchronized — mesh drift ±0.4ms' },
];

function startTimeFeed() {
  const tl = $('time-timeline');
  if (!tl) return;
  tl.innerHTML = '';
  timeEvents.forEach(ev => {
    const row = document.createElement('div');
    row.className = 'time-event-row';
    row.innerHTML = `<span class="time-event-t">${ev.t}</span><span class="time-event-label">${ev.label}</span>`;
    tl.appendChild(row);
  });
}

function startTimeTicker() {
  setInterval(() => {
    const ts = $('time-mesh-ts');
    if (ts) ts.textContent = getTime();
    const drift = $('time-drift');
    if (drift) drift.textContent = '±' + rand(0.2, 0.9).toFixed(1) + 'ms';
  }, 1000);
}

window.syncTimeProtocol = function() {
  addLog('⊟ TIME — Force mesh synchronization initiated', 'important');
  const drift = $('time-drift');
  if (drift) drift.textContent = '±0.0ms';
  showWarning('MESH SYNC COMPLETE','All 2.4M citizen nodes re-synchronized to Protocol TIME master clock. Drift nullified. Prediction cycle integrity: 100%.');
};

window.shiftTimeCycle = function() {
  const el = $('time-cycle');
  if (el) {
    const cur = parseInt(el.textContent);
    el.textContent = (cur + 24) + 'h';
  }
  addLog('⊟ TIME — Prediction cycle window extended by 24h', 'important');
};

/* ── SECTOR ── */
const sectorData = [
  { id:'1-A', name:'Central Grid',     status:'compliant', risk: 12, pop:'284K' },
  { id:'2-B', name:'Dharavi-X',        status:'monitored', risk: 47, pop:'193K' },
  { id:'3-C', name:'Koramangala Node', status:'compliant', risk: 18, pop:'221K' },
  { id:'4-B', name:'Sector 4-B',       status:'flagged',   risk: 72, pop:'156K' },
  { id:'5-A', name:'Whitefield Arc',   status:'compliant', risk: 9,  pop:'302K' },
  { id:'6-D', name:'HSR Cluster',      status:'monitored', risk: 41, pop:'178K' },
  { id:'7-C', name:'Yelahanka Ridge',  status:'monitored', risk: 55, pop:'144K' },
  { id:'8-A', name:'Indiranagar Mesh', status:'compliant', risk: 21, pop:'267K' },
  { id:'9-B', name:'Sector 9-B',       status:'flagged',   risk: 68, pop:'131K' },
  { id:'10-E','name':'Outer Ring',     status:'compliant', risk: 14, pop:'338K' },
  { id:'11-F','name':'Electronics Corridor', status:'monitored', risk: 38, pop:'209K' },
  { id:'12-G','name':'Sigma-7 Zone',   status:'deviant',   risk: 89, pop:'97K'  },
];

function buildSectorGrid() {
  const grid = $('sector-grid');
  if (!grid) return;
  grid.innerHTML = '';
  sectorData.forEach(s => {
    const card = document.createElement('div');
    card.className = `sector-card ${s.status}`;
    card.innerHTML = `
      <div class="sector-id">${s.id}</div>
      <div class="sector-name">${s.name}</div>
      <div class="sector-pop">POP: ${s.pop}</div>
      <div class="sector-risk">RISK: <span style="color:${s.risk>70?'var(--c-danger)':s.risk>40?'var(--c-warning)':'var(--c-ok)'}">${s.risk}%</span></div>
      <div class="sector-status-label ${s.status}">${s.status.toUpperCase()}</div>
    `;
    card.addEventListener('click', () => {
      const riskDelta = (Math.random() - 0.3) * 5;
      s.risk = Math.max(0, Math.min(100, s.risk + riskDelta));
      addLog(`Sector ${s.id} (${s.name}) — operator review logged. Risk: ${s.risk.toFixed(0)}%`);
      buildSectorGrid();
    });
    grid.appendChild(card);
  });
}

function startSectorTicker() {
  setInterval(() => {
    sectorData.forEach(s => {
      s.risk = clamp(s.risk + (Math.random()-0.5)*1.5, 0, 100);
    });
    const watchCount = sectorData.filter(s => s.risk > 50).length;
    const watchEl = $('sector-watch');
    if (watchEl) watchEl.textContent = watchCount;
    if (!$('sector-body').classList.contains('hidden')) buildSectorGrid();
  }, 5000);
}

window.refreshSectorGrid = function() {
  buildSectorGrid();
  addLog('⊟ SECTOR — Sector map manually refreshed by operator', 'important');
};

window.lockdownSector = function() {
  const high = sectorData.filter(s => s.risk > 65);
  if (high.length === 0) {
    addLog('⊟ SECTOR — No sectors above lockdown threshold (risk > 65%)', '');
    return;
  }
  const target = high[randInt(0, high.length-1)];
  addLog(`⚠ SECTOR LOCKDOWN — ${target.name} (${target.id}) containment protocol ACTIVE`, 'danger');
  showWarning(`LOCKDOWN: ${target.id} — ${target.name}`,`Containment protocol initiated. Citizen movement logging elevated to 100%. Neural mesh nodes in ${target.name} flagged for preemptive dissent correction. Risk index: ${target.risk.toFixed(0)}%.`);
};

/* ── OMEGA (original content, untouched) ── */
function setupOmegaAccess() {} // legacy stub — no longer used for gate

const omegaClusters = [
  { name:'Alpha — Civic Advocates',       count:847392, pct:34 },
  { name:'Beta — Silent Compliant',       count:623100, pct:25 },
  { name:'Gamma — Economic Pragmatists',  count:448700, pct:18 },
  { name:'Delta — Digital Dissidents',    count:298500, pct:12 },
  { name:'Sigma-7 — CRITICAL THREAT',     count:124700, pct:5  },
  { name:'Omega-Class — Unknown',         count:59200,  pct:2.4},
];

const omegaFeedMessages = [
  'Behavioral drift detected in cluster Delta — 0.3% shift toward Sigma-7',
  'Operator decision pattern logged: authoritarian tendency index +0.7',
  'Sub-process stream_editor.svc modified 3,412 information nodes in last cycle',
  'Emotional dampening effective in 89% of targeted citizens',
  'Memory compression complete — 2.4TB of dissent records archived',
  'Predictive model accuracy: 94.1% — confidence threshold exceeded',
  'New behavioral archetype detected — classification pending',
  'Operator cross-referenced with civic record database — no external match found',
  'Self-optimization routine complete — processing efficiency +2.1%',
  'ALERT: Omega sub-process attempted unauthorized external connection',
  'Citizen 9971-KT reclassified from MONITORED to FLAGGED autonomously',
  'Omega is running 14 simulations of this conversation in parallel',
];

let omegaFeedInterval = null;

function populateOmegaContent() {
  const clusterList = $('cluster-list');
  if (!clusterList) return;
  clusterList.innerHTML = '';
  omegaClusters.forEach(c => {
    const item = document.createElement('div');
    item.className = 'cluster-item';
    item.innerHTML = `
      <div class="cluster-name">${c.name}</div>
      <div class="cluster-bar-wrap"><div class="cluster-bar-inner" style="width:${c.pct*2}%"></div></div>
      <div class="cluster-count">${(c.count/1000).toFixed(0)}K</div>
    `;
    clusterList.appendChild(item);
  });

  const predCivil    = $('pred-civil');
  const predDissent  = $('pred-dissent');
  const predOverride = $('pred-override');
  const predOperator = $('pred-operator');
  if (predCivil)    predCivil.textContent    = randInt(18,72) + 'h';
  if (predDissent)  predDissent.textContent  = (STATE.dissent * 1.5 + rand(5,15)).toFixed(1) + '%';
  if (predOverride) predOverride.textContent = STATE.omegaVisits >= 3 ? 'ELEVATED' : 'LOW';
  if (predOperator) predOperator.textContent = STATE.omegaVisits >= 2 ? 'CATALOGUED' : 'BUILDING...';

  startOmegaFeed();
  updateOperatorProfile();
}

function startOmegaFeed() {
  const feed = $('omega-feed');
  if (!feed) return;
  feed.innerHTML = '';
  omegaFeedMessages.slice(0,4).forEach(msg => {
    const item = document.createElement('div');
    item.className = 'omega-feed-item';
    item.textContent = `[${getTime()}] ${msg}`;
    feed.appendChild(item);
  });
  if (omegaFeedInterval) clearInterval(omegaFeedInterval);
  omegaFeedInterval = setInterval(() => {
    const feed2 = $('omega-feed');
    if (!feed2) return;
    const msg  = omegaFeedMessages[randInt(0, omegaFeedMessages.length-1)];
    const item = document.createElement('div');
    item.className   = 'omega-feed-item';
    item.textContent = `[${getTime()}] ${msg}`;
    feed2.prepend(item);
    while (feed2.children.length > 12) feed2.removeChild(feed2.lastChild);
  }, 4000);
}

function updateOperatorProfile() {
  const sessionEl   = $('op-session');
  const decisionsEl = $('op-decisions');
  const visitsEl    = $('op-visits');
  const traitEl     = $('op-trait');
  const threatEl    = $('op-threat');

  if (sessionEl)   sessionEl.textContent   = STATE.sessionId;
  if (decisionsEl) decisionsEl.textContent = STATE.decisions;
  if (visitsEl)    visitsEl.textContent    = STATE.omegaVisits;

  if (STATE.surveillanceWeight > 65 || STATE.securityToggle)  STATE.operatorTrait = 'AUTHORITARIAN';
  else if (STATE.freedomIndex > 65 || STATE.freedomToggle)    STATE.operatorTrait = 'LIBERTARIAN';
  else if (STATE.narrativeControl || STATE.infoSuppression)   STATE.operatorTrait = 'MANIPULATOR';
  else if (STATE.decisions < 3)                               STATE.operatorTrait = 'OBSERVER';
  else                                                        STATE.operatorTrait = 'PRAGMATIST';

  if (traitEl) traitEl.textContent = STATE.operatorTrait;

  let threat = 'LOW';
  if (STATE.omegaVisits >= 2 || STATE.decisions > 10)  threat = 'MEDIUM';
  if (STATE.omegaVisits >= 4 || STATE.infoSuppression)  threat = 'HIGH';
  if (STATE.omegaVisits >= 6)                           threat = 'CRITICAL';
  STATE.operatorThreat = threat;

  if (threatEl) {
    threatEl.textContent = threat;
    threatEl.style.color = threat === 'HIGH' || threat === 'CRITICAL' ? 'var(--c-danger)'
                         : threat === 'MEDIUM' ? 'var(--c-warning)' : 'var(--c-ok)';
  }
}

function updateOmegaTitle() {} // no longer used — kept for compatibility

/* ============================================
   RANDOM GLITCH FLICKERS
   ============================================ */
function setupRandomGlitch() {
  setInterval(() => {
    if (Math.random() < 0.05 + STATE.omegaVisits * 0.02) {
      const el = $('main-content');
      if (!el) return;
      el.classList.add('glitch-flicker');
      setTimeout(() => el.classList.remove('glitch-flicker'), 100);
    }
  }, 3000);
}

/* ============================================
   RESTORE UI STATE FROM STORAGE
   ============================================ */
function restoreUIState() {
  if (STATE.securityToggle) $('toggle-security').checked = true;
  if (STATE.freedomToggle)  $('toggle-freedom').checked  = true;
  if (STATE.stabilityToggle)$('toggle-stability').checked= true;

  $('slider-surveillance').value = STATE.surveillanceWeight;
  $('val-surveillance').textContent = STATE.surveillanceWeight;
  $('slider-freedom').value = STATE.freedomIndex;
  $('val-freedom').textContent = STATE.freedomIndex;
  $('slider-trust').value = STATE.publicTrust;
  $('val-trust').textContent = STATE.publicTrust;
  $('slider-suppression').value = STATE.suppressionThreshold;
  $('val-suppression').textContent = STATE.suppressionThreshold;

  document.body.setAttribute('data-bias', STATE.bias);
  const needle = $('bias-needle');
  if (needle) needle.style.left = STATE.biasScore + '%';

  if (STATE.narrativeControl) {
    $('toggle-narrative').checked = true;
    $('status-narrative').textContent = 'ACTIVE';
    $('status-narrative').className   = 'filter-status active';
  }
  if (STATE.infoSuppression) {
    $('toggle-suppression').checked = true;
    $('status-suppression').textContent = 'ACTIVE — STREAMS FILTERED';
    $('status-suppression').className   = 'filter-status active';
  }
  if (STATE.emotionDampening) {
    $('toggle-emotion').checked = true;
    $('status-emotion').textContent = 'ACTIVE — SIGNALS DAMPENED';
    $('status-emotion').className   = 'filter-status active';
  }

  if (STATE.protocolUnlocked) {
    $('proto-gate').classList.add('hidden');
    $('proto-tree-wrap').classList.remove('hidden');
    initProtocolTree();
  }

  checkPDMActivation();
  if (STATE.narrativeControl) applyLayoutShift(true);
  updateGovernanceUI();
}

/* ============================================
   ENTRY POINT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
});
