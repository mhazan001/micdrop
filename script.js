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

function getEventStartEnd(event) {
  const start = parseEventDate(event);
  const endTime = event.endTime || event.startTime || "23:59";
  const [endHourRaw, endMinuteRaw] = endTime.split(":");
  const end = new Date(start);
  end.setHours(Number(endHourRaw), Number(endMinuteRaw || "0"), 0, 0);

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return { start, end };
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

  if (hour === 0 && minute === 0) return "12 AM";

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

function padCalendarNumber(value) {
  return String(value).padStart(2, "0");
}

function formatICSDateLocal(date) {
  return [
    date.getFullYear(),
    padCalendarNumber(date.getMonth() + 1),
    padCalendarNumber(date.getDate())
  ].join("") + "T" + [
    padCalendarNumber(date.getHours()),
    padCalendarNumber(date.getMinutes()),
    "00"
  ].join("");
}

function cleanICSValue(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;")
    .replaceAll("\n", "\\n");
}

function createICSContent(event) {
  const { start, end } = getEventStartEnd(event);
  const title = event.title || "Mic Drop Karaoke Event";
  const location = event.isPrivate ? "" : (event.location || "");
  const description = event.isPrivate
    ? "Mic Drop Karaoke is booked for a private event."
    : (event.description || "Join Mic Drop Karaoke for an upcoming event.");

  const uidSafeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const uid = `${event.date}-${uidSafeTitle}@mic-drop-events.com`;
  const now = new Date();

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mic Drop Karaoke//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=America/New_York:${formatICSDateLocal(start)}`,
    `DTEND;TZID=America/New_York:${formatICSDateLocal(end)}`,
    `SUMMARY:${cleanICSValue(title)}`,
    `LOCATION:${cleanICSValue(location)}`,
    `DESCRIPTION:${cleanICSValue(description + "\n\nMore info: https://mic-drop-events.com")}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function createICSDataUrl(event) {
  return `data:text/calendar;charset=utf8,${encodeURIComponent(createICSContent(event))}`;
}

function createGoogleCalendarUrl(event) {
  const { start, end } = getEventStartEnd(event);
  const title = event.title || "Mic Drop Karaoke Event";
  const location = event.isPrivate ? "" : (event.location || "");
  const description = event.isPrivate
    ? "Mic Drop Karaoke is booked for a private event."
    : (event.description || "Join Mic Drop Karaoke for an upcoming event.");

  function googleDate(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${googleDate(start)}/${googleDate(end)}`,
    details: `${description}\n\nMore info: https://mic-drop-events.com`,
    location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function createCalendarButtons(event) {
  if (!event || !event.date || event.isPrivate) return "";

  const safeFileName = `${event.date}-mic-drop-karaoke.ics`;
  return `
    <div class="calendar-actions">
      <a class="calendar-button" href="${createGoogleCalendarUrl(event)}" target="_blank" rel="noopener">Add to Google Calendar</a>
      <a class="calendar-button secondary-calendar" href="${createICSDataUrl(event)}" download="${escapeHtml(safeFileName)}">Apple / Outlook</a>
    </div>
  `;
}

function renderEvents() {
  const container = document.getElementById("events-list");
  if (!container) return;

  if (typeof UPCOMING_EVENTS === "undefined" || !Array.isArray(UPCOMING_EVENTS)) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = UPCOMING_EVENTS
    .filter((event) => event && event.date && parseEventDate(event) >= today)
    .sort((a, b) => parseEventDate(a) - parseEventDate(b));

  if (!events.length) return;

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
          ${event.isPrivate ? '<span class="private-pill">Booked</span>' : createCalendarButtons(event)}
        </div>
      </article>
    `;
  }).join("");
}

function renderReviews() {
  const container = document.getElementById("reviews-list");
  if (!container) return;

  if (typeof APPROVED_REVIEWS === "undefined" || !Array.isArray(APPROVED_REVIEWS) || !APPROVED_REVIEWS.length) return;

  const reviewsToRender = APPROVED_REVIEWS.length > 1
    ? [...APPROVED_REVIEWS, ...APPROVED_REVIEWS]
    : [...APPROVED_REVIEWS];

  container.innerHTML = reviewsToRender.map((review) => {
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

function setupReviewAutoScroll() {
  const container = document.getElementById("reviews-list");
  if (!container) return;
  if (typeof APPROVED_REVIEWS === "undefined" || !Array.isArray(APPROVED_REVIEWS)) return;
  if (APPROVED_REVIEWS.length <= 1) return;

  let isPaused = false;
  let animationFrameId = null;
  const speed = 0.35;

  function pauseScroll() {
    isPaused = true;
    container.classList.add("is-paused");
  }

  function resumeScroll() {
    isPaused = false;
    container.classList.remove("is-paused");
  }

  function step() {
    if (!isPaused) {
      container.scrollLeft += speed;
      const halfwayPoint = container.scrollWidth / 2;
      if (container.scrollLeft >= halfwayPoint) {
        container.scrollLeft = 0;
      }
    }
    animationFrameId = window.requestAnimationFrame(step);
  }

  container.addEventListener("mouseenter", pauseScroll);
  container.addEventListener("mouseleave", resumeScroll);
  container.addEventListener("focusin", pauseScroll);
  container.addEventListener("focusout", resumeScroll);
  container.addEventListener("touchstart", pauseScroll, { passive: true });
  container.addEventListener("touchend", resumeScroll, { passive: true });
  container.addEventListener("pointerdown", pauseScroll);
  container.addEventListener("pointerup", resumeScroll);

  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = window.requestAnimationFrame(step);
}
function setupAjaxForm(formId, statusId, successMessage) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
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
        status.textContent = successMessage;
        status.className = "form-status success";
      } else {
        status.textContent = "Something went wrong. Please try again.";
        status.className = "form-status error";
      }
    } catch (error) {
      status.textContent = "Something went wrong. Please try again.";
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
  setupReviewAutoScroll();
  setupAjaxForm("booking-form", "form-status", "Thanks! Your booking request was sent.");
  setupAjaxForm("review-form", "review-status", "Thanks! Your review was submitted for approval.");
  setupMobileNav();
}

document.addEventListener("DOMContentLoaded", initSite);
