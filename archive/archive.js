/* =========================================
   ARCHIVE — UI LOGIC
   ========================================= */

/*
  EDITABLE PLACEHOLDER:
  Change this later and every lightbox @Zaragoza
  link will open the chosen email address.
*/
const ZARAGOZA_EMAIL =
  "YOUR-EMAIL-HERE@example.com";


const header =
  document.getElementById(
    "site-header"
  );

const menuToggle =
  document.getElementById(
    "menu-toggle"
  );

const submenu =
  document.getElementById(
    "submenu"
  );

const backgroundBlur =
  document.getElementById(
    "background-blur"
  );

const yearsContainer =
  document.getElementById(
    "archive-years"
  );

const lightbox =
  document.getElementById(
    "archive-lightbox"
  );

const lightboxCard =
  document.getElementById(
    "lightbox-card"
  );

const lightboxStage =
  document.getElementById(
    "lightbox-stage"
  );

const lightboxClose =
  document.getElementById(
    "lightbox-close"
  );

const lightboxPrev =
  document.getElementById(
    "lightbox-prev"
  );

const lightboxNext =
  document.getElementById(
    "lightbox-next"
  );

const lightboxUsername =
  document.getElementById(
    "lightbox-username"
  );

const lightboxCaptionText =
  document.getElementById(
    "lightbox-caption-text"
  );


let menuOpen = false;

let activeYearMedia = [];
let activeMediaIndex = 0;


/* =========================================
   MENU
   ========================================= */

function toggleMenu() {

  menuOpen =
    !menuOpen;

  menuToggle
    ?.classList
    .toggle(
      "open",
      menuOpen
    );

  menuToggle
    ?.setAttribute(
      "aria-expanded",
      String(menuOpen)
    );

  submenu
    ?.classList
    .toggle(
      "open",
      menuOpen
    );

  backgroundBlur
    ?.classList
    .toggle(
      "active",
      menuOpen
    );

}


menuToggle
  ?.addEventListener(
    "click",
    toggleMenu
  );


backgroundBlur
  ?.addEventListener(
    "click",
    () => {

      if (menuOpen) {
        toggleMenu();
      }

    }
  );


submenu
  ?.querySelectorAll("a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        if (menuOpen) {
          toggleMenu();
        }

      }
    );

  });


/* =========================================
   DATA NORMALIZATION
   ========================================= */

const archivePosts =
  Array.isArray(
    window.ARCHIVE_POSTS
  )
    ?
    window.ARCHIVE_POSTS
    :
    [];


/*
  Flatten each post into individual archive media
  while preserving the post caption / username.
*/

function mediaForYear(year) {

  const flattened = [];

  archivePosts
    .filter(
      post =>
        Number(post.year)
        ===
        Number(year)
    )
    .forEach(post => {

      post.media
        .forEach(
          (media, index) => {

            flattened.push({
              ...media,

              postId:
                post.id,

              mediaIndex:
                index,

              year:
                post.year,

              username:
                post.username
                ||
                "@Zaragoza",

              caption:
                post.caption
                ||
                ""
            });

          }
        );

    });

  return flattened;
}


const archiveYears =
  Array.from(
    new Set(
      archivePosts
        .map(
          post =>
            Number(post.year)
        )
        .filter(
          Number.isFinite
        )
    )
  )
    .sort(
      (a, b) =>
        b - a
    );


/* =========================================
   MEDIA ELEMENTS
   ========================================= */

function makeImageOrVideo(
  media,
  className
) {

  const isVideo =
    media.type
    ===
    "video";

  const element =
    document.createElement(
      isVideo
        ?
        "video"
        :
        "img"
    );

  element.className =
    className;

  element.dataset.fit =
    media.fit
    ||
    "cover";

  element.style.setProperty(
    "--media-position",
    media.position
      ||
      "50% 50%"
  );

  element.style.setProperty(
    "--media-scale",
    media.scale
      ||
      1
  );


  if (isVideo) {

    element.muted = true;
    element.loop = true;
    element.playsInline = true;
    element.preload = "metadata";

  }

  else {

    element.alt =
      media.alt
      ||
      "";

    element.loading =
      className
      ===
      "archive-tile-media"
        ?
        "lazy"
        :
        "eager";

    element.decoding =
      "async";

  }


  element.src =
    media.src;

  return element;
}


