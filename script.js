// Background form sending setup:
// 1) Create a free form endpoint at Formspree, Static Forms, Getform, etc.
// 2) Replace the placeholder below with your endpoint URL.
// Example Formspree endpoint format: https://formspree.io/f/xxxxxxxx
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

const form = document.querySelector("#booking-form");
const status = document.querySelector("#form-status");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!FORM_ENDPOINT || FORM_ENDPOINT === "PASTE_YOUR_FORM_ENDPOINT_HERE") {
    status.textContent = "Form endpoint is not connected yet. Replace FORM_ENDPOINT in script.js with your form service endpoint.";
    return;
  }

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
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form service rejected the submission.");
    }

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
