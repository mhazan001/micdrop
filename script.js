// Change this to the email address where booking requests should go.
const BOOKING_EMAIL = "mark.hazan@gmail.com";

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
  });
});

const form = document.querySelector("#booking-form");
const status = document.querySelector("#form-status");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `Booking Request: ${data.get("eventType") || "Karaoke Event"}`;
  const body = [
    "Mic Drop Karaoke booking request:",
    "",
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Phone: ${data.get("phone")}`,
    `Event Type: ${data.get("eventType")}`,
    `Preferred Package: ${data.get("package") || "Not sure yet"}`,
    `Event Date: ${data.get("date")}`,
    `Location / Venue: ${data.get("location")}`,
    "",
    "Event Details / Special Requests:",
    `${data.get("details") || "None provided"}`
  ].join("\n");

  const mailto = `mailto:${encodeURIComponent(BOOKING_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  status.textContent = "Your email app should open with the booking request. If it does not, update the email address in script.js or connect a form service such as Formspree.";
});
