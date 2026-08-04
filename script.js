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

  let os = "other";

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

        header.classList.add(
          "loaded"
        );

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

      EDIT THIS VALUE.
    */

    const fadePoint = 80;


    if (titleBlock) {

      if (
        currentScroll >
        fadePoint
      ) {

        titleBlock.classList.add(
          "title-hidden"
        );

      }

      else {

        titleBlock.classList.remove(
          "title-hidden"
        );

      }

    }


    /*
      HEADER STAYS VISIBLE
      WHILE MENU IS OPEN
    */

    if (menuOpen) {
      return;
    }


    if (
      currentScroll <= 10
    ) {

      header.classList.remove(
        "hidden"
      );

    }


    else if (
      currentScroll >
      lastScrollPosition
    ) {

      header.classList.add(
        "hidden"
      );

    }


    else {

      header.classList.remove(
        "hidden"
      );

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
    "image"
    "video"

  position:

    "50% 50%" = center
    "50% 20%" = more top
    "80% 50%" = more right

  scale:

    1    = normal
    1.1  = slight zoom
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
    let i =
      shuffled.length - 1;

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
    ] =
    [
      shuffled[j],
      shuffled[i]
    ];

  }


  return shuffled;
}


const randomizedMedia =
  shuffleArray(
    slideshowMedia
  );


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
  shuffleArray(
    [0, 1, 2]
  );


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
      document.createElement(
        "div"
      );


    frame.className =
      "media-frame";


    let element;


    /* IMAGE */

    if (
      media.type ===
      "image"
    ) {

      element =
        document.createElement(
          "img"
        );

      element.alt = "";

    }


    /* VIDEO */

    else if (
      media.type ===
      "video"
    ) {

      element =
        document.createElement(
          "video"
        );


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


    /*
      INDIVIDUAL CROP POSITION
    */

    element.style.objectPosition =
      media.position ||
      "50% 50%";


    /*
      INDIVIDUAL ZOOM
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
          item.cloneNode(
            true
          );


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
   BLOCK 3 — LOAD / BUILD ELECTRIC SVG
   ====================================== */

const block3 =
  document.getElementById(
    "block-3"
  );


const electricArt =
  document.getElementById(
    "electric-art"
  );


async function buildElectricArt() {

  if (!electricArt) {
    return;
  }


  try {

    /*
      EDIT SVG FILE HERE
    */

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


    /*
      RESPONSIVE SVG
    */

    sourceSvg.removeAttribute(
      "width"
    );

    sourceSvg.removeAttribute(
      "height"
    );


    sourceSvg.setAttribute(
      "preserveAspectRatio",
      "xMidYMid meet"
    );


    sourceSvg.classList.add(
      "electric-svg"
    );


    /*
      FIND VECTOR PATHS
    */

    const sourcePaths =
      Array.from(

        sourceSvg.querySelectorAll(
          "path"
        )

      );


    sourcePaths.forEach(
      (path, index) => {


        /*
          ORIGINAL VECTOR
          BECOMES INVISIBLE
        */

        path.classList.add(
          "electric-source"
        );


        /*
          NORMALIZE PATH LENGTH
        */

        path.setAttribute(
          "pathLength",
          "100"
        );


        /*
          CREATE EFFECT LAYERS
        */

        const trail =
          path.cloneNode(
            true
          );


        const glow =
          path.cloneNode(
            true
          );


        const core =
          path.cloneNode(
            true
          );


        const warm =
          path.cloneNode(
            true
          );


        /*
          REMOVE DUPLICATE IDs
        */

        trail.removeAttribute(
          "id"
        );

        glow.removeAttribute(
          "id"
        );

        core.removeAttribute(
          "id"
        );

        warm.removeAttribute(
          "id"
        );


        /*
          EFFECT CLASSES
        */

        trail.setAttribute(
          "class",
          "electric-trail"
        );


        glow.setAttribute(
          "class",
          "electric-glow"
        );


        core.setAttribute(
          "class",
          "electric-core"
        );


        warm.setAttribute(
          "class",
          "electric-warm"
        );


        /*
          SLIGHT TIMING VARIATION
          BETWEEN VECTOR PATHS
        */

        const stagger =
          (index % 11)
          *
          0.018;


        const warmOffset =
          (index % 7)
          *
          0.027;


        trail.style.animationDelay =
          `${stagger}s`;


        glow.style.animationDelay =
          `${stagger}s, ${stagger}s`;


        core.style.animationDelay =
          `${stagger}s`;


        warm.style.animationDelay =
          `${warmOffset}s`;


        /*
          INSERT ELECTRIC LAYERS
        */

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


    /*
      PLACE FINISHED SVG
      INTO BLOCK 3
    */

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
   BLOCK 3 — TEXT SCROLL ANIMATION
   ====================================== */

if (block3) {

  const block3Observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            const rect =
              entry.boundingClientRect;


            /*
              ENTERING BLOCK 3
            */

            if (
              entry.isIntersecting
            ) {

              block3.classList.add(
                "block-visible"
              );


              block3.classList.remove(
                "block-passed"
              );

            }


            /*
              BLOCK 3 HAS PASSED
              ABOVE VIEWPORT
            */

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


            /*
              BLOCK 3 IS BELOW
              VIEWPORT WAITING
            */

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
        threshold: 0.22
      }

    );


  block3Observer.observe(
    block3
  );

}
