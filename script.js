const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const submenu = document.getElementById("submenu");
const backgroundBlur = document.getElementById("background-blur");
const titleBlock = document.querySelector(".title-block");
const homeBlock = document.getElementById("home");
const block3 = document.getElementById("block-3");
const electricArt = document.getElementById("electric-art");
const contactBlock = document.getElementById("contact");

let menuOpen = false;
let lastScrollPosition = 0;

/* ======================================
   DEVICE / VIEWPORT DETECTION
   ====================================== */

function updateDeviceInfo() {
  const width = window.innerWidth;
  const pixelRatio = window.devicePixelRatio || 1;

  let deviceType = "desktop";
  if (width <= 600) deviceType = "phone";
  else if (width <= 1024) deviceType = "tablet";

  const ua = navigator.userAgent;
  let os = "other";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "ios";
  else if (/Android/i.test(ua)) os = "android";
  else if (/Windows/i.test(ua)) os = "windows";
  else if (/Macintosh|Mac OS/i.test(ua)) os = "macos";

  document.documentElement.dataset.device = deviceType;
  document.documentElement.dataset.os = os;
  document.documentElement.dataset.pixelRatio = pixelRatio;
}

updateDeviceInfo();
window.addEventListener("resize", updateDeviceInfo);
window.addEventListener("orientationchange", updateDeviceInfo);

/* ======================================
   STARTUP LOGO -> HEADER
   ====================================== */

window.addEventListener("load", () => {
  setTimeout(() => {
    header?.classList.add("loaded");
  }, 250);

  setTimeout(() => {
    titleBlock?.classList.add("title-visible");
  }, 980);
});

/* ======================================
   MENU
   ====================================== */

function toggleMenu() {
  menuOpen = !menuOpen;
  menuToggle?.classList.toggle("open", menuOpen);
  menuToggle?.setAttribute("aria-expanded", String(menuOpen));
  submenu?.classList.toggle("open", menuOpen);
  backgroundBlur?.classList.toggle("active", menuOpen);
  header?.classList.toggle("menu-open", menuOpen);
}

menuToggle?.addEventListener("click", toggleMenu);

backgroundBlur?.addEventListener("click", () => {
  if (menuOpen) toggleMenu();
});

submenu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    if (menuOpen) toggleMenu();
  });
});

/* ======================================
   HEADER SCROLL
   ====================================== */

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY || document.documentElement.scrollTop;

  if (!menuOpen && header?.classList.contains("loaded")) {
    if (currentScroll <= 10) header.classList.remove("hidden");
    else if (currentScroll > lastScrollPosition) header.classList.add("hidden");
    else header.classList.remove("hidden");
  }

  lastScrollPosition = Math.max(currentScroll, 0);
}, { passive: true });

/* ======================================
   BLOCK 1 FADE IN / OUT
   ====================================== */

function updateBlock1Visibility() {
  if (!homeBlock || !titleBlock) return;

  const rect = homeBlock.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;

  const visibleEnough =
    rect.bottom > vh * 0.42 &&
    rect.top < vh * 0.58;

  if (visibleEnough) {
    titleBlock.classList.add("title-visible");
    titleBlock.classList.remove("title-hidden");
  } else {
    titleBlock.classList.remove("title-visible");
    titleBlock.classList.add("title-hidden");
  }
}

window.addEventListener("scroll", updateBlock1Visibility, { passive: true });
window.addEventListener("resize", updateBlock1Visibility);

/* ======================================
   BLOCK 2 MEDIA LIBRARY
   ====================================== */

