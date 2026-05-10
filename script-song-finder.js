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
    .replaceAll(",", "\,")
    .replaceAll(";", "\;")
    .replaceAll("\n", "\n");
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

function frequencyToMidi(frequency) {
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function midiToNoteName(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${names[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

function detectPitch(buffer, sampleRate) {
  let rms = 0;
  for (const sample of buffer) rms += sample * sample;
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.006) return null;

  const minTau = Math.floor(sampleRate / 900);
  const maxTau = Math.min(Math.floor(sampleRate / 65), buffer.length - 1);
  const differences = new Float32Array(maxTau + 1);

  for (let tau = minTau; tau <= maxTau; tau++) {
    let difference = 0;
    for (let i = 0; i < buffer.length - tau; i++) {
      const delta = buffer[i] - buffer[i + tau];
      difference += delta * delta;
    }
    differences[tau] = difference;
  }

  let runningTotal = 0;
  let bestTau = -1;
  let bestValue = 1;
  for (let tau = minTau; tau <= maxTau; tau++) {
    runningTotal += differences[tau];
    if (!runningTotal) continue;
    const value = differences[tau] * tau / runningTotal;
    if (value < 0.22 && value < bestValue) {
      bestValue = value;
      bestTau = tau;
      while (tau + 1 <= maxTau && differences[tau + 1] < differences[tau]) tau++;
      break;
    }
  }

  if (bestTau < 0) return null;
  const before = differences[bestTau - 1] || differences[bestTau];
  const current = differences[bestTau];
  const after = differences[bestTau + 1] || differences[bestTau];
  const adjustment = (after - before) / (2 * (2 * current - before - after));
  const tau = Number.isFinite(adjustment) ? bestTau + adjustment : bestTau;
  return sampleRate / tau;
}

function getSpectrumValue(data, bin) {
  const low = Math.floor(bin);
  const high = Math.ceil(bin);
  if (low < 0 || high >= data.length) return 0;
  return data[low] + (data[high] - data[low]) * (bin - low);
}

function detectSpectralPitch(data, sampleRate) {
  const binHz = sampleRate / (data.length * 2);
  let bestMidi = null;
  let bestScore = 0;

  for (let midi = 35; midi <= 84; midi += 0.5) {
    const frequency = midiToFrequency(midi);
    let score = 0;
    for (let harmonic = 1; harmonic <= 6; harmonic++) {
      const harmonicFrequency = frequency * harmonic;
      if (harmonicFrequency > 1800) break;
      score += getSpectrumValue(data, harmonicFrequency / binHz) / harmonic;
    }
    score -= Math.max(0, frequency - 500) * 0.015;
    if (score > bestScore) {
      bestScore = score;
      bestMidi = midi;
    }
  }

  return bestScore > 18 && bestMidi ? midiToFrequency(Math.round(bestMidi)) : null;
}

function getStableMidi(readings) {
  const useful = readings
    .filter((midi) => midi >= 35 && midi <= 85)
    .sort((a, b) => a - b);
  if (!useful.length) return null;
  return useful[Math.floor(useful.length / 2)];
}

function adjustLikelyOctave(kind, midi, captured) {
  if (kind === "high" && captured.low && midi - captured.low < 10 && midi + 12 <= 85) {
    return midi + 12;
  }
  if (kind === "low" && captured.high && captured.high - midi < 10 && midi - 12 >= 35) {
    return midi - 12;
  }
  return midi;
}

function scoreSongForRange(song, lowMidi, highMidi) {
  const missedLowNotes = Math.max(0, lowMidi - song.low);
  const missedHighNotes = Math.max(0, song.high - highMidi);
  const userRange = highMidi - lowMidi;
  const songRange = song.high - song.low;
  const exactFitBonus = song.low >= lowMidi && song.high <= highMidi ? 40 : 0;
  const closeFitBonus = song.low >= lowMidi - 2 && song.high <= highMidi + 2 ? 18 : 0;
  return 100 + exactFitBonus + closeFitBonus - missedLowNotes * 14 - missedHighNotes * 18 - Math.abs(songRange - userRange) * 1.5;
}

function renderSongMatches(lowMidi, highMidi) {
  const results = document.getElementById("song-results");
  if (!results || typeof KARAFUN_SONG_SUGGESTIONS === "undefined") return;
  if (highMidi - lowMidi < 10) {
    results.innerHTML = '<article class="song-card"><div><h3>Try one more capture</h3><p>Your captured range is very narrow, so song matches would be unreliable. Sing your highest comfortable note again and hold it a little longer.</p></div><span>Retest</span></article>';
    return false;
  }
  const sorted = KARAFUN_SONG_SUGGESTIONS
    .map((song) => ({ ...song, score: scoreSongForRange(song, lowMidi, highMidi) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  results.innerHTML = sorted.map((song) => {
    const fit = song.low >= lowMidi && song.high <= highMidi
      ? "Best fit"
      : song.low >= lowMidi - 2 && song.high <= highMidi + 2
        ? "Close fit"
        : "Key change likely";
    return `<article class="song-card"><div><h3>${escapeHtml(song.title)}</h3><p>${escapeHtml(song.artist)}</p></div><span>${escapeHtml(song.vibe)}</span><small>${midiToNoteName(song.low)} - ${midiToNoteName(song.high)} · ${fit}</small></article>`;
  }).join("");
  return sorted.some((song) => song.low >= lowMidi && song.high <= highMidi);
}

function setupSongFinder() {
  const lowButton = document.getElementById("capture-low");
  const highButton = document.getElementById("capture-high");
  const lowOutput = document.getElementById("low-note-output");
  const highOutput = document.getElementById("high-note-output");
  const status = document.getElementById("song-finder-status");
  const level = document.getElementById("pitch-level");
  if (!lowButton || !highButton || !lowOutput || !highOutput || !status) return;

  const captured = { low: null, high: null };

  async function capture(kind) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = "Microphone capture needs the live HTTPS site and a browser that allows mic access.";
      status.className = "form-status error";
      return;
    }

    const button = kind === "low" ? lowButton : highButton;
    button.disabled = true;
    status.textContent = kind === "low" ? "Listening for your lowest comfortable note..." : "Listening for your highest comfortable note...";
    status.className = "form-status";

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("AudioContext is not available");
      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 8192;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      const data = new Float32Array(analyser.fftSize);
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      const readings = [];
      const start = performance.now();

      await new Promise((resolve) => {
        function tick(now) {
          analyser.getFloatTimeDomainData(data);
          analyser.getByteFrequencyData(frequencyData);
          const frequency = detectPitch(data, audioContext.sampleRate) || detectSpectralPitch(frequencyData, audioContext.sampleRate);
          if (frequency) {
            const midi = frequencyToMidi(frequency);
            readings.push(midi);
            (kind === "low" ? lowOutput : highOutput).textContent = midiToNoteName(midi);
            if (level) level.style.width = `${Math.min(100, Math.max(8, (frequency / 8)))}%`;
          }
          if (now - start < 3200) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });

      await audioContext.close();
      const rawMidi = getStableMidi(readings);
      if (!rawMidi) throw new Error("No steady note detected");
      const midi = adjustLikelyOctave(kind, rawMidi, captured);
      captured[kind] = midi;
      lowOutput.textContent = captured.low ? midiToNoteName(captured.low) : "Not captured";
      highOutput.textContent = captured.high ? midiToNoteName(captured.high) : "Not captured";
      status.textContent = captured.low && captured.high ? "Captured. Ranking songs by how closely they match your range." : "Captured. Now record the other end of your range.";
      status.className = "form-status success";
      if (captured.low && captured.high) {
        const low = Math.min(captured.low, captured.high);
        const high = Math.max(captured.low, captured.high);
        const hasExactFit = renderSongMatches(low, high);
        status.textContent = high - low < 10
          ? "That captured range is too narrow for useful song picks. Try the high note again."
          : hasExactFit
            ? "Nice. These songs fit inside your captured range."
            : "These are the closest matches. Songs marked key change likely may need a different key.";
        status.className = high - low < 10 ? "form-status error" : "form-status success";
      }
    } catch (error) {
      status.textContent = "I couldn't lock onto the pitch. Try holding a louder, steady “ah” close to the microphone.";
      status.className = "form-status error";
    } finally {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      button.disabled = false;
      if (level) level.style.width = "0";
    }
  }

  lowButton.addEventListener("click", () => capture("low"));
  highButton.addEventListener("click", () => capture("high"));
}

function initSite() {
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
  renderEvents();
  renderReviews();
  setupReviewAutoScroll();
  setupAjaxForm("booking-form", "form-status", "Thanks! Your booking request was sent.");
  setupAjaxForm("review-form", "review-status", "Thanks! Your review was submitted for approval.");
  setupSongFinder();
  setupMobileNav();
}

document.addEventListener("DOMContentLoaded", initSite);
