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
   BLOCK 2 â MEDIA LIBRARY
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
   BLOCK 2 â RANDOMIZE MEDIA
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
   BLOCK 2 â GET TRACKS
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
   BLOCK 2 â RANDOM ROW DISTRIBUTION
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
   BLOCK 2 â SEAMLESS LOOP
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
   BLOCK 3 â LOAD / BUILD ELECTRIC SVG
   ====================================== */

const block3 =
  document.getElementById("block-3");

const electricArt =
  document.getElementById("electric-art");


async function buildElectricArt() {

  if (!electricArt) {
    return;
  }

  try {

    const response =
      await fetch(
        "images/paper-street-soap.svg"
      );

    if (!response.ok) {

      throw new Error(
        `SVG load failed: ${response.status}`
      );

    }

    const svgText =
      await response.text();

    const parser =
      new DOMParser();

    const svgDocument =
      parser.parseFromString(
        svgText,
        "image/svg+xml"
      );

    const sourceSvg =
      svgDocument.documentElement;


    /* Responsive scaling */

    sourceSvg.removeAttribute("width");
    sourceSvg.removeAttribute("height");

    sourceSvg.setAttribute(
      "preserveAspectRatio",
      "xMidYMid meet"
    );

    sourceSvg.classList.add(
      "electric-svg"
    );


    const sourcePaths =
      Array.from(
        sourceSvg.querySelectorAll(
          "path"
        )
      );


    sourcePaths.forEach(
      (path, index) => {

        path.classList.add(
          "electric-source"
        );

        path.setAttribute(
          "pathLength",
          "100"
        );


        const makeLayer =
          className => {

            const clone =
              path.cloneNode(true);

            /*
              IMPORTANT:
              remove exported inline SVG styles
              so CSS can control the lightning.
            */

            clone.removeAttribute("id");
            clone.removeAttribute("style");
            clone.removeAttribute("fill");
            clone.removeAttribute("stroke");
            clone.removeAttribute("opacity");

            clone.setAttribute(
              "class",
              className
            );

            clone.setAttribute(
              "pathLength",
              "100"
            );

            return clone;

          };


        const trail =
          makeLayer(
            "electric-trail"
          );

        const glow =
          makeLayer(
            "electric-glow"
          );

        const warm =
          makeLayer(
            "electric-warm"
          );

        const core =
          makeLayer(
            "electric-core"
          );


        /*
          Small timing differences per path.
        */

        const stagger =
          (index % 13)
          * 0.014;

        const warmOffset =
          (index % 9)
          * 0.022;


        trail.style.animationDelay =
          `${stagger}s`;

        glow.style.animationDelay =
          `${stagger}s, ${stagger}s`;

        core.style.animationDelay =
          `${stagger}s`;

        warm.style.animationDelay =
          `${warmOffset}s`;


        path.parentNode.insertBefore(
          trail,
          path.nextSibling
        );

        path.parentNode.insertBefore(
          glow,
          trail.nextSibling
        );

        path.parentNode.insertBefore(
          warm,
          glow.nextSibling
        );

        path.parentNode.insertBefore(
          core,
          warm.nextSibling
        );

      }
    );


    electricArt.replaceChildren(
      document.importNode(
        sourceSvg,
        true
      )
    );

  }

  catch (error) {

    console.error(
      "Block 3 electric SVG:",
      error
    );

  }

}


buildElectricArt();


/* ======================================
   BLOCK 3 â TEXT SCROLL ANIMATION
   ====================================== */

if (block3) {

  const block3Observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            const rect =
              entry.boundingClientRect;


            if (entry.isIntersecting) {

              block3.classList.add(
                "block-visible"
              );

              block3.classList.remove(
                "block-passed"
              );

            }

            else if (
              rect.bottom < 0
            ) {

              block3.classList.remove(
                "block-visible"
              );

              block3.classList.add(
                "block-passed"
              );

            }

            else {

              block3.classList.remove(
                "block-visible",
                "block-passed"
              );

            }

          }
        );

      },

      {
        threshold: 0.20
      }

    );


  block3Observer.observe(
    block3
  );

}
