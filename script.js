/* ==========================================================================
   BITPULSE — Minigame Interativo de Arquitetura Computacional
   16 componentes · 32 cenários reais · 3 modos de jogo · Bootstrap 5 + Web Audio
   ========================================================================== */

const SECTORS = {
  cpu: { name: "NÚCLEO & PROCESSAMENTO", color: "#38bdf8" },
  memory: { name: "MEMÓRIAS & ARMAZENAMENTO", color: "#34d399" },
  bus: { name: "BARRAMENTOS & FLUXO", color: "#fbbf24" },
  embedded: { name: "SISTEMAS EMBARCADOS", color: "#a78bfa" }
};

// Os 16 termos oficiais da disciplina, cada um com 2 cenários práticos distintos,
// explicação direta, analogia do dia a dia e dica "não confunda!"
const CHIPS = [
  // ---------- PROCESSAMENTO (6) ----------
  {
    id: "cpu",
    name: "CPU",
    shortTag: "Cérebro central",
    sector: "cpu",
    description: "Unidade central que busca, decodifica e executa as instruções dos programas.",
    analogy: "É o cérebro humano recebendo estímulos, processando decisões e comandando o resto do corpo.",
    trap: "A CPU é o conjunto completo (UC + ULA + Registradores). Não confunda com um bloco isolado dentro dela.",
    scenarios: [
      "Um programa foi aberto e a máquina precisa buscar, decodificar e executar o ciclo principal de instruções. Quem é o cérebro central?",
      "Qual componente principal concentra internamente a Unidade de Controle, a ULA e os registradores?"
    ]
  },
  {
    id: "uc",
    name: "UC",
    shortTag: "Maestro interno",
    sector: "cpu",
    description: "Unidade de Controle: coordena o ciclo de instruções e sincroniza os circuitos internos.",
    analogy: "É o maestro da orquestra: não toca instrumentos nem faz contas, mas diz quem trabalha em cada pulso.",
    trap: "UC coordena e decodifica; quem faz contas matemáticas e lógica é a ULA!",
    scenarios: [
      "Precisamos decodificar a instrução atual e enviar sinais de controle sincronizados para os outros blocos do processador. Quem age?",
      "Quem coordena o ritmo de execução dentro do processador sem executar cálculos aritméticos?"
    ]
  },
  {
    id: "ula",
    name: "ULA",
    shortTag: "Contas & lógica",
    sector: "cpu",
    description: "Unidade Lógica e Aritmética: realiza cálculos matemáticos e comparações booleanas.",
    analogy: "É a calculadora científica embutida dentro do processador.",
    trap: "Se o chamado falar em soma, subtração, AND/OR ou comparação (maior/menor), é sempre ULA!",
    scenarios: [
      "O código precisa somar dois valores binários e testar se A é maior que B. Qual circuito interno faz contas e lógica?",
      "Operação booleana AND seguida de subtração solicitada! Qual bloco interno do processador executa isso?"
    ]
  },
  {
    id: "registradores",
    name: "REGISTRADORES",
    shortTag: "Topo da velocidade",
    sector: "cpu",
    description: "Pequenas células ultrarrápidas dentro do processador que guardam dados durante operações imediatas.",
    analogy: "São como as duas mãos do cozinheiro segurando os ingredientes exatamente no segundo em que ele cozinha.",
    trap: "Mais rápidos e menores que a Cache! Ficam literalmente dentro do núcleo do processador.",
    scenarios: [
      "A ULA precisa segurar dois operandos por nanossegundos dentro do próprio processador durante um cálculo. Onde ficam?",
      "Qual memória ocupa o topo absoluto da hierarquia — menor capacidade, porém a maior velocidade do PC?"
    ]
  },
  {
    id: "dualcore",
    name: "DUAL CORE",
    shortTag: "2 núcleos físicos",
    sector: "cpu",
    description: "Processador que possui dois núcleos independentes integrados no mesmo chip físico.",
    analogy: "É como uma cozinha com 2 chefs preparando dois pratos diferentes ao mesmo tempo.",
    trap: "Dual = 2 núcleos; Quad = 4 núcleos no mesmo chip.",
    scenarios: [
      "Precisamos rodar duas tarefas pesadas em paralelo usando um processador com exatamente 2 núcleos físicos no mesmo chip!",
      "Qual arquitetura multinúcleo integra dois núcleos independentes trabalhando lado a lado em um único encapsulamento?"
    ]
  },
  {
    id: "quadcore",
    name: "QUAD CORE",
    shortTag: "4 núcleos físicos",
    sector: "cpu",
    description: "Processador que possui quatro núcleos independentes integrados no mesmo chip físico.",
    analogy: "É como abrir 4 caixas de supermercado ao mesmo tempo para atender quatro filas em paralelo.",
    trap: "Quad = 4 núcleos físicos independentes (dobro de um Dual Core).",
    scenarios: [
      "Renderização de vídeo exige 4 núcleos físicos independentes dividindo a carga simultaneamente no mesmo processador!",
      "Qual arquitetura multinúcleo reúne quatro núcleos completos de processamento no mesmo chip?"
    ]
  },

  // ---------- MEMÓRIAS & ARMAZENAMENTO (6) ----------
  {
    id: "cache",
    name: "CACHE",
    shortTag: "Atalho L1/L2/L3",
    sector: "memory",
    description: "Memória intermediária ultrarrápida entre o processador e a RAM que reduz tempo de espera.",
    analogy: "É deixar os cadernos que você mais usa em cima da mesa para não precisar levantar até o armário toda hora.",
    trap: "Fica entre os Registradores e a RAM. Serve para acelerar o acesso aos dados repetidos com frequência.",
    scenarios: [
      "O processador está perdendo ciclos esperando a RAM responder! Qual memória intermediária (L1/L2/L3) guarda cópias frequentes?",
      "Qual memória ultrarrápida fica entre o processador e a memória principal justamente para evitar gargalos de velocidade?"
    ]
  },
  {
    id: "ram",
    name: "RAM",
    shortTag: "Principal volátil",
    sector: "memory",
    description: "Memória principal volátil que mantém aplicativos e arquivos ativos enquanto há energia elétrica.",
    analogy: "É a sua mesa de trabalho: quanto maior, mais projetos abertos ao mesmo tempo — mas limpa tudo se a luz acabar.",
    trap: "Palavra-chave: VOLÁTIL (perde tudo sem energia). Se guardar pra sempre sem energia, não é RAM!",
    scenarios: [
      "QUEDA DE ENERGIA! Qual memória principal volátil perde instantaneamente todos os apps abertos quando o PC desliga?",
      "Você abriu navegador, editor de código e música ao mesmo tempo. Qual memória principal guarda tudo que está em execução agora?"
    ]
  },
  {
    id: "rom",
    name: "ROM",
    shortTag: "Gravada de fábrica",
    sector: "memory",
    description: "Memória não volátil gravada de fábrica que guarda instruções essenciais de inicialização (boot).",
    analogy: "É um livro impresso de fábrica: você lê sempre que precisa iniciar a máquina, sem apagar no dia a dia.",
    trap: "ROM é não volátil voltada à leitura de boot/firmware fixo; RAM é volátil de leitura e escrita constante.",
    scenarios: [
      "O computador acabou de ser ligado e precisa ler as instruções fixas de fábrica para dar boot no hardware. Onde estão?",
      "Qual memória não volátil é voltada principalmente para leitura de instruções essenciais gravadas de fábrica?"
    ]
  },
  {
    id: "eeprom",
    name: "EEPROM",
    shortTag: "Regrava byte a byte",
    sector: "memory",
    description: "Memória não volátil apagada e regravada eletricamente com precisão, byte a byte.",
    analogy: "É um caderno onde você consegue apagar e corrigir uma única letra com precisão sem apagar a folha inteira.",
    trap: "EEPROM apaga/regrava BYTE A BYTE eletricamente; FLASH apaga em BLOCOS inteiros!",
    scenarios: [
      "Precisamos corrigir eletricamente apenas 1 único byte de configuração permanente sem perder os dados ao desligar. Qual chip usar?",
      "Qual memória não volátil permite apagamento e regravação elétrica byte a byte (diferente da que apaga em blocos)?"
    ]
  },
  {
    id: "flash",
    name: "FLASH",
    shortTag: "Blocos · SSD/USB",
    sector: "memory",
    description: "Memória não volátil apagada e regravada em blocos, muito usada em pendrives, cartões SD e SSDs.",
    analogy: "É um quadro branco dividido em setores: apaga um bloco inteiro de uma vez para reescrever muito mais rápido.",
    trap: "Falou em apagamento em BLOCOS, pendrive, cartão de memória ou tecnologia interna de SSD? É FLASH!",
    scenarios: [
      "Um pendrive e um cartão SD precisam manter dados sem energia e apagar setores em blocos rapidamente. Qual memória usam?",
      "Qual tecnologia de memória não volátil apaga em blocos e equipa pendrives, celulares e SSDs modernos?"
    ]
  },
  {
    id: "massa",
    name: "MEMÓRIA DE MASSA",
    shortTag: "HDs & SSDs",
    sector: "memory",
    description: "Armazenamento secundário permanente de alta capacidade, como discos rígidos (HDs) e SSDs.",
    analogy: "É o galpão ou biblioteca inteira: guarda gigabytes e terabytes de arquivos para sempre, mesmo desligado.",
    trap: "É a categoria geral de armazenamento secundário permanente de grande volume (HD/SSD), fora da memória principal.",
    scenarios: [
      "Você precisa guardar 500 GB de vídeos, jogos e o sistema operacional de forma permanente. Para qual armazenamento secundário enviar?",
      "Qual categoria de armazenamento permanente de altíssima capacidade engloba HDs e SSDs fora da memória principal?"
    ]
  },

  // ---------- BARRAMENTOS & FLUXO (3) ----------
  {
    id: "addressbus",
    name: "ADDRESS BUS",
    shortTag: "Via de localizações",
    sector: "bus",
    description: "Barramento unidirecional que envia localizações exatas da memória onde ler ou gravar informações.",
    analogy: "É o CEP e número da casa no envelope: só indica o destino exato, sempre saindo do remetente (unidirecional).",
    trap: "Address Bus = UNIDIRECIONAL (leva a posição/endereço). Data Bus = BIDIRECIONAL (leva os dados em si).",
    scenarios: [
      "A CPU precisa informar a localização exata na memória onde quer ler um dado. Por qual via unidirecional ela envia isso?",
      "Qual barramento trafega em mão única e define o limite máximo de posições de memória que a CPU consegue enxergar?"
    ]
  },
  {
    id: "databus",
    name: "DATA BUS",
    shortTag: "Via bidirecional",
    sector: "bus",
    description: "Barramento bidirecional que transporta os bits de informações e instruções entre CPU, memória e periféricos.",
    analogy: "É a rodovia de mão dupla por onde os caminhões levando a carga (os bits) vão e voltam.",
    trap: "Se o chamado fala em via BIDIRECIONAL transportando os próprios bits/dados (ida e volta), é DATA BUS!",
    scenarios: [
      "Os 64 bits lidos da memória precisam viajar até a CPU e, depois, os resultados voltam para gravação. Qual via bidirecional faz isso?",
      "Qual barramento de mão dupla transporta efetivamente os bits de informações entre processador, memória e periféricos?"
    ]
  },
  {
    id: "dma",
    name: "DMA",
    shortTag: "Sem travar a CPU",
    sector: "bus",
    description: "Acesso Direto à Memória: permite periféricos transferirem grandes dados para a RAM sem ocupar a CPU.",
    analogy: "É um motoboy que descarrega caixas direto no estoque sem precisar interromper o gerente a cada caixa.",
    trap: "Palavra-chave: periférico transfere dados direto para a memória SEM ocupar o processador!",
    scenarios: [
      "A placa de rede e o disco precisam mover 2 GB direto para a RAM sem travar a CPU! Qual mecanismo ativar?",
      "Qual recurso libera o processador permitindo que periféricos transfiram blocos de dados direto com a memória?"
    ]
  },

  // ---------- SISTEMAS EMBARCADOS (1) ----------
  {
    id: "microcontrolador",
    name: "MICROCONTROLADOR",
    shortTag: "Tudo em 1 chip",
    sector: "embedded",
    description: "Chip único que integra processador, memória e periféricos de E/S para sistemas embarcados como Arduino.",
    analogy: "É um canivete suíço eletrônico: um único chip já traz cérebro, memória e portas de sensores prontos.",
    trap: "Diferente de uma CPU comum de PC, ele já vem com memória e pinos de entrada/saída integrados no mesmo chip!",
    scenarios: [
      "Vamos automatizar uma estufa com Arduino usando um chip único que já integra processador, memória e portas de E/S!",
      "Qual circuito integrado completo reúne CPU, memória e periféricos em um só chip para automação e sistemas embarcados?"
    ]
  }
];

