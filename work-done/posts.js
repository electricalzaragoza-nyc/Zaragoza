/*
  WORK DONE — POST DATA

  This is only UI/demo data for now.
  Later the pinned Python uploader will generate this automatically.

  position:
    "50% 50%" = center
    "0% 50%"   = left
    "100% 50%" = right
    "50% 0%"   = top
    "50% 100%" = bottom

  scale:
    1 = normal
    1.15 = zoomed 15%

  fit:
    "cover"   = fill 4:5 frame and crop overflow
    "contain" = show whole media over a soft blurred fill
*/

window.WORK_DONE_POSTS = [
  {
    id: "demo-005",
    username: "@Zaragoza",
    caption: "Edit this caption. Multi-media post example.",
    media: [
      {
        src: "../media/work-done-demo/post-a.jpg",
        type: "image",
        fit: "contain",
        position: "50% 50%",
        scale: 1
      },
      {
        src: "../media/work-done-demo/post-b.jpg",
        type: "image",
        fit: "contain",
        position: "50% 50%",
        scale: 1
      }
    ]
  },

  {
    id: "demo-004",
    username: "@Zaragoza",
    caption: "Edit this caption. Wide media example.",
    media: [
      {
        src: "../media/work-done-demo/post-c.png",
        type: "image",
        fit: "contain",
        position: "50% 50%",
        scale: 1
      }
    ]
  },

  {
    id: "demo-003",
    username: "@Zaragoza",
    caption: "Edit this caption. Tall media with custom crop position.",
    media: [
      {
        src: "../media/work-done-demo/post-d.jpg",
        type: "image",
        fit: "cover",
        position: "50% 38%",
        scale: 1
      }
    ]
  },

  {
    id: "demo-002",
    username: "@Zaragoza",
    caption: "Edit this caption. Another carousel test.",
    media: [
      {
        src: "../media/work-done-demo/post-d.jpg",
        type: "image",
        fit: "cover",
        position: "50% 42%",
        scale: 1
      },
      {
        src: "../media/work-done-demo/post-a.jpg",
        type: "image",
        fit: "contain",
        position: "50% 50%",
        scale: 1
      },
      {
        src: "../media/work-done-demo/post-c.png",
        type: "image",
        fit: "contain",
        position: "50% 50%",
        scale: 1
      }
    ]
  },

  {
    id: "demo-001",
    username: "@Zaragoza",
    caption: "Edit this caption. Fifth visible post.",
    media: [
      {
        src: "../media/work-done-demo/post-b.jpg",
        type: "image",
        fit: "contain",
        position: "50% 50%",
        scale: 1
      }
    ]
  }
];
