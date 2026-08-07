/* =========================================
   WORK DONE — FEED UI
   ========================================= */

const header =
  document.getElementById("site-header");

const menuToggle =
  document.getElementById("menu-toggle");

const submenu =
  document.getElementById("submenu");

const backgroundBlur =
  document.getElementById("background-blur");

const feed =
  document.getElementById("work-feed");

let menuOpen = false;
let lastScrollPosition = 0;


/* =========================================
   MENU
   ========================================= */

function toggleMenu() {
  menuOpen = !menuOpen;

  menuToggle?.classList.toggle(
    "open",
    menuOpen
  );

  menuToggle?.setAttribute(
    "aria-expanded",
    String(menuOpen)
  );

  submenu?.classList.toggle(
    "open",
    menuOpen
  );

  backgroundBlur?.classList.toggle(
    "active",
    menuOpen
  );

  header?.classList.toggle(
    "menu-open",
    menuOpen
  );
}


menuToggle?.addEventListener(
  "click",
  toggleMenu
);


backgroundBlur?.addEventListener(
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


/* Hide header while scrolling down */

window.addEventListener(
  "scroll",
  () => {

    const currentScroll =
      window.scrollY
      ||
      document.documentElement.scrollTop;

    if (!menuOpen) {

      if (currentScroll <= 10) {
        header?.classList.remove(
          "hidden"
        );
      }

      else if (
        currentScroll >
        lastScrollPosition
      ) {
        header?.classList.add(
          "hidden"
        );
      }

      else {
        header?.classList.remove(
          "hidden"
        );
      }

    }

    lastScrollPosition =
      Math.max(
        currentScroll,
        0
      );

  },
  { passive: true }
);


/* =========================================
   POST CONSTRUCTION
   ========================================= */

function makeMediaElement(media) {

  const isVideo =
    media.type === "video";

  const element =
    document.createElement(
      isVideo
        ? "video"
        : "img"
    );


  element.className =
    "post-media";

  element.dataset.fit =
    media.fit || "cover";

  element.style.setProperty(
    "--media-position",
    media.position || "50% 50%"
  );

  element.style.setProperty(
    "--media-scale",
    media.scale || 1
  );


  if (isVideo) {

    element.muted = true;
    element.loop = true;
    element.playsInline = true;

    /*
      Important for large archives:
      do not download full videos until needed.
    */
    element.preload = "metadata";

    element.setAttribute(
      "aria-label",
      "Muted looping video"
    );

  }

  else {

    element.alt =
      media.alt || "";

    element.loading =
      "lazy";

    element.decoding =
      "async";

  }


  element.src =
    media.src;

  return element;
}


function makeBackgroundMedia(media) {

  /*
    Videos use the same source as a muted decorative
    blurred background. For the current photo demo,
    this is simply another image.
  */

  const element =
    document.createElement(
      media.type === "video"
        ? "video"
        : "img"
    );

  element.className =
    "post-slide-background";

  element.setAttribute(
    "aria-hidden",
    "true"
  );

  element.src =
    media.src;


  if (media.type === "video") {

    element.muted = true;
    element.loop = true;
    element.playsInline = true;
    element.preload = "metadata";

  }

  else {

    element.alt = "";
    element.loading = "lazy";
    element.decoding = "async";

  }

  return element;
}


function buildPost(post) {

  const article =
    document.createElement(
      "article"
    );

  article.className =
    "feed-post";

  article.dataset.postId =
    post.id;


  const shell =
    document.createElement(
      "div"
    );

  shell.className =
    "post-media-shell";


  const carousel =
    document.createElement(
      "div"
    );

  carousel.className =
    "post-carousel";

  carousel.setAttribute(
    "aria-label",
    `Media for ${post.username}`
  );


  post.media.forEach(
    media => {

      const slide =
        document.createElement(
          "div"
        );

      slide.className =
        "post-slide";


      /*
        Only add blurred fill for contain-mode media.
      */

      if (
        (media.fit || "cover")
        ===
        "contain"
      ) {

        slide.appendChild(
          makeBackgroundMedia(media)
        );

      }


      slide.appendChild(
        makeMediaElement(media)
      );

      carousel.appendChild(
        slide
      );

    }
  );


  shell.appendChild(
    carousel
  );


  /* Dots only when multiple media exist */

  if (
    post.media.length > 1
  ) {

    const dots =
      document.createElement(
        "div"
      );

    dots.className =
      "carousel-dots";

    post.media.forEach(
      (_, index) => {

        const dot =
          document.createElement(
            "span"
          );

        dot.className =
          "carousel-dot";

        if (index === 0) {
          dot.classList.add(
            "active"
          );
        }

        dots.appendChild(
          dot
        );

      }
    );

    shell.appendChild(
      dots
    );


    const updateDots =
      () => {

        const index =
          Math.round(
            carousel.scrollLeft
            /
            carousel.clientWidth
          );


        Array.from(
          dots.children
        ).forEach(
          (dot, dotIndex) => {

            dot.classList.toggle(
              "active",
              dotIndex === index
            );

          }
        );

      };


    carousel.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(
          updateDots
        );
      },
      { passive: true }
    );

  }


  const copy =
    document.createElement(
      "div"
    );

  copy.className =
    "post-copy";


  const username =
    document.createElement(
      "p"
    );

  username.className =
    "post-username";

  username.textContent =
    post.username
    ||
    "@Zaragoza";


  const caption =
    document.createElement(
      "p"
    );

  caption.className =
    "post-caption";

  caption.textContent =
    post.caption || "";


  copy.append(
    username,
    caption
  );


  const divider =
    document.createElement(
      "div"
    );

  divider.className =
    "post-divider";

  divider.setAttribute(
    "aria-hidden",
    "true"
  );


  article.append(
    shell,
    copy,
    divider
  );


  return article;
}


/* Only five newest posts */

const posts =
  Array.isArray(
    window.WORK_DONE_POSTS
  )
    ?
    window.WORK_DONE_POSTS
    :
    [];


posts
  .slice(0, 5)
  .forEach(post => {

    feed?.appendChild(
      buildPost(post)
    );

  });


/* =========================================
   POST ENTRANCE / USERNAME EFFECT
   ========================================= */

const postObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add("post-seen");

            postObserver.unobserve(
              entry.target
            );

          }

        }
      );

    },

    {
      threshold: 0.24
    }

  );


document
  .querySelectorAll(
    ".feed-post"
  )
  .forEach(post => {
    postObserver.observe(post);
  });


/* =========================================
   VIDEO PERFORMANCE
   Only play visible foreground videos.
   ========================================= */

const videoObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          const video =
            entry.target;


          if (
            entry.isIntersecting
            &&
            entry.intersectionRatio
            >=
            0.55
          ) {

            video
              .play()
              .catch(() => {});

          }

          else {

            video.pause();

          }

        }
      );

    },

    {
      threshold: [
        0,
        0.55,
        1
      ]
    }

  );


document
  .querySelectorAll(
    ".post-media[type='video'], .post-media"
  )
  .forEach(element => {

    if (
      element.tagName
      ===
      "VIDEO"
    ) {

      videoObserver.observe(
        element
      );

    }

  });


/*
  Decorative blurred video backgrounds should
  never be independently playing.
*/

document
  .querySelectorAll(
    ".post-slide-background"
  )
  .forEach(element => {

    if (
      element.tagName
      ===
      "VIDEO"
    ) {

      element.pause();

    }

  });