const CHIP_MAP = Object.fromEntries(CHIPS.map((c) => [c.id, c]));
const HIGHSCORE_KEY = "bitpulse_highscore_v1";

function safeGetHighScore() {
  try {
    return Number(localStorage.getItem(HIGHSCORE_KEY) || 0);
  } catch {
    return 0;
  }
}

function safeSaveHighScore(value) {
  try {
    localStorage.setItem(HIGHSCORE_KEY, String(value));
  } catch {
    // Ignora caso localStorage esteja indisponível
  }
}

// ==========================================================================
// Estado do Minigame
// ==========================================================================
const state = {
  mode: "campaign", // "campaign" | "training" | "overclock"
  lives: 3,
  score: 0,
  combo: 0,
  bestCombo: 1,
  hits: 0,
  attempts: 0,
  roundNumber: 0,
  hintCharges: 3,
  soundEnabled: true,
  highScore: safeGetHighScore(),

  mastery: Object.fromEntries(CHIPS.map((c) => [c.id, new Set()])),
  campaignQueue: [],
  missedCounts: {},

  currentMission: null,
  paused: false,
  gameOver: false,
  activeModal: null, // null | "error" | "lab" | "end"
  nextMissionTimeout: null,
  sessionId: 0,
  hintUsedThisRound: false,
  pendingNextMission: false,
  returnToEndModal: false,

  timeLimit: 40,
  timeLeft: 40,
  lastFrameTime: 0,
  rafId: null
};

