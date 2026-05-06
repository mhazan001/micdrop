function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseEventDate(event) {
  const date = event.date || "";
  const time = event.startTime || "00:00";
  return new Date(`${date}T${time}:00`);
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(timeString) {
  if (!timeString) return "";
  const [hourRaw, minuteRaw] = timeString.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw || "0");

  if (hour === 0 && minute === 0) {
    return "12 AM";
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: minute === 0 ? undefined : "2-digit"
  });
}

function formatEventTime(event) {
  if (!event.startTime && !event.endTime) return "";
  const start = formatTime(event.startTime);
  const end = formatTime(event.endTime);
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function renderEvents() {
  const container = document.getElementById("events-list");
  if (!container) return;

  if (typeof UPCOMING_EVENTS === "undefined" || !Array.isArray(UPCOMING_EVENTS)) {
    container.innerHTML = '<p class="muted">No events are configured yet. Edit sitedata.js to add events.</p>';
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = UPCOMING_EVENTS
    .filter((event) => event && event.date && parseEventDate(event) >= today)
    .sort((a, b) => parseEventDate(a) - parseEventDate(b));

  if (!events.length) {
    container.innerHTML = '<p class="muted">No upcoming events listed right now. Check back soon.</p>';
    return;
  }

  container.innerHTML = events.map((event) => {
    const location = event.isPrivate ? "" : (event.location || "");
    const description = event.isPrivate
      ? "Mic Drop Karaoke is booked for a private event."
      : (event.description || "");

    return `
      <article class="event-card">
        <div class="event-date">${escapeHtml(formatDate(event.date))}</div>
        <div>
          <h3>${escapeHtml(event.title || "Mic Drop Karaoke Event")}</h3>
          ${formatEventTime(event) ? `<p class="event-time">${escapeHtml(formatEventTime(event))}</p>` : ""}
          ${location ? `<p class="event-location">${escapeHtml(location)}</p>` : ""}
          ${description ? `<p class="event-description">${escapeHtml(description)}</p>` : ""}
          ${event.isPrivate ? '<span class="private-pill">Booked</span>' : ""}
        </div>
      </article>
    `;
  }).join("");
}

function renderReviews() {
  const container = document.getElementById("reviews-list");
  if (!container) return;

  if (typeof APPROVED_REVIEWS === "undefined" || !Array.isArray(APPROVED_REVIEWS) || !APPROVED_REVIEWS.length) {
    container.innerHTML = '<p class="muted">Reviews coming soon.</p>';
    return;
  }

  container.innerHTML = APPROVED_REVIEWS.map((review) => {
    const rating = Number(review.rating || 5);
    const stars = "★".repeat(Math.max(1, Math.min(5, rating)));
    return `
      <article class="review-card">
        <div class="review-stars" aria-label="${rating} out of 5 stars">${stars}</div>
        <blockquote>“${escapeHtml(review.quote || "")}”</blockquote>
        <div class="review-author">${escapeHtml(review.name || "Mic Drop Karaoke Customer")}</div>
        <div class="review-type">${escapeHtml(review.eventType || "")}</div>
      </article>
    `;
  }).join("");
}

function setupBookingForm() {
  const form = document.getElementById("booking-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Sending...";
    status.className = "form-status";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        form.reset();
        status.textContent = "Thanks! Your booking request was sent.";
        status.className = "form-status success";
      } else {
        status.textContent = "Something went wrong. Please try again or email us directly.";
        status.className = "form-status error";
      }
    } catch (error) {
      status.textContent = "Something went wrong. Please try again or email us directly.";
      status.className = "form-status error";
    }
  });
}

function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function initSite() {
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  renderEvents();
  renderReviews();
  setupBookingForm();
  setupMobileNav();
}

document.addEventListener("DOMContentLoaded", initSite);
