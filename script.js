function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseEventDate(event) {
  return new Date(`${event.date || ""}T${event.startTime || "00:00"}:00`);
}

function getEventStartEnd(event) {
  const start = parseEventDate(event);
  const [endHourRaw, endMinuteRaw] = (event.endTime || event.startTime || "23:59").split(":");
  const end = new Date(start);
  end.setHours(Number(endHourRaw), Number(endMinuteRaw || "0"), 0, 0);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
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
  const start = formatTime(event.startTime);
  const end = formatTime(event.endTime);
  return start && end ? `${start} - ${end}` : start || end;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatICSDateLocal(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
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
  const description = event.isPrivate ? "Mic Drop Karaoke is booked for a private event." : (event.description || "Join Mic Drop Karaoke for an upcoming event.");
  const uidSafeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mic Drop Karaoke//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.date}-${uidSafeTitle}@mic-drop-events.com`,
    `DTSTAMP:${now}`,
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
  const googleDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title || "Mic Drop Karaoke Event",
    dates: `${googleDate(start)}/${googleDate(end)}`,
    details: `${event.description || "Join Mic Drop Karaoke for an upcoming event."}\n\nMore info: https://mic-drop-events.com`,
    location: event.isPrivate ? "" : (event.location || "")
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getVenueLogo(event) {
  const haystack = `${event.title || ""} ${event.location || ""}`.toLowerCase();
  if (haystack.includes("audacious")) return { src: "audacious-aleworks-logo.jpg", alt: "Audacious Aleworks logo" };
  if (haystack.includes("clare")) return { src: "clare-dons-logo.png", alt: "Clare and Don's Beach Shack logo" };
  return null;
}

function createCalendarButtons(event) {
  if (!event || !event.date || event.isPrivate) return "";
  return `
    <div class="calendar-actions">
      <a class="calendar-button" href="${createGoogleCalendarUrl(event)}" target="_blank" rel="noopener">Add to Google Calendar</a>
      <a class="calendar-button secondary-calendar" href="${createICSDataUrl(event)}" download="${escapeHtml(`${event.date}-mic-drop-karaoke.ics`)}">Apple / Outlook</a>
      ${event.mapUrl ? `<a class="calendar-button secondary-calendar" href="${escapeHtml(event.mapUrl)}" target="_blank" rel="noopener">Map</a>` : ""}
      ${event.venueUrl ? `<a class="calendar-button secondary-calendar" href="${escapeHtml(event.venueUrl)}" target="_blank" rel="noopener">Venue</a>` : ""}
    </div>`;
}

function renderEvents() {
  const container = document.getElementById("events-list");
  if (!container || typeof UPCOMING_EVENTS === "undefined") return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const events = UPCOMING_EVENTS.filter((event) => event && event.date && parseEventDate(event) >= today).sort((a, b) => parseEventDate(a) - parseEventDate(b));
  if (!events.length) return;
  container.innerHTML = events.map((event) => {
    const logo = getVenueLogo(event);
    const location = event.isPrivate ? "" : (event.location || "");
    const description = event.isPrivate ? "Mic Drop Karaoke is booked for a private event." : (event.description || "");
    return `<article class="event-card"><div class="event-date">${escapeHtml(formatDate(event.date))}</div><div><div class="event-branding">${logo ? `<img class="event-logo" src="${escapeHtml(logo.src)}" alt="${escapeHtml(logo.alt)}" />` : ""}<div><h3>${escapeHtml(event.title || "Mic Drop Karaoke Event")}</h3>${formatEventTime(event) ? `<p class="event-time">${escapeHtml(formatEventTime(event))}</p>` : ""}${location ? `<p class="event-location">${escapeHtml(location)}</p>` : ""}${description ? `<p class="event-description">${escapeHtml(description)}</p>` : ""}</div></div>${event.isPrivate ? '<span class="private-pill">Booked</span>' : createCalendarButtons(event)}</div></article>`;
  }).join("");
}

function renderReviews() {
  const container = document.getElementById("reviews-list");
  if (!container) return;
  if (typeof APPROVED_REVIEWS === "undefined" || !APPROVED_REVIEWS.length) {
    container.innerHTML = '<p class="muted">Approved reviews will appear here soon.</p>';
    return;
  }
  const reviews = APPROVED_REVIEWS.length > 1 ? [...APPROVED_REVIEWS, ...APPROVED_REVIEWS] : [...APPROVED_REVIEWS];
  container.innerHTML = reviews.map((review) => `<article class="review-card"><div class="review-stars" aria-label="${review.rating || 5} out of 5 stars">${"★".repeat(Math.max(1, Math.min(5, Number(review.rating || 5))))}</div><blockquote>“${escapeHtml(review.quote || "" )}”</blockquote><div class="review-author">${escapeHtml(review.name || "Mic Drop Karaoke Customer")}</div><div class="review-type">${escapeHtml(review.eventType || "")}</div></article>`).join("");
}

function setupReviewAutoScroll() {
  const track = document.getElementById("reviews-list");
  if (!track || typeof APPROVED_REVIEWS === "undefined" || APPROVED_REVIEWS.length <= 1) return;
  let offset = 0;
  let paused = false;
  const step = () => {
    if (!paused) {
      offset -= 0.45;
      if (Math.abs(offset) >= track.scrollWidth / 2) offset = 0;
      track.style.transform = `translateX(${offset}px)`;
    }
    window.requestAnimationFrame(step);
  };
  ["mouseenter", "focusin", "touchstart", "pointerdown"].forEach((event) => track.addEventListener(event, () => paused = true, { passive: true }));
  ["mouseleave", "focusout", "touchend", "pointerup"].forEach((event) => track.addEventListener(event, () => paused = false, { passive: true }));
  window.addEventListener("resize", () => { offset = 0; track.style.transform = "translateX(0)"; });
  window.requestAnimationFrame(step);
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
      const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } });
      if (response.ok) {
        form.reset();
        status.textContent = successMessage;
        status.className = "form-status success";
      } else throw new Error("Form submission failed");
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
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));
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