// Elementos do DOM
const dom = {
  canvas: document.getElementById("fx-canvas"),
  lives: document.getElementById("hud-lives"),
  score: document.getElementById("hud-score"),
  combo: document.getElementById("hud-combo"),
  mastery: document.getElementById("hud-mastery"),
  masteryFill: document.getElementById("mastery-fill"),
  highscore: document.getElementById("hud-highscore"),
  missionConsole: document.getElementById("mission-console"),
  missionBadge: document.getElementById("mission-badge"),
  sectorHintPill: document.getElementById("mission-sector-hint"),
  missionPrompt: document.getElementById("mission-prompt"),
  timerText: document.getElementById("timer-text"),
  timerTrack: document.getElementById("timer-track"),
  timerFill: document.getElementById("timer-fill"),
  quickFeedback: document.getElementById("quick-feedback"),
  btnHint: document.getElementById("btn-hint"),
  hintCharges: document.getElementById("hint-charges"),
  btnRestart: document.getElementById("btn-restart"),
  btnLab: document.getElementById("btn-lab"),
  btnSound: document.getElementById("btn-sound"),
  zones: {
    cpu: document.getElementById("zone-cpu"),
    memory: document.getElementById("zone-memory"),
    bus: document.getElementById("zone-bus"),
    embedded: document.getElementById("zone-embedded")
  },
  // Modais Bootstrap
  errorModal: document.getElementById("error-modal"),
  errorRibbon: document.getElementById("error-ribbon"),
  errorTitle: document.getElementById("error-title"),
  comparePickedBox: document.getElementById("compare-picked-box"),
  errorPicked: document.getElementById("error-picked"),
  errorPickedDesc: document.getElementById("error-picked-desc"),
  errorCorrect: document.getElementById("error-correct"),
  errorCorrectDesc: document.getElementById("error-correct-desc"),
  errorTip: document.getElementById("error-tip"),
  btnErrorNext: document.getElementById("btn-error-next"),

  labModal: document.getElementById("lab-modal"),
  labFilters: document.getElementById("lab-filters"),
  labGrid: document.getElementById("lab-grid"),
  btnCloseLab: document.getElementById("btn-close-lab"),

  endModal: document.getElementById("end-modal"),
  endBadge: document.getElementById("end-badge"),
  endTitle: document.getElementById("end-title"),
  endSubtitle: document.getElementById("end-subtitle"),
  endScore: document.getElementById("end-score"),
  endAccuracy: document.getElementById("end-accuracy"),
  endCombo: document.getElementById("end-combo"),
  endMastered: document.getElementById("end-mastered"),
  endReviewBox: document.getElementById("end-review-box"),
  endMissedList: document.getElementById("end-missed-list"),
  btnEndReplay: document.getElementById("btn-end-replay"),
  btnEndLab: document.getElementById("btn-end-lab")
};