const slideshowMedia = [
  { src: "images/photo1.jpg", type: "image", position: "50% 50%", scale: 1 },
  { src: "images/photo2.jpg", type: "image", position: "50% 30%", scale: 1 },
  { src: "images/photo3.jpg", type: "image", position: "70% 50%", scale: 1 },
  { src: "videos/video1.mp4", type: "video", position: "50% 50%", scale: 1 }
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildSlideshow() {
  const tracks = [
    document.getElementById("picture-track-1"),
    document.getElementById("picture-track-2"),
    document.getElementById("picture-track-3")
  ];

  if (tracks.some(track => !track)) return;

  tracks.forEach(track => {
    track.replaceChildren();
    track.style.removeProperty("--loop-distance");
  });

  const randomizedMedia = shuffleArray(slideshowMedia);
  const guaranteedRows = shuffleArray([0, 1, 2]);

  /*
    Build one independent source set per row.
    Each source set is duplicated afterward.
  */
  const rowSets = tracks.map(() => {
    const set = document.createElement("div");
    set.className = "picture-track-set";
    return set;
  });

  randomizedMedia.forEach((media, index) => {
    const rowIndex =
      index < 3
        ? guaranteedRows[index]
        : Math.floor(Math.random() * 3);

    const frame = document.createElement("div");
    frame.className = "media-frame";

    let element;

    if (media.type === "video") {
      element = document.createElement("video");
      element.autoplay = true;
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
    } else {
      element = document.createElement("img");
      element.alt = "";
    }

    element.src = media.src;
    element.style.objectPosition =
      media.position || "50% 50%";
    element.style.transform =
      `scale(${media.scale || 1})`;

    frame.appendChild(element);
    rowSets[rowIndex].appendChild(frame);
  });

  tracks.forEach((track, index) => {
    const sourceSet = rowSets[index];

    /*
      If a row has no media, leave it empty safely.
    */
    if (!sourceSet.children.length) {
      return;
    }

    const duplicateSet =
      sourceSet.cloneNode(true);

    duplicateSet.setAttribute(
      "aria-hidden",
      "true"
    );

    track.append(
      sourceSet,
      duplicateSet
    );

    /*
      Wait for layout, then measure the exact width
      of ONE repeated set. The animation moves by
      precisely this amount, so set #2 takes over at
      the exact pixel where set #1 ends.
    */
    requestAnimationFrame(() => {
      const loopDistance =
        sourceSet.getBoundingClientRect().width;

      track.style.setProperty(
        "--loop-distance",
        `${loopDistance}px`
      );
    });
  });
}

buildSlideshow();

/*
  Recalculate the exact loop distance if the
  viewport/orientation changes.
*/
function refreshSlideshowLoopDistances() {
  document
    .querySelectorAll(".picture-track")
    .forEach(track => {
      const firstSet =
        track.querySelector(".picture-track-set");

      if (!firstSet) return;

      track.style.setProperty(
        "--loop-distance",
        `${firstSet.getBoundingClientRect().width}px`
      );
    });
}

window.addEventListener(
  "resize",
  () => requestAnimationFrame(
    refreshSlideshowLoopDistances
  )
);

window.addEventListener(
  "orientationchange",
  () => requestAnimationFrame(
    refreshSlideshowLoopDistances
  )
);

/* ======================================
   BLOCK 3 ELECTRIC SVG
   ====================================== */

async function buildElectricArt() {
  if (!electricArt) return;

  try {
    const response = await fetch("images/paper-street-soap.svg");
    if (!response.ok) throw new Error(`SVG load failed: ${response.status}`);

    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
    const sourceSvg = svgDocument.documentElement;

    sourceSvg.removeAttribute("width");
    sourceSvg.removeAttribute("height");
    sourceSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    sourceSvg.classList.add("electric-svg");

    const paths = Array.from(sourceSvg.querySelectorAll("path"));

    paths.forEach((path, index) => {
      path.classList.add("electric-source");
      path.setAttribute("pathLength", "100");

      const makeLayer = className => {
        const clone = path.cloneNode(true);
        clone.removeAttribute("id");
        clone.removeAttribute("style");
        clone.removeAttribute("fill");
        clone.removeAttribute("stroke");
        clone.removeAttribute("opacity");
        clone.setAttribute("class", className);
        clone.setAttribute("pathLength", "100");
        return clone;
      };

      const trail = makeLayer("electric-trail");
      const glow = makeLayer("electric-glow");
      const warm = makeLayer("electric-warm");
      const core = makeLayer("electric-core");

      const stagger = (index % 13) * 0.014;
      const warmOffset = (index % 9) * 0.022;

      trail.style.animationDelay = `${stagger}s`;
      glow.style.animationDelay = `${stagger}s, ${stagger}s`;
      core.style.animationDelay = `${stagger}s`;
      warm.style.animationDelay = `${warmOffset}s`;

      path.after(trail, glow, warm, core);
    });

    electricArt.replaceChildren(document.importNode(sourceSvg, true));
  } catch (error) {
    console.error("Block 3 electric SVG:", error);
  }
}

buildElectricArt();

/* BLOCK 3 text visibility */

const block3Copy = document.querySelector(".block-3-copy");

if (block3 && block3Copy) {
  const block3TextObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        block3.classList.add("block-visible");
        block3.classList.remove("block-passed");
      } else {
        const rect = block3Copy.getBoundingClientRect();

        block3.classList.remove("block-visible");

        if (rect.bottom < 0) {
          block3.classList.add("block-passed");
        } else {
          block3.classList.remove("block-passed");
        }
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  });

  block3TextObserver.observe(block3Copy);
}

