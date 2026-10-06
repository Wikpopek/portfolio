/*
(() => {

  "use strict";

  const data = window.PORTFOLIO;

  const $ = selector =>
    document.querySelector(selector);

  const screen = $("#screen");

  const desktopFolders = $("#desktop-folders");

  const appWindow = $("#app-window");

  const content = $("#window-content");

  const lightbox = $("#lightbox");

  const activeFolder = $("#active-folder");

  let currentFolder = null;

  let currentFilter = "ALL";

  let drag = null;


  // SECURITY: ESCAPE TEXT

  function escapeHTML(value = "") {

    return String(value).replace(
      /[&<>"']/g,
      character => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

      })[character]
    );

  }


  // FOLDER SVG ICON

  function folderIcon() {

    return `
      <svg
        class="folder-svg"
        viewBox="0 0 80 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >

        <path
          d="M4 16V10C4 7 6.5 5 9 5H30L36 12H69C72 12 74 14 74 17V53C74 56 71 59 68 59H10C6.5 59 4 56.5 4 53V16Z"
          fill="#e5c68d"
          stroke="#8d7152"
          stroke-width="2"
        />

        <path
          d="M4 22C4 19 6.5 17 9 17H70C73 17 76 19 75 23L69 57C68.5 59.5 67 61 64 61H8C5 61 3 59 3 56L4 22Z"
          fill="#f4dfae"
          stroke="#8d7152"
          stroke-width="2"
        />

        <path
          d="M8 23H69M8 27H61"
          stroke="#fff7d9"
          stroke-width="2"
        />

      </svg>
    `;

  }


  // CREATE DESKTOP FOLDERS

  function renderDesktop() {

    desktopFolders.innerHTML = data.folders.map(
      (folder, index) => `

        <button
          class="desktop-folder"
          type="button"
          data-open="${escapeHTML(folder.id)}"
          style="--folder-i:${index}"
        >

          ${folderIcon()}

          <span class="folder-label">
            ${escapeHTML(folder.name)}
          </span>

        </button>

      `
    ).join("");

  }


  // FOLDER INTRO

  function renderIntro(folder) {

    return `

      <header class="folder-intro">

        <div class="folder-kicker">
          ✳ WIKI VISUAL / COLLECTION
        </div>

        <h2>
          ${escapeHTML(folder.name.toLowerCase())}.
        </h2>

        <p>
          ${escapeHTML(folder.intro || folder.subtitle)}
        </p>

      </header>

    `;

  }


  // ABOUT PAGE

  function renderAbout() {

    const site = data.site;

    return `

      <div class="about-layout">

        <div class="about-copy">

          <div class="folder-kicker">
            ✳ FILE 001 / INTRODUCTION
          </div>

          <h2>
            hello, i'm<br>
            <em>${escapeHTML(site.artistName)}.</em>
          </h2>

          <div class="about-location">

            ↗ ${escapeHTML(site.label)}

            <br>

            ${escapeHTML(site.location)}

          </div>

          <p>
            ${escapeHTML(site.introduction)}
          </p>

          <p class="about-quote">
            “${escapeHTML(site.statement)}”
          </p>

          <button
            class="text-link"
            data-open="contact"
          >

            LET'S TALK ↗

          </button>

        </div>


        <figure class="about-image">

          <img
            src="assets/about.svg"
            alt="About me"
          >

          <figcaption>
            AN INTRODUCTION / 001
          </figcaption>

        </figure>

      </div>

    `;

  }


  // GALLERY PAGE

  function renderGallery(folder) {

    const categories = [
      "ALL",
      ...new Set(
        folder.items.map(item => item.category)
      )
    ];

    const items = currentFilter === "ALL"
      ? folder.items
      : folder.items.filter(
          item => item.category === currentFilter
        );


    const filters = categories.map(
      category => `

        <button
          class="filter-pill ${
            category === currentFilter
              ? "selected"
              : ""
          }"
          data-filter="${escapeHTML(category)}"
        >

          ${escapeHTML(category)}

        </button>

      `
    ).join("");


    const gallery = items.map(
      (item, index) => `

        <button
          class="gallery-card"
          data-image="${escapeHTML(item.image)}"
          data-title="${escapeHTML(item.title)}"
        >

          <span class="gallery-image">

            <img
              src="${escapeHTML(item.image)}"
              alt="${escapeHTML(item.title)}"
              loading="lazy"
            >

            <span class="image-expand">
              ↗
            </span>

          </span>


          <span class="gallery-meta">

            <span>

              <strong>
                ${escapeHTML(item.title)}
              </strong>

              <small>
                ${escapeHTML(item.category)}
              </small>

            </span>

            <small>
              ${String(index + 1).padStart(2, "0")}
            </small>

          </span>

        </button>

      `
    ).join("");


    return `

      ${renderIntro(folder)}

      <div class="filter-bar">
        ${filters}
      </div>

      <div class="gallery-grid">
        ${gallery}
      </div>

    `;

  }


  // CONTACT PAGE

  function renderContact() {

    const site = data.site;

    return `

      <div class="contact-layout">

        <div class="folder-kicker">
          ✳ LET'S MAKE SOMETHING
        </div>

        <h2>
          have a little<br>
          <em>something in mind?</em>
        </h2>

        <p>
          I'm always happy to hear about collaborations,
          projects, ideas or a simple hello.
        </p>


        <div class="contact-links">

          ${
            site.email
              ? `

                <a
                  class="contact-link"
                  href="mailto:${escapeHTML(site.email)}"
                >

                  <span>01 / EMAIL</span>

                  <strong>
                    ${escapeHTML(site.email)}
                  </strong>

                  <span>↗</span>

                </a>

              `
              : ""
          }


          <a
            class="contact-link"
            href="${escapeHTML(site.instagram)}"
            target="_blank"
            rel="noopener noreferrer"
          >

            <span>02 / INSTAGRAM</span>

            <strong>
              ${escapeHTML(site.instagramLabel)}
            </strong>

            <span>↗</span>

          </a>

        </div>

      </div>

    `;

  }


  // OPEN FOLDER

  function openFolder(id) {

    const folder = data.folders.find(
      item => item.id === id
    );

    if (!folder) return;

    currentFolder = folder;

    currentFilter = "ALL";

    appWindow.hidden = false;

    appWindow.classList.remove("maximized");

    appWindow.style.left = "";
    appWindow.style.top = "";
    appWindow.style.transform = "";

    $("#window-title").textContent = folder.name;

    $("#folder-path").textContent = folder.name;

    activeFolder.hidden = false;

    activeFolder.textContent = folder.name;

    renderWindow();

  }


  // RENDER WINDOW CONTENT

  function renderWindow() {

    if (!currentFolder) return;

    const folder = currentFolder;

    if (folder.type === "about") {

      content.innerHTML = renderAbout();

    }

    else if (folder.type === "contact") {

      content.innerHTML = renderContact();

    }

    else {

      content.innerHTML = renderGallery(folder);

    }

    const count = folder.items
      ? folder.items.length
      : 1;

    $("#file-count").textContent =
      `${count} ITEMS`;

    $("#window-status").textContent =
      `${folder.name} / READY`;

    content.scrollTop = 0;

  }


  // CLOSE WINDOW

  function closeWindow() {

    appWindow.hidden = true;

    activeFolder.hidden = true;

    currentFolder = null;

  }


  // OPEN IMAGE PREVIEW

  function openLightbox(image, title) {

    $("#lightbox-image").src = image;

    $("#lightbox-caption").textContent = title;

    lightbox.hidden = false;

  }


  // CLOSE IMAGE PREVIEW

  function closeLightbox() {

    lightbox.hidden = true;

    $("#lightbox-image").removeAttribute("src");

  }


  // EVENT HANDLING

  document.addEventListener("click", event => {

    const folderButton =
      event.target.closest("[data-open]");

    if (folderButton) {

      openFolder(folderButton.dataset.open);

      return;

    }


    const filterButton =
      event.target.closest("[data-filter]");

    if (filterButton && currentFolder) {

      currentFilter = filterButton.dataset.filter;

      renderWindow();

      return;

    }


    const imageButton =
      event.target.closest("[data-image]");

    if (imageButton) {

      openLightbox(
        imageButton.dataset.image,
        imageButton.dataset.title
      );

    }

  });


  // WINDOW BUTTONS

  $("#close-button").addEventListener(
    "click",
    closeWindow
  );


  $("#minimize-button").addEventListener(
    "click",
    () => {

      appWindow.hidden = true;

    }
  );


  $("#maximize-button").addEventListener(
    "click",
    () => {

      appWindow.classList.toggle("maximized");

      appWindow.style.left = "";
      appWindow.style.top = "";
      appWindow.style.transform = "";

    }
  );


  $("#back-button").addEventListener(
    "click",
    closeWindow
  );


  // START BUTTON

  $("#start-button").addEventListener(
    "click",
    () => {

      closeLightbox();
      closeWindow();

    }
  );


  $("#home-button").addEventListener(
    "click",
    () => {

      closeLightbox();
      closeWindow();

    }
  );


  // RESTORE MINIMIZED WINDOW

  activeFolder.addEventListener(
    "click",
    () => {

      if (currentFolder) {
        appWindow.hidden = false;
      }

    }
  );


  // LIGHTBOX CONTROLS

  $("#lightbox-close").addEventListener(
    "click",
    closeLightbox
  );


  lightbox.addEventListener(
    "click",
    event => {

      if (event.target === lightbox) {
        closeLightbox();
      }

    }
  );


  // ESC KEY

  window.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") return;

      if (!lightbox.hidden) {

        closeLightbox();

      }

      else {

        closeWindow();

      }

    }
  );


  // DRAGGABLE WINDOW

  const windowHeader = $("#window-header");

  windowHeader.addEventListener(
    "pointerdown",
    event => {

      if (event.target.closest("button")) return;

      if (window.innerWidth <= 700) return;

      if (appWindow.classList.contains("maximized")) return;

      const rect = appWindow.getBoundingClientRect();

      const parent = screen.getBoundingClientRect();

      drag = {

        x: event.clientX,

        y: event.clientY,

        left: rect.left - parent.left,

        top: rect.top - parent.top

      };

      windowHeader.setPointerCapture(event.pointerId);

    }
  );


  windowHeader.addEventListener(
    "pointermove",
    event => {

      if (!drag) return;

      const left = Math.max(
        0,
        Math.min(
          screen.clientWidth - appWindow.offsetWidth,
          drag.left + event.clientX - drag.x
        )
      );

      const top = Math.max(
        32,
        Math.min(
          screen.clientHeight - appWindow.offsetHeight - 28,
          drag.top + event.clientY - drag.y
        )
      );

      appWindow.style.transform = "none";

      appWindow.style.left = `${left}px`;

      appWindow.style.top = `${top}px`;

    }
  );


  windowHeader.addEventListener(
    "pointerup",
    () => {
      drag = null;
    }
  );


  windowHeader.addEventListener(
    "pointercancel",
    () => {
      drag = null;
    }
  );


  // LIVE CLOCK

  function updateClock() {

    $("#clock").textContent =
      new Intl.DateTimeFormat("en-US", {

        hour: "2-digit",

        minute: "2-digit",

        hour12: false

      }).format(new Date());

  }


  // START APPLICATION

  renderDesktop();

  updateClock();

  setInterval(updateClock, 30000);

})();