// ==========================================================================
// Integração Segura com Bootstrap 5 Modals (com fallback offline)
// ==========================================================================
const modalControllers = new WeakMap();

function hasBootstrapModal() {
  return Boolean(window.bootstrap && window.bootstrap.Modal);
}

function getBsModal(el) {
  if (!hasBootstrapModal()) return null;
  return window.bootstrap.Modal.getOrCreateInstance(el);
}

function getModalController(el) {
  let ctrl = modalControllers.get(el);
  if (!ctrl) {
    ctrl = { state: "hidden", desired: "hidden", onHidden: null };
    modalControllers.set(el, ctrl);
  }
  return ctrl;
}

function blurIfFocusedInside(el) {
  if (document.activeElement && el.contains(document.activeElement)) {
    document.activeElement.blur();
  }
}

function trackBootstrapModalState(el) {
  const ctrl = getModalController(el);

  el.addEventListener("show.bs.modal", () => {
    ctrl.state = "showing";
  });

  el.addEventListener("shown.bs.modal", () => {
    ctrl.state = "shown";
    if (ctrl.desired === "hidden") {
      setTimeout(() => {
        if (ctrl.desired === "hidden" && ctrl.state === "shown") {
          blurIfFocusedInside(el);
          getBsModal(el)?.hide();
        }
      }, 0);
    }
  });

  el.addEventListener("hide.bs.modal", () => {
    ctrl.state = "hiding";
    ctrl.desired = "hidden";
    blurIfFocusedInside(el);
  });

  el.addEventListener("hidden.bs.modal", () => {
    ctrl.state = "hidden";
    const cb = ctrl.onHidden;
    ctrl.onHidden = null;
    if (cb) cb();

    if (ctrl.desired === "shown") {
      setTimeout(() => {
        if (ctrl.desired === "shown" && ctrl.state === "hidden") {
          getBsModal(el)?.show();
        }
      }, 0);
    }
  });
}

function showModal(el) {
  const ctrl = getModalController(el);
  ctrl.desired = "shown";
  ctrl.onHidden = null;

  const instance = getBsModal(el);
  if (instance) {
    if (ctrl.state === "hidden") {
      instance.show();
    }
  } else {
    ctrl.state = "shown";
    el.classList.add("show", "fallback-open");
    el.removeAttribute("aria-hidden");
    el.setAttribute("aria-modal", "true");
  }
}

function hideModal(el, onHidden = null) {
  const ctrl = getModalController(el);
  ctrl.desired = "hidden";
  ctrl.onHidden = onHidden;

  const instance = getBsModal(el);
  if (instance) {
    if (ctrl.state === "shown") {
      blurIfFocusedInside(el);
      instance.hide();
    } else if (ctrl.state === "hidden") {
      const cb = ctrl.onHidden;
      ctrl.onHidden = null;
      if (cb) cb();
    }
  } else {
    blurIfFocusedInside(el);
    ctrl.state = "hidden";
    el.classList.remove("show", "fallback-open");
    el.setAttribute("aria-hidden", "true");
    el.removeAttribute("aria-modal");
    const cb = ctrl.onHidden;
    ctrl.onHidden = null;
    if (cb) cb();
  }
}

// ==========================================================================
// Efeitos Visuais Discretos em Canvas (Apenas sob demanda ao clicar/vencer)
// ==========================================================================
const fx = {
  ctx: dom.canvas.getContext("2d"),
  particles: [],
  running: false
};

function resizeCanvas() {
  dom.canvas.width = window.innerWidth;
  dom.canvas.height = window.innerHeight;
}

function spawnBurst(x, y, color, count = 16) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
    const speed = 1.6 + Math.random() * 3.8;
    fx.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.028 + Math.random() * 0.02,
      size: 1.8 + Math.random() * 2.6,
      color
    });
  }

  if (!fx.running) {
    fx.running = true;
    requestAnimationFrame(renderFxLoop);
  }
}

function renderFxLoop() {
  const ctx = fx.ctx;
  ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

  for (let i = fx.particles.length - 1; i >= 0; i--) {
    const p = fx.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.life -= p.decay;
    if (p.life <= 0) {
      fx.particles.splice(i, 1);
      continue;
    }
    ctx.globalAlpha = p.life * 0.85;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  if (fx.particles.length > 0) {
    requestAnimationFrame(renderFxLoop);
  } else {
    fx.running = false;
  }
}

// ==========================================================================
// Sintetizador Arcade (Web Audio API — zero arquivos externos)
// ==========================================================================
let audioCtx = null;

function playTone(freq, duration = 0.08, type = "sine", vol = 0.05) {
  if (!state.soundEnabled) return;
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Ignora caso o navegador bloqueie áudio
  }
}

function playSound(kind) {
  if (kind === "hit") {
    const base = 440 + Math.min(state.combo, 8) * 55;
    playTone(base, 0.08, "triangle", 0.06);
    setTimeout(() => playTone(base * 1.25, 0.12, "sine", 0.06), 55);
  } else if (kind === "miss") {
    playTone(185, 0.16, "sawtooth", 0.05);
    setTimeout(() => playTone(130, 0.2, "sawtooth", 0.05), 110);
  } else if (kind === "hint") {
    playTone(720, 0.09, "sine", 0.045);
  } else if (kind === "win") {
    [523.25, 659.25, 783.99, 1046.5].forEach((n, idx) => {
      setTimeout(() => playTone(n, 0.18, "triangle", 0.07), idx * 95);
    });
  }
}