/* ======================================
   BLOCK 4 SLOT MACHINE
   ====================================== */

const slotRows = Array.from(document.querySelectorAll(".slot-row"));
const slotEmojiPool = ["⚡️", "🔥", "💡", "✨", "💥", "⭐️", "🔌", "🛠️", "🔧", "💫"];
const SLOT_COUNT = 5;
const SLOT_STEP = 100;
const SLOT_BASE_SPIN = 3000;
const SLOT_STOP_GAP = 300;
const SLOT_WIN_TIME = 1240;
const SLOT_RESTART_PAUSE = 900;

let contactSlotsStarted = false;
let contactSlotLoopToken = 0;

function createSlotRows() {
  slotRows.forEach(row => {
    row.replaceChildren();
    for (let i = 0; i < SLOT_COUNT; i++) {
      const windowElement = document.createElement("span");
      windowElement.className = "slot-window";
      const symbol = document.createElement("span");
      symbol.className = "slot-symbol";
      symbol.textContent = "⚡️";
      windowElement.appendChild(symbol);
      row.appendChild(windowElement);
    }
  });
}

function randomSlotEmoji() {
  return slotEmojiPool[Math.floor(Math.random() * slotEmojiPool.length)];
}

function spinSingleSlot(slot, stopAfter, token) {
  return new Promise(resolve => {
    const symbol = slot.querySelector(".slot-symbol");
    const startedAt = performance.now();

    function step() {
      if (token !== contactSlotLoopToken) {
        resolve();
        return;
      }

      const elapsed = performance.now() - startedAt;
      if (elapsed >= stopAfter) {
        symbol.textContent = "⚡️";
        symbol.classList.remove("slot-enter");
        slot.classList.add("slot-stopped");
        resolve();
        return;
      }

      symbol.textContent = randomSlotEmoji();
      symbol.classList.remove("slot-enter");
      void symbol.offsetWidth;
      symbol.classList.add("slot-enter");
      setTimeout(step, SLOT_STEP);
    }

    step();
  });
}

async function runContactSlotLoop() {
  const token = ++contactSlotLoopToken;

  while (contactSlotsStarted && token === contactSlotLoopToken) {
    slotRows.forEach(row => {
      row.classList.remove("slot-win");
      Array.from(row.children).forEach(slot => slot.classList.remove("slot-stopped"));
    });

    const jobs = [];
    slotRows.forEach(row => {
      Array.from(row.children).forEach((slot, index) => {
        jobs.push(spinSingleSlot(slot, SLOT_BASE_SPIN + index * SLOT_STOP_GAP, token));
      });
    });

    await Promise.all(jobs);
    if (!contactSlotsStarted || token !== contactSlotLoopToken) return;

    slotRows.forEach(row => row.classList.add("slot-win"));
    await new Promise(resolve => setTimeout(resolve, SLOT_WIN_TIME));
    slotRows.forEach(row => row.classList.remove("slot-win"));
    await new Promise(resolve => setTimeout(resolve, SLOT_RESTART_PAUSE));
  }
}

function startContactSlots() {
  if (contactSlotsStarted) return;
  contactSlotsStarted = true;
  runContactSlotLoop();
}

function stopContactSlots() {
  contactSlotsStarted = false;
  contactSlotLoopToken++;
}

createSlotRows();

if (contactBlock) {
  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.65) startContactSlots();
      else if (!entry.isIntersecting) stopContactSlots();
    });
  }, { threshold: [0, 0.65, 1] });

  contactObserver.observe(contactBlock);
}
