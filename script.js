const header =
  document.getElementById("site-header");

const menuToggle =
  document.getElementById("menu-toggle");

const submenu =
  document.getElementById("submenu");

const backgroundBlur =
  document.getElementById("background-blur");

const titleBlock =
  document.querySelector(".title-block");

let menuOpen = false;
let lastScrollPosition = 0;


/* ======================================
   DEVICE / VIEWPORT DETECTION
   ====================================== */

function updateDeviceInfo() {

  const width =
    window.innerWidth;

  const pixelRatio =
    window.devicePixelRatio || 1;

  let deviceType;

  if (width <= 600) {
    deviceType = "phone";
  }

  else if (width <= 1024) {
    deviceType = "tablet";
  }

  else {
    deviceType = "desktop";
  }

  const platform =
    navigator.userAgent;

  let os =
    "other";

  if (/iPhone|iPad|iPod/i.test(platform)) {
    os = "ios";
  }

  else if (/Android/i.test(platform)) {
    os = "android";
  }

  else if (/Windows/i.test(platform)) {
    os = "windows";
  }

  else if (/Macintosh|Mac OS/i.test(platform)) {
    os = "macos";
  }

  document.documentElement.dataset.device =
    deviceType;

  document.documentElement.dataset.os =
    os;

  document.documentElement.dataset.pixelRatio =
    pixelRatio;
}

updateDeviceInfo();

window.addEventListener(
  "resize",
  updateDeviceInfo
);

window.addEventListener(
  "orientationchange",
  updateDeviceInfo
);


/* ======================================
   STARTUP LOGO ANIMATION
   ====================================== */

window.addEventListener(
  "load",
  () => {

    /*
      EDIT THIS NUMBER
      to change minimum startup display time.
    */

    setTimeout(
      () => {
        header.classList.add("loaded");
      },
      250
    );

  }
);


/* ======================================
   MENU
   ====================================== */

function toggleMenu() {

  menuOpen =
    !menuOpen;

  menuToggle.classList.toggle(
    "open",
    menuOpen
  );

  menuToggle.setAttribute(
    "aria-expanded",
    menuOpen
  );

  submenu.classList.toggle(
    "open",
    menuOpen
  );

  backgroundBlur.classList.toggle(
    "active",
    menuOpen
  );

  header.classList.toggle(
    "menu-open",
    menuOpen
  );
}

menuToggle.addEventListener(
  "click",
  toggleMenu
);

backgroundBlur.addEventListener(
  "click",
  () => {

    if (menuOpen) {
      toggleMenu();
    }

  }
);


/* ======================================
   HEADER + BLOCK 1 SCROLL BEHAVIOR
   ====================================== */

window.addEventListener(

  "scroll",

  () => {

    const currentScroll =
      window.scrollY ||
      document.documentElement.scrollTop;

    /*
      BLOCK 1 TITLE FADE POINT
      EDIT THIS VALUE LATER.
    */

    const fadePoint = 80;

    if (titleBlock) {

      if (currentScroll > fadePoint) {
        titleBlock.classList.add("title-hidden");
      }

      else {
        titleBlock.classList.remove("title-hidden");
      }

    }

    /*
      Header stays visible while menu is open.
    */

    if (menuOpen) {
      return;
    }

    if (currentScroll <= 10) {
      header.classList.remove("hidden");
    }

    else if (
      currentScroll >
      lastScrollPosition
    ) {
      header.classList.add("hidden");
    }

    else {
      header.classList.remove("hidden");
    }

    lastScrollPosition =
      Math.max(
        currentScroll,
        0
      );

  },

  {
    passive: true
  }

);


/* ======================================
   BLOCK 2 — MEDIA LIBRARY
   ====================================== */

/*
  ADD / REMOVE MEDIA HERE.

  type:
    "image" or "video"

  position:
    controls which part of the image/video
    is visible inside the fixed frame.

    "50% 50%" = center
    "50% 20%" = more top
    "80% 50%" = more right

  scale:
    1 = normal
    1.1 = slight zoom
    1.25 = stronger zoom
*/

const slideshowMedia = [

  {
    src: "images/photo1.jpg",
    type: "image",
    position: "50% 50%",
    scale: 1
  },

  {
    src: "images/photo2.jpg",
    type: "image",
    position: "50% 30%",
    scale: 1
  },

  {
    src: "images/photo3.jpg",
    type: "image",
    position: "70% 50%",
    scale: 1
  },

  {
    src: "videos/video1.mp4",
    type: "video",
    position: "50% 50%",
    scale: 1
  }

];


/* ======================================
   BLOCK 2 — RANDOMIZE MEDIA
   ====================================== */

function shuffleArray(array) {

  const shuffled =
    [...array];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      shuffled[i],
      shuffled[j]
    ] = [
      shuffled[j],
      shuffled[i]
    ];

  }

  return shuffled;
}

const randomizedMedia =
  shuffleArray(slideshowMedia);


/* ======================================
   BLOCK 2 — GET TRACKS
   ====================================== */

const slideshowTracks = [

  document.getElementById(
    "picture-track-1"
  ),

  document.getElementById(
    "picture-track-2"
  ),

  document.getElementById(
    "picture-track-3"
  )

];


/* ======================================
   BLOCK 2 — RANDOM ROW DISTRIBUTION
   ====================================== */

const guaranteedRows =
  shuffleArray([0, 1, 2]);