// ==========================================================================
// Renderização da Placa-Mãe e HUD
// ==========================================================================
function renderMotherboard() {
  Object.values(dom.zones).forEach((el) => (el.innerHTML = ""));

  let busIdx = 0;
  CHIPS.forEach((chip) => {
    const col = document.createElement("div");
    if (chip.sector === "bus") {
      col.className = busIdx < 2 ? "col-6 col-sm-4" : "col-12 col-sm-4";
      busIdx += 1;
    } else {
      col.className = "col";
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip-btn";
    btn.dataset.chipId = chip.id;

    btn.innerHTML = `
      <span class="chip-leds" aria-label="Maestria do chip">
        <i class="led"></i>
        <i class="led"></i>
      </span>
      <span class="chip-name">${chip.name}</span>
      <span class="chip-tag">${chip.shortTag}</span>
    `;

    btn.addEventListener("click", (e) => handleChipClick(chip.id, btn, e));
    col.appendChild(btn);
    dom.zones[chip.sector].appendChild(col);
  });

  updateChipMasteryVisuals();
}

function updateChipMasteryVisuals() {
  let masteredChips = 0;

  CHIPS.forEach((chip) => {
    const count = state.mastery[chip.id].size;
    if (count >= 1) masteredChips += 1;

    const btn = document.querySelector(`.chip-btn[data-chip-id="${chip.id}"]`);
    if (!btn) return;
    const leds = btn.querySelectorAll(".led");
    leds[0].classList.toggle("is-on", count >= 1);
    leds[1].classList.toggle("is-on", count >= 2);
    btn.classList.toggle("is-mastered", count >= 2);
  });

  dom.mastery.textContent = `${masteredChips}/${CHIPS.length}`;
  dom.masteryFill.style.width = `${Math.round((masteredChips / CHIPS.length) * 100)}%`;
}

function updateHud() {
  if (state.mode === "training") {
    dom.lives.innerHTML = `<span class="life-infinite"><i class="bi bi-infinity"></i></span>`;
    dom.lives.setAttribute("aria-label", "Vidas infinitas no modo treino");
  } else {
    const livesHtml = Array.from({ length: 3 }, (_, idx) => {
      const active = idx < state.lives;
      return `<i class="bi ${active ? "bi-lightning-charge-fill life-dot is-active" : "bi-lightning-charge life-dot is-burned"}" aria-hidden="true"></i>`;
    }).join("");
    dom.lives.innerHTML = livesHtml;
    dom.lives.setAttribute("aria-label", `${Math.max(0, state.lives)} de 3 fusíveis restantes`);
  }

  dom.score.textContent = state.score;
  dom.highscore.textContent = state.highScore;

  const mult = Math.min(5, 1 + Math.floor(state.combo / 2));
  if (state.combo >= 2) {
    dom.combo.hidden = false;
    dom.combo.textContent = `x${mult}`;
  } else {
    dom.combo.hidden = true;
  }

  dom.hintCharges.textContent = state.mode === "training" ? "∞" : state.hintCharges;
  dom.btnHint.classList.toggle("is-used", state.hintUsedThisRound);
  dom.btnHint.disabled =
    state.hintUsedThisRound || (state.mode !== "training" && state.hintCharges <= 0);
  dom.btnHint.title = state.hintUsedThisRound
    ? "Setor já destacado para este chamado"
    : "Destacar o setor correto na placa-mãe";

  updateChipMasteryVisuals();
}

function clearSectorHints() {
  document.querySelectorAll(".zone").forEach((z) => {
    z.classList.remove("is-hinted", "is-dimmed");
  });
  dom.sectorHintPill.hidden = true;
}

// ==========================================================================
// Geração de Missões e Fluxo de Jogo
// ==========================================================================
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickNextMission() {
  clearSectorHints();
  state.hintUsedThisRound = false;
  state.pendingNextMission = false;

  let chosenChip = null;

  if (state.mode === "campaign") {
    if (state.campaignQueue.length === 0) {
      finishGame(true);
      return;
    }
    const nextId = state.campaignQueue.shift();
    chosenChip = CHIP_MAP[nextId];
  } else {
    const prevId = state.currentMission ? state.currentMission.chip.id : null;
    const pool = CHIPS.filter((c) => c.id !== prevId);
    const unmastered = pool.filter((c) => state.mastery[c.id].size < 2);
    const source = unmastered.length > 0 && Math.random() < 0.78 ? unmastered : pool;
    chosenChip = source[Math.floor(Math.random() * source.length)];
  }

  const solvedSet = state.mastery[chosenChip.id];
  const unseenIndexes = chosenChip.scenarios
    .map((_, idx) => idx)
    .filter((idx) => !solvedSet.has(idx));
  const scenarioIndex =
    unseenIndexes.length > 0
      ? unseenIndexes[Math.floor(Math.random() * unseenIndexes.length)]
      : Math.floor(Math.random() * chosenChip.scenarios.length);

  state.roundNumber += 1;
  state.currentMission = {
    chip: chosenChip,
    scenarioIndex,
    prompt: chosenChip.scenarios[scenarioIndex]
  };

  dom.timerFill.classList.remove("is-warn", "is-danger");
  dom.timerText.classList.remove("is-low");
  dom.timerFill.style.width = "100%";
  dom.timerTrack?.setAttribute("aria-valuenow", "100");

  if (state.mode === "training") {
    state.timeLimit = 0;
    state.timeLeft = 0;
    dom.timerText.textContent = "LIVRE";
  } else if (state.mode === "campaign") {
    state.timeLimit = 40;
    state.timeLeft = 40;
    dom.timerText.textContent = "40.0s";
  } else {
    const speedUp = Math.min(25, Math.floor(state.hits / 3) * 2.5);
    state.timeLimit = Math.max(15, 40 - speedUp);
    state.timeLeft = state.timeLimit;
    dom.timerText.textContent = `${state.timeLeft.toFixed(1)}s`;
  }

  const remainingLabel =
    state.mode === "campaign"
      ? `CHAMADO #${state.roundNumber} · FALTAM ${state.campaignQueue.length + 1}`
      : `CHAMADO #${state.roundNumber} · ${state.mode === "overclock" ? "OVERCLOCK" : "TREINO"}`;

  dom.missionBadge.textContent = remainingLabel;
  dom.missionPrompt.textContent = state.currentMission.prompt;

  updateHud();
  state.paused = false;
  state.lastFrameTime = performance.now();
}

function handleChipClick(chipId, btnEl) {
  if (state.paused || state.gameOver || !state.currentMission) return;

  const targetChip = state.currentMission.chip;
  const rect = btnEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  state.attempts += 1;

  if (chipId === targetChip.id) {
    state.hits += 1;
    state.combo += 1;
    if (state.combo > state.bestCombo) state.bestCombo = state.combo;

    const mult = Math.min(5, 1 + Math.floor(state.combo / 2));
    const speedBonus = state.mode === "training" ? 0 : Math.round(state.timeLeft * 8);
    const gained = (100 + speedBonus) * mult;
    state.score += gained;

    if (state.score > state.highScore) {
      state.highScore = state.score;
      safeSaveHighScore(state.highScore);
    }

    state.mastery[targetChip.id].add(state.currentMission.scenarioIndex);

    playSound("hit");
    spawnBurst(cx, cy, SECTORS[targetChip.sector].color, 18);
    btnEl.classList.add("flash-correct");
    dom.missionConsole.classList.add("is-hit");

    dom.quickFeedback.className = "quick-feedback is-good";
    dom.quickFeedback.textContent = `✓ +${gained} pts · ${targetChip.name}: ${targetChip.description}`;

    updateHud();
    state.paused = true;
    state.pendingNextMission = true;

    const sessionId = state.sessionId;
    clearTimeout(state.nextMissionTimeout);
    state.nextMissionTimeout = setTimeout(() => {
      state.nextMissionTimeout = null;
      btnEl.classList.remove("flash-correct");
      dom.missionConsole.classList.remove("is-hit");
      if (sessionId !== state.sessionId || state.gameOver || state.activeModal !== null) return;
      state.pendingNextMission = false;
      pickNextMission();
    }, 520);
  } else {
    handleMistake(CHIP_MAP[chipId], btnEl, cx, cy, false);
  }
}

function handleMistake(pickedChip, btnEl, cx, cy, isTimeout) {
  const targetChip = state.currentMission.chip;
  state.paused = true;
  state.combo = 0;

  if (state.mode !== "training") {
    state.lives -= 1;
  }

  state.missedCounts[targetChip.id] = (state.missedCounts[targetChip.id] || 0) + 1;

  if (state.mode === "campaign" && !state.campaignQueue.includes(targetChip.id)) {
    state.campaignQueue.push(targetChip.id);
  }

  playSound("miss");
  if (cx && cy) spawnBurst(cx, cy, "#fb7185", 16);
  if (btnEl) {
    btnEl.classList.add("flash-wrong");
    setTimeout(() => btnEl.classList.remove("flash-wrong"), 400);
  }

  dom.missionConsole.classList.add("is-miss");
  setTimeout(() => dom.missionConsole.classList.remove("is-miss"), 380);

  const correctBtn = document.querySelector(`.chip-btn[data-chip-id="${targetChip.id}"]`);
  if (correctBtn) correctBtn.classList.add("pulse-target");

  updateHud();
  openErrorModal(pickedChip, targetChip, isTimeout);
}

function openErrorModal(pickedChip, targetChip, isTimeout) {
  dom.errorRibbon.textContent = isTimeout
    ? "TEMPO ESGOTADO · FUSÍVEL QUEIMADO"
    : "CURTO-CIRCUITO DETECTADO";

  dom.errorTitle.textContent = isTimeout
    ? "O sistema travou antes da resposta. Veja o chip certo:"
    : "Quase lá! Compare o chip clicado com o correto:";

  if (isTimeout || !pickedChip) {
    dom.errorPicked.textContent = "TEMPO ESGOTADO";
    dom.errorPickedDesc.textContent = "Nenhum chip foi ativado antes de a barra de clock zerar.";
  } else {
    dom.errorPicked.textContent = pickedChip.name;
    dom.errorPickedDesc.textContent = pickedChip.description;
  }

  dom.errorCorrect.textContent = targetChip.name;
  dom.errorCorrectDesc.textContent = targetChip.description;
  dom.errorTip.textContent = `${targetChip.trap} Analogia: ${targetChip.analogy}`;

  dom.btnErrorNext.textContent =
    state.mode !== "training" && state.lives <= 0
      ? "Ver Relatório do Turno →"
      : "Entendi! Próximo Chamado →";

  state.activeModal = "error";
  showModal(dom.errorModal);
}

function closeErrorModalAndContinue() {
  if (state.activeModal !== "error") return;
  state.activeModal = null;

  document.querySelectorAll(".chip-btn.pulse-target").forEach((el) => {
    el.classList.remove("pulse-target");
  });

  const sessionId = state.sessionId;
  const shouldFinish = state.mode !== "training" && state.lives <= 0;
  hideModal(dom.errorModal, () => {
    if (sessionId !== state.sessionId) return;
    if (shouldFinish) {
      finishGame(false);
    } else if (!state.gameOver) {
      pickNextMission();
    }
  });
}

function useSectorHint() {
  if (!state.currentMission || state.paused || state.gameOver || state.hintUsedThisRound) return;
  if (state.mode !== "training" && state.hintCharges <= 0) return;

  state.hintUsedThisRound = true;
  if (state.mode !== "training") {
    state.hintCharges -= 1;
  }

  const targetSector = state.currentMission.chip.sector;
  playSound("hint");

  document.querySelectorAll(".zone").forEach((zoneEl) => {
    const isTarget = zoneEl.dataset.sector === targetSector;
    zoneEl.classList.toggle("is-hinted", isTarget);
    zoneEl.classList.toggle("is-dimmed", !isTarget);
  });

  dom.sectorHintPill.hidden = false;
  dom.sectorHintPill.textContent = `SETOR: ${SECTORS[targetSector].name}`;
  updateHud();
}

// ==========================================================================
// Loop do Timer (requestAnimationFrame para barra ultra-suave)
// ==========================================================================
function tickTimer(now) {
  if (!state.paused && !state.gameOver && state.mode !== "training" && state.timeLimit > 0) {
    const dt = (now - state.lastFrameTime) / 1000;
    state.lastFrameTime = now;
    state.timeLeft = Math.max(0, state.timeLeft - dt);

    const pct = (state.timeLeft / state.timeLimit) * 100;
    dom.timerFill.style.width = `${pct}%`;
    dom.timerTrack?.setAttribute("aria-valuenow", String(Math.round(pct)));
    dom.timerText.textContent = `${state.timeLeft.toFixed(1)}s`;

    dom.timerFill.classList.toggle("is-warn", pct <= 50 && pct > 25);
    dom.timerFill.classList.toggle("is-danger", pct <= 25);
    dom.timerText.classList.toggle("is-low", pct <= 25);

    if (state.timeLeft <= 0) {
      state.attempts += 1;
      handleMistake(null, null, null, null, true);
    }
  } else {
    state.lastFrameTime = now;
  }

  state.rafId = requestAnimationFrame(tickTimer);
}

// ==========================================================================
// Fim de Turno & Laboratório dos 16 Chips
// ==========================================================================
function finishGame(victory) {
  state.gameOver = true;
  state.paused = true;

  if (victory) {
    playSound("win");
    spawnBurst(window.innerWidth * 0.32, window.innerHeight * 0.35, "#34d399", 22);
    spawnBurst(window.innerWidth * 0.68, window.innerHeight * 0.35, "#38bdf8", 22);
  }

  const accuracy = state.attempts > 0 ? Math.round((state.hits / state.attempts) * 100) : 0;
  const mastered = CHIPS.filter((c) => state.mastery[c.id].size >= 1).length;

  dom.endBadge.textContent = victory ? "PLANTÃO 100% CONCLUÍDO" : "FUSÍVEIS ESGOTADOS";
  dom.endTitle.textContent = victory
    ? "Placa-Mãe Totalmente Dominada!"
    : "Fim de Turno — Bom Treino!";
  dom.endSubtitle.textContent = victory
    ? "Você respondeu corretamente todos os 16 componentes da arquitetura computacional."
    : "Cada curto-circuito acelera seu raciocínio. Revise os chips abaixo e tente novamente.";

  dom.endScore.textContent = state.score;
  dom.endAccuracy.textContent = `${accuracy}%`;
  dom.endCombo.textContent = `x${Math.min(5, 1 + Math.floor(state.bestCombo / 2))}`;
  dom.endMastered.textContent = `${mastered}/16`;

  const missedIds = Object.keys(state.missedCounts);
  if (missedIds.length > 0) {
    dom.endReviewBox.hidden = false;
    dom.endMissedList.innerHTML = missedIds
      .map((id) => `<span class="missed-tag">${CHIP_MAP[id].name}</span>`)
      .join("");
  } else {
    dom.endReviewBox.hidden = true;
  }

  state.activeModal = "end";
  showModal(dom.endModal);
}

function renderLab(filter = "all") {
  dom.labGrid.innerHTML = "";
  const list = filter === "all" ? CHIPS : CHIPS.filter((c) => c.sector === filter);

  list.forEach((chip) => {
    const count = state.mastery[chip.id].size;
    const col = document.createElement("div");
    col.className = "col";

    const card = document.createElement("article");
    card.className = `lab-card h-100 ${count >= 2 ? "is-mastered" : ""}`;
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center gap-2">
        <div class="d-flex align-items-center gap-2">
          <span class="lab-sector-dot" style="background:${SECTORS[chip.sector].color}"></span>
          <span class="lab-card-title">${chip.name}</span>
        </div>
        <span class="lab-badge ${count >= 2 ? "is-done" : ""}">
          ${count >= 2 ? "★ 2/2" : `${count}/2`}
        </span>
      </div>
      <p class="lab-desc">${chip.description}</p>
      <p class="lab-analogy"><strong>Analogia:</strong> ${chip.analogy}</p>
      <p class="lab-trap"><strong>Não confunda:</strong> ${chip.trap}</p>
    `;
    col.appendChild(card);
    dom.labGrid.appendChild(col);
  });
}

function openLab() {
  if (state.activeModal === "error" || state.activeModal === "end") return;
  state.paused = true;
  state.activeModal = "lab";
  renderLab("all");
  dom.labFilters.querySelectorAll(".filter-pill").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === "all");
  });
  showModal(dom.labModal);
}

function closeLab() {
  if (state.activeModal !== "lab") return;
  hideModal(dom.labModal);
  if (!hasBootstrapModal()) {
    onLabHidden();
  }
}

function onLabHidden() {
  if (state.activeModal === "lab") {
    state.activeModal = null;
  }
  if (state.gameOver) {
    if (state.returnToEndModal) {
      state.returnToEndModal = false;
      state.activeModal = "end";
      showModal(dom.endModal);
    }
    return;
  }
  if (state.activeModal === null) {
    if (state.pendingNextMission) {
      state.pendingNextMission = false;
      clearTimeout(state.nextMissionTimeout);
      state.nextMissionTimeout = null;
      document.querySelectorAll(".chip-btn.flash-correct").forEach((el) => {
        el.classList.remove("flash-correct");
      });
      dom.missionConsole.classList.remove("is-hit");
      pickNextMission();
    } else {
      state.paused = false;
      state.lastFrameTime = performance.now();
    }
  }
}

// ==========================================================================
// Início / Troca de Modo e Eventos
// ==========================================================================
function startSession(mode = state.mode) {
  state.sessionId += 1;
  clearTimeout(state.nextMissionTimeout);
  state.nextMissionTimeout = null;

  state.mode = mode;
  state.lives = 3;
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 1;
  state.hits = 0;
  state.attempts = 0;
  state.roundNumber = 0;
  state.hintCharges = 3;
  state.hintUsedThisRound = false;
  state.pendingNextMission = false;
  state.returnToEndModal = false;
  state.missedCounts = {};
  state.gameOver = false;
  state.paused = false;
  state.activeModal = null;

  state.campaignQueue = shuffle(CHIPS.map((c) => c.id));

  document.querySelectorAll(".chip-btn.pulse-target, .chip-btn.flash-correct, .chip-btn.flash-wrong").forEach((el) => {
    el.classList.remove("pulse-target", "flash-correct", "flash-wrong");
  });
  dom.missionConsole.classList.remove("is-hit", "is-miss");

  hideModal(dom.errorModal);
  hideModal(dom.endModal);
  hideModal(dom.labModal);

  dom.quickFeedback.className = "quick-feedback";
  dom.quickFeedback.textContent =
    mode === "training"
      ? "Modo Treino: sem timer e com vidas infinitas. Explore a placa e domine os 16 chips."
      : mode === "overclock"
        ? "Modo Overclock: acerte em sequência para multiplicar pontos — o relógio acelera a cada 3 acertos."
        : "Modo Plantão: responda corretamente todos os 16 componentes sem queimar os 3 fusíveis.";

  document.querySelectorAll(".mode-tab").forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  updateHud();
  pickNextMission();
}

function bindEvents() {
  [dom.errorModal, dom.labModal, dom.endModal].forEach(trackBootstrapModalState);

  document.querySelectorAll(".mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => startSession(tab.dataset.mode));
  });

  dom.btnRestart.addEventListener("click", () => startSession(state.mode));
  dom.btnHint.addEventListener("click", useSectorHint);
  dom.btnErrorNext.addEventListener("click", closeErrorModalAndContinue);

  dom.btnLab.addEventListener("click", openLab);
  dom.btnCloseLab.addEventListener("click", closeLab);

  // Eventos nativos do Bootstrap Modal
  dom.errorModal.addEventListener("shown.bs.modal", () => {
    dom.btnErrorNext.focus();
  });

  dom.endModal.addEventListener("shown.bs.modal", () => {
    dom.btnEndReplay.focus();
  });

  dom.labModal.addEventListener("hidden.bs.modal", onLabHidden);

  // Fallback click-outside caso Bootstrap JS esteja indisponível
  dom.labModal.addEventListener("click", (e) => {
    if (!hasBootstrapModal() && e.target === dom.labModal) {
      closeLab();
    }
  });

  dom.labFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-pill");
    if (!btn) return;
    dom.labFilters.querySelectorAll(".filter-pill").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderLab(btn.dataset.filter);
  });

  dom.btnEndReplay.addEventListener("click", () => startSession(state.mode));
  dom.btnEndLab.addEventListener("click", () => {
    const sessionId = state.sessionId;
    state.returnToEndModal = true;
    state.activeModal = null;
    hideModal(dom.endModal, () => {
      if (sessionId !== state.sessionId) return;
      openLab();
    });
  });

  dom.btnSound.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    dom.btnSound.setAttribute("aria-pressed", String(state.soundEnabled));
    dom.btnSound.classList.toggle("is-muted", !state.soundEnabled);
    dom.btnSound.title = state.soundEnabled ? "Som ligado" : "Som desligado";
    dom.btnSound.innerHTML = state.soundEnabled
      ? '<i class="bi bi-volume-up-fill"></i>'
      : '<i class="bi bi-volume-mute-fill"></i>';
    if (state.soundEnabled) playSound("hint");
  });

  // Atalhos de teclado
  document.addEventListener("keydown", (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

    if (state.activeModal === "error" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      closeErrorModalAndContinue();
      return;
    }

    if (e.key === "Escape" && state.activeModal === "lab" && !hasBootstrapModal()) {
      closeLab();
      return;
    }

    if (e.key.toLowerCase() === "l" && state.activeModal !== "error" && state.activeModal !== "end") {
      if (state.activeModal === "lab") closeLab();
      else openLab();
    }
  });

  window.addEventListener("resize", resizeCanvas);
}

function detectOfflineFallback() {
  const modalDisplay = getComputedStyle(dom.errorModal).display;
  if (modalDisplay !== "none") {
    document.body.classList.add("no-bootstrap");
  }
}

function init() {
  detectOfflineFallback();
  resizeCanvas();
  renderMotherboard();
  bindEvents();
  startSession("campaign");
  state.rafId = requestAnimationFrame(tickTimer);
}

init();