function makeBlurredBackground(
  media,
  className
) {

  /*
    For images, use the actual media.
    For future video thumbnails, the publishing
    system can provide a poster image.
  */

  if (
    media.type
    ===
    "video"
  ) {
    return null;
  }

  const bg =
    document.createElement(
      "img"
    );

  bg.className =
    className;

  bg.alt = "";

  bg.loading =
    "lazy";

  bg.decoding =
    "async";

  bg.src =
    media.src;

  return bg;
}


/* =========================================
   YEAR / GRID CONSTRUCTION
   ========================================= */

function buildTile(
  media,
  yearMedia,
  index
) {

  const tile =
    document.createElement(
      "button"
    );

  tile.type =
    "button";

  tile.className =
    "archive-tile";

  tile.setAttribute(
    "aria-label",
    `Open archive media ${index + 1}`
  );


  if (
    media.fit
    ===
    "contain"
  ) {

    const bg =
      makeBlurredBackground(
        media,
        "archive-tile-bg"
      );

    if (bg) {
      tile.appendChild(bg);
    }

  }


  tile.appendChild(
    makeImageOrVideo(
      media,
      "archive-tile-media"
    )
  );


  if (
    media.type
    ===
    "video"
  ) {

    const badge =
      document.createElement(
        "span"
      );

    badge.className =
      "archive-video-badge";

    badge.textContent =
      "▶";

    badge.setAttribute(
      "aria-hidden",
      "true"
    );

    tile.appendChild(
      badge
    );

  }


  tile.addEventListener(
    "click",
    () => {

      openLightbox(
        yearMedia,
        index
      );

    }
  );


  return tile;
}


function buildYearSection(
  year,
  isInitiallyOpen
) {

  const yearMedia =
    mediaForYear(year);


  const section =
    document.createElement(
      "section"
    );

  section.className =
    "archive-year";

  if (isInitiallyOpen) {

    section.classList.add(
      "open"
    );

  }


  const button =
    document.createElement(
      "button"
    );

  button.type =
    "button";

  button.className =
    "archive-year-button";

  button.setAttribute(
    "aria-expanded",
    String(
      isInitiallyOpen
    )
  );


  const label =
    document.createElement(
      "span"
    );

  label.textContent =
    String(year);


  const arrow =
    document.createElement(
      "span"
    );

  arrow.className =
    "archive-year-arrow";

  arrow.textContent =
    "⌄";

  arrow.setAttribute(
    "aria-hidden",
    "true"
  );


  button.append(
    label,
    arrow
  );


  const content =
    document.createElement(
      "div"
    );

  content.className =
    "archive-year-content";


  const inner =
    document.createElement(
      "div"
    );

  inner.className =
    "archive-year-inner";


  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "archive-grid";


  yearMedia.forEach(
    (media, index) => {

      grid.appendChild(
        buildTile(
          media,
          yearMedia,
          index
        )
      );

    }
  );


  inner.appendChild(
    grid
  );

  content.appendChild(
    inner
  );


  button.addEventListener(
    "click",
    () => {

      const open =
        !section
          .classList
          .contains("open");

      section
        .classList
        .toggle(
          "open",
          open
        );

      button.setAttribute(
        "aria-expanded",
        String(open)
      );

    }
  );


  section.append(
    button,
    content
  );


  return section;
}


/*
  Newest year opens by default.
  Every older year stays collapsed.
*/

archiveYears.forEach(
  (year, index) => {

    yearsContainer
      ?.appendChild(
        buildYearSection(
          year,
          index === 0
        )
      );

  }
);


/* =========================================
   LIGHTBOX
   ========================================= */