randomizedMedia.forEach(
  (media, index) => {

    let rowIndex;

    if (index < 3) {
      rowIndex =
        guaranteedRows[index];
    }

    else {
      rowIndex =
        Math.floor(
          Math.random() * 3
        );
    }

    const frame =
      document.createElement("div");

    frame.className =
      "media-frame";

    let element;

    if (media.type === "image") {

      element =
        document.createElement("img");

      element.alt = "";

    }

    else if (media.type === "video") {

      element =
        document.createElement("video");

      element.autoplay = true;
      element.muted = true;
      element.loop = true;
      element.playsInline = true;

    }

    if (!element) {
      return;
    }

    element.src =
      media.src;

    element.style.objectPosition =
      media.position ||
      "50% 50%";

    /*
      Scale remains individual per media item.
      The 1px feather is handled by CSS filter.
    */

    element.style.transform =
      `scale(${media.scale || 1})`;

    frame.appendChild(
      element
    );

    slideshowTracks[
      rowIndex
    ].appendChild(
      frame
    );

  }
);


/* ======================================
   BLOCK 2 — SEAMLESS LOOP
   ====================================== */

slideshowTracks.forEach(
  track => {

    const originalItems =
      Array.from(
        track.children
      );

    originalItems.forEach(
      item => {

        const clone =
          item.cloneNode(true);

        clone.setAttribute(
          "aria-hidden",
          "true"
        );

        track.appendChild(
          clone
        );

      }
    );

  }
);


/* ======================================
   BLOCK 4 — CONTACT SLOT MACHINE
   ====================================== */

const contactBlock =
  document.getElementById("contact");

const slotRows =
  Array.from(
    document.querySelectorAll(
      ".slot-row"
    )
  );

const slotEmojiPool = [
  "⚡️",
  "🔥",
  "💡",
  "✨",
  "💥",
  "⭐️",
  "🔌",
  "🛠️",
  "🔧",
  "💫"
];

const SLOT_COUNT = 5;
const SLOT_STEP = 100;
const SLOT_BASE_SPIN = 3000;
const SLOT_STOP_GAP = 300;
const SLOT_WIN_TIME = 1240;
const SLOT_RESTART_PAUSE = 900;

let contactSlotsStarted = false;
let contactSlotLoopToken = 0;


function createSlotRows() {

  slotRows.forEach(
    row => {

      row.replaceChildren();

      for (
        let index = 0;
        index < SLOT_COUNT;
        index++
      ) {

        const windowElement =
          document.createElement(
            "span"
          );

        windowElement.className =
          "slot-window";

        const symbol =
          document.createElement(
            "span"
          );

        symbol.className =
          "slot-symbol";

        symbol.textContent =
          "⚡️";

        windowElement.appendChild(
          symbol
        );

        row.appendChild(
          windowElement
        );

      }

    }
  );
}


function randomSlotEmoji() {

  return slotEmojiPool[
    Math.floor(
      Math.random()
      *
      slotEmojiPool.length
    )
  ];
}


function spinSingleSlot(
  slot,
  stopAfter,
  token
) {

  return new Promise(
    resolve => {

      const symbol =
        slot.querySelector(
          ".slot-symbol"
        );

      const startedAt =
        performance.now();


      function step() {

        if (
          token !==
          contactSlotLoopToken
        ) {
          resolve();
          return;
        }


        const elapsed =
          performance.now()
          -
          startedAt;


        if (
          elapsed >=
          stopAfter
        ) {

          symbol.textContent =
            "⚡️";

          symbol.classList.remove(
            "slot-enter"
          );

          slot.classList.add(
            "slot-stopped"
          );

          resolve();

          return;
        }


        symbol.textContent =
          randomSlotEmoji();

        symbol.classList.remove(
          "slot-enter"
        );

        void symbol.offsetWidth;

        symbol.classList.add(
          "slot-enter"
        );


        setTimeout(
          step,
          SLOT_STEP
        );

      }


      step();

    }
  );
}


async function runContactSlotLoop() {

  const token =
    ++contactSlotLoopToken;


  while (
    contactSlotsStarted &&
    token === contactSlotLoopToken
  ) {

    slotRows.forEach(
      row => {

        row.classList.remove(
          "slot-win"
        );

        Array.from(
          row.children
        ).forEach(
          slot => {

            slot.classList.remove(
              "slot-stopped"
            );

          }
        );

      }
    );


    const jobs = [];


    slotRows.forEach(
      row => {

        const slots =
          Array.from(
            row.children
          );


        slots.forEach(
          (slot, index) => {

            const stopAfter =
              SLOT_BASE_SPIN
              +
              (
                index
                *
                SLOT_STOP_GAP
              );


            jobs.push(
              spinSingleSlot(
                slot,
                stopAfter,
                token
              )
            );

          }
        );

      }
    );


    await Promise.all(
      jobs
    );


    if (
      !contactSlotsStarted ||
      token !== contactSlotLoopToken
    ) {
      return;
    }


    slotRows.forEach(
      row => {

        row.classList.add(
          "slot-win"
        );

      }
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          SLOT_WIN_TIME
        )
    );


    slotRows.forEach(
      row => {

        row.classList.remove(
          "slot-win"
        );

      }
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          SLOT_RESTART_PAUSE
        )
    );

  }
}


function startContactSlots() {

  if (contactSlotsStarted) {
    return;
  }

  contactSlotsStarted = true;

  runContactSlotLoop();
}


function stopContactSlots() {

  contactSlotsStarted = false;

  contactSlotLoopToken++;
}


createSlotRows();


if (contactBlock) {

  const contactObserver =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            /*
              Start once most of Block 4
              is actually visible.
            */

            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.65
            ) {

              startContactSlots();

            }

            else if (
              !entry.isIntersecting
            ) {

              stopContactSlots();

            }

          }
        );

      },

      {
        threshold: [
          0,
          0.65,
          1
        ]
      }

    );


  contactObserver.observe(
    contactBlock
  );

}
