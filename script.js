// Background form sending setup. This sends booking requests and review submissions to Formspree.
const FORM_ENDPOINT = "https://formspree.io/f/xwvaglkv";

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("[data-package]").forEach((button) => {
  button.addEventListener("click", () => {
    const packageSelect = document.querySelector('select[name="package"]');
    if (packageSelect) packageSelect.value = button.dataset.package;
    document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" });
  });
});

function setupAjaxForm(formSelector, statusSelector, successMessage) {
  const form = document.querySelector(formSelector);
  const status = document.querySelector(statusSelector);
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent || "Submit";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    status.textContent = "Sending...";

    try {
      const data = new FormData(form);
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Form service rejected the submission.");

      form.reset();
      status.textContent = successMessage;
    } catch (error) {
      console.error(error);
      status.textContent = "Sorry, this could not be sent. Please try again or contact us directly.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}

setupAjaxForm(
  "#booking-form",
  "#form-status",
  "Thanks! Your booking request was sent. We’ll get back to you soon."
);

setupAjaxForm(
  "#review-form",
  "#review-status",
  "Thank you! Your review was sent and will be reviewed before posting."
);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseEventDate(event) {
  const time = event.startTime ? `${event.startTime}:00` : "00:00:00";
  return new Date(`${event.date}T${time}`);
}

function isFutureOrToday(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(`${event.date}T00:00:00`);
  return eventDate >= today;
}

function formatEventDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    year: date.toLocaleDateString("en-US", { year: "numeric" }),
    long: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  };
}

function formatTime(timeValue) {
  if (!timeValue) return "";
  const [hours, minutes] = timeValue.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes || 0, 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatEventTime(event) {
  if (!event.startTime) return "Time TBD";
  const start = formatTime(event.startTime);
  const end = formatTime(event.endTime);
  return end ? `${start} – ${end}` : start;
}

function renderEvents() {
  const list = document.getElementById("events-list");
  const empty = document.getElementById("events-empty");
  if (!list) return;

  const sourceEvents = (typeof UPCOMING_EVENTS !== "undefined") ? UPCOMING_EVENTS : [];
  const events = sourceEvents
    .filter(isFutureOrToday)
    .sort((a, b) => parseEventDate(a) - parseEventDate(b));

  list.innerHTML = "";

  if (!events.length) {
    empty?.classList.remove("hidden");
    return;
  }

  empty?.classList.add("hidden");

  events.forEach((event) => {
    const dateParts = formatEventDate(event.date);
    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-date-badge" aria-hidden="true">
        <span class="month">${escapeHtml(dateParts.month)}</span>
        <span class="day">${escapeHtml(dateParts.day)}</span>
        <span class="year">${escapeHtml(dateParts.year)}</span>
      </div>
      <div class="event-details">
        <h3>${escapeHtml(event.title || "Mic Drop Karaoke Event")}</h3>
        <p class="event-meta">${escapeHtml(dateParts.long)} · ${escapeHtml(formatEventTime(event))}${event.location ? ` · ${escapeHtml(event.location)}` : ""}</p>
        ${event.description ? `<p class="event-description">${escapeHtml(event.description)}</p>` : ""}
        ${event.isPrivate ? `<span class="event-pill">Private / Booked</span>` : `<span class="event-pill">Public Event</span>`}
      </div>
    `;
    list.appendChild(card);
  });
}

function renderReviews() {
  const list = document.getElementById("reviews-list");
  if (!list) return;

  const reviews = (typeof APPROVED_REVIEWS !== "undefined") ? APPROVED_REVIEWS : [];
  list.innerHTML = "";

  reviews.forEach((review) => {
    const rating = Number(review.rating || 5);
    const stars = "★".repeat(Math.max(1, Math.min(5, rating)));
    const block = document.createElement("blockquote");
    block.innerHTML = `
      <p>“${escapeHtml(review.quote)}”</p>
      <p class="stars" aria-label="${rating} out of 5 stars">${stars}</p>
      <footer>${escapeHtml(review.name)} <span>${escapeHtml(review.eventType || "Mic Drop Karaoke Event")}</span></footer>
    `;
    list.appendChild(block);
  });
}

renderEvents();
renderReviews();