function renderLightboxMedia() {

  const media =
    activeYearMedia[
      activeMediaIndex
    ];

  if (!media) return;


  lightboxStage
    ?.replaceChildren();


  if (
    media.fit
    ===
    "contain"
  ) {

    const bg =
      makeBlurredBackground(
        media,
        "lightbox-bg"
      );

    if (bg) {

      lightboxStage
        ?.appendChild(
          bg
        );

    }

  }


  const element =
    makeImageOrVideo(
      media,
      "lightbox-media"
    );

  lightboxStage
    ?.appendChild(
      element
    );


  if (
    element.tagName
    ===
    "VIDEO"
  ) {

    element.autoplay =
      true;

    element.play()
      .catch(() => {});

  }


  lightboxUsername
    .textContent =
      media.username
      ||
      "@Zaragoza";

  lightboxUsername
    .href =
      `mailto:${ZARAGOZA_EMAIL}`;

  lightboxCaptionText
    .textContent =
      media.caption
      ||
      "";


  const hasMultiple =
    activeYearMedia.length
    >
    1;

  lightboxPrev
    .hidden =
      !hasMultiple;

  lightboxNext
    .hidden =
      !hasMultiple;

}


function openLightbox(
  yearMedia,
  index
) {

  activeYearMedia =
    yearMedia;

  activeMediaIndex =
    index;


  renderLightboxMedia();


  lightbox
    ?.classList
    .add("open");

  lightbox
    ?.setAttribute(
      "aria-hidden",
      "false"
    );

  document.body
    .classList
    .add(
      "lightbox-open"
    );

}


function closeLightbox() {

  lightbox
    ?.classList
    .remove("open");

  lightbox
    ?.setAttribute(
      "aria-hidden",
      "true"
    );

  document.body
    .classList
    .remove(
      "lightbox-open"
    );


  const video =
    lightboxStage
      ?.querySelector(
        "video"
      );

  video?.pause();

}


function showPrevious() {

  if (
    !activeYearMedia.length
  ) return;


  activeMediaIndex =
    (
      activeMediaIndex
      - 1
      +
      activeYearMedia.length
    )
    %
    activeYearMedia.length;


  renderLightboxMedia();

}


function showNext() {

  if (
    !activeYearMedia.length
  ) return;


  activeMediaIndex =
    (
      activeMediaIndex
      + 1
    )
    %
    activeYearMedia.length;


  renderLightboxMedia();

}


lightboxClose
  ?.addEventListener(
    "click",
    closeLightbox
  );


lightboxPrev
  ?.addEventListener(
    "click",
    showPrevious
  );


lightboxNext
  ?.addEventListener(
    "click",
    showNext
  );


/*
  Clicking away from the media card returns
  the visitor to the exact grid position.
*/

lightbox
  ?.addEventListener(
    "click",
    event => {

      if (
        event.target
        ===
        lightbox
      ) {

        closeLightbox();

      }

    }
  );


document
  .addEventListener(
    "keydown",
    event => {

      if (
        !lightbox
          ?.classList
          .contains("open")
      ) return;


      if (
        event.key
        ===
        "Escape"
      ) {
        closeLightbox();
      }

      else if (
        event.key
        ===
        "ArrowLeft"
      ) {
        showPrevious();
      }

      else if (
        event.key
        ===
        "ArrowRight"
      ) {
        showNext();
      }

    }
  );


/* =========================================
   PHONE SWIPE IN LIGHTBOX
   ========================================= */

let touchStartX = null;
let touchStartY = null;


lightboxCard
  ?.addEventListener(
    "touchstart",
    event => {

      const touch =
        event.changedTouches[0];

      touchStartX =
        touch.clientX;

      touchStartY =
        touch.clientY;

    },
    {
      passive: true
    }
  );


lightboxCard
  ?.addEventListener(
    "touchend",
    event => {

      if (
        touchStartX
        ===
        null
      ) return;


      const touch =
        event.changedTouches[0];

      const dx =
        touch.clientX
        -
        touchStartX;

      const dy =
        touch.clientY
        -
        touchStartY;


      touchStartX = null;
      touchStartY = null;


      if (
        Math.abs(dx)
        <
        45
      ) return;


      if (
        Math.abs(dx)
        <=
        Math.abs(dy)
      ) return;


      if (dx > 0) {
        showPrevious();
      }

      else {
        showNext();
      }

    },
    {
      passive: true
    }
  );
