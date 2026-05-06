// Mic Drop Karaoke site behavior
// This file reads editable data from sitedata.js:
// - UPCOMING_EVENTS
// - APPROVED_REVIEWS
// - SMUGMUG_SLIDESHOW

const FORM_ENDPOINT = "https://formspree.io/f/xwvaglkv";

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("#site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-package]").forEach((button) => {
  button.addEventListener("click", () => {
    const packageSelect = document.querySelector('select[name="package"]');
    if (packageSelect) packageSelect.value = button.dataset.package;
    document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" });
  });
});

const form = document.querySelector("#booking-form");
const status = document.querySelector("#form-status");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  status.textContent = "Sending your booking request...";

  try {
    const data = new FormData(form);

    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Form service rejected the submission.");

    form.reset();
    status.textContent = "Thanks! Your booking request was sent. We’ll get back to you soon.";
  } catch (error) {
    console.error(error);
    status.textContent = "Sorry, the form could not be sent. Please try again or email us directly.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

function parseEventDate(event) {
  const [year, month, day] = event.date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatEventDate(dateString) {
  const date = parseEventDate({ date: dateString });
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    year: date.toLocaleDateString("en-US", { year: "numeric" }),
    full: date.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })
  };
}

function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes || 0, 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatEventTime(event) {
  if (!event.startTime && !event.endTime) return "Time TBD";
  if (event.startTime && !event.endTime) return formatTime(event.startTime);
  return `${formatTime(event.startTime)} – ${formatTime(event.endTime)}`;
}

function isFutureOrToday(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = parseEventDate(event);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

function renderUpcomingEvents() {
  const list = document.getElementById("events-list");
  const empty = document.getElementById("events-empty");
  if (!list) return;

  const events = Array.isArray(window.UPCOMING_EVENTS || UPCOMING_EVENTS)
    ? (window.UPCOMING_EVENTS || UPCOMING_EVENTS)
    : [];

  const upcoming = events
    .filter((event) => event.date && isFutureOrToday(event))
    .sort((a, b) => parseEventDate(a) - parseEventDate(b));

  list.innerHTML = "";

  if (!upcoming.length) {
    empty?.classList.remove("hidden");
    return;
  }

  empty?.classList.add("hidden");

  upcoming.forEach((event) => {
    const dateParts = formatEventDate(event.date);
    const title = event.isPrivate ? "Booked — Private Event" : event.title;
    const location = event.isPrivate ? "" : event.location;
    const description = event.isPrivate
      ? "Mic Drop Karaoke is booked for a private event."
      : event.description;

    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-date-badge" aria-hidden="true">
        <span class="month">${dateParts.month}</span>
        <span class="day">${dateParts.day}</span>
        <span class="year">${dateParts.year}</span>
      </div>
      <div class="event-details">
        <h3>${title || "Mic Drop Karaoke Event"}</h3>
        <p class="event-meta">${dateParts.full} · ${formatEventTime(event)}${location ? ` · ${location}` : ""}</p>
        ${description ? `<p class="event-description">${description}</p>` : ""}
      </div>
    `;
    list.appendChild(card);
  });
}

function renderReviews() {
  const container = document.getElementById("reviews-list");
  if (!container) return;

  const reviews = Array.isArray(window.APPROVED_REVIEWS || APPROVED_REVIEWS)
    ? (window.APPROVED_REVIEWS || APPROVED_REVIEWS)
    : [];

  container.innerHTML = "";

  reviews.forEach((review) => {
    const stars = "★".repeat(review.rating || 5);
    const block = document.createElement("blockquote");
    block.innerHTML = `
      <p class="stars" aria-label="${review.rating || 5} star review">${stars}</p>
      <p>“${review.quote}”</p>
      <footer>${review.name || "Guest"} <span>${review.eventType || "Event"}</span></footer>
    `;
    container.appendChild(block);
  });
}

function renderSmugMugSlideshow() {
  const container = document.getElementById("smugmug-slideshow");
  const title = document.getElementById("photos-title");
  const subtitle = document.getElementById("photos-subtitle");

  if (!container) return;

  const config = window.SMUGMUG_SLIDESHOW || (typeof SMUGMUG_SLIDESHOW !== "undefined" ? SMUGMUG_SLIDESHOW : null);

  if (!config || !config.enabled || !config.embedUrl) {
    container.innerHTML = `<div class="events-state"><h3>Photo slideshow coming soon</h3><p>Add your SmugMug slideshow settings in sitedata.js.</p></div>`;
    return;
  }

  if (title && config.title) title.textContent = config.title;
  if (subtitle && config.subtitle) subtitle.textContent = config.subtitle;

  container.innerHTML = `
    <iframe
      src="${config.embedUrl}"
      title="Mic Drop Karaoke photo slideshow"
      width="800"
      height="600"
      frameborder="0"
      scrolling="no"
      allowfullscreen>
    </iframe>
  `;
}

renderUpcomingEvents();
renderReviews();
renderSmugMugSlideshow();
