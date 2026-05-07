const fs = require("fs");

const SITE_DATA_FILE = "sitedata.js";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function getEnv(name) {
  return process.env[name] || "";
}

function extractField(body, fieldName) {
  const pattern = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+)`, "i");
  const match = body.match(pattern);
  return match ? match[1].trim() : "";
}

function extractReviewText(body) {
  const marker = "## Review";
  const markerIndex = body.indexOf(marker);

  if (markerIndex === -1) {
    return "";
  }

  const afterMarker = body.slice(markerIndex + marker.length);
  const separatorIndex = afterMarker.indexOf("---");
  const reviewText = separatorIndex === -1
    ? afterMarker
    : afterMarker.slice(0, separatorIndex);

  return reviewText.trim();
}

function toSafeRating(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 5;
  return Math.max(1, Math.min(5, Math.round(rating)));
}

function makeReviewObject({ name, eventType, rating, quote, issueUrl }) {
  return {
    name: name || "Mic Drop Karaoke Guest",
    eventType: eventType || "Karaoke Event",
    rating: toSafeRating(rating),
    quote: quote || "Great Mic Drop Karaoke experience.",
    sourceIssue: issueUrl || ""
  };
}

function formatReviewBlock(review) {
  const lines = [
    "  {",
    `    name: ${JSON.stringify(review.name)},`,
    `    eventType: ${JSON.stringify(review.eventType)},`,
    `    rating: ${review.rating},`,
    `    quote: ${JSON.stringify(review.quote)},`,
    `    sourceIssue: ${JSON.stringify(review.sourceIssue)}`,
    "  }"
  ];

  return lines.join("\n");
}

function insertReviewIntoApprovedReviews(content, reviewBlock) {
  const arrayStart = content.indexOf("const APPROVED_REVIEWS = [");

  if (arrayStart === -1) {
    fail("Could not find const APPROVED_REVIEWS = [ in sitedata.js");
  }

  const openBracketIndex = content.indexOf("[", arrayStart);
  if (openBracketIndex === -1) {
    fail("Could not find opening bracket for APPROVED_REVIEWS.");
  }

  const afterBracketIndex = openBracketIndex + 1;
  const afterBracket = content.slice(afterBracketIndex);

  const trimmedAfterBracket = afterBracket.trimStart();
  const arrayIsEmpty = trimmedAfterBracket.startsWith("];");

  if (arrayIsEmpty) {
    return (
      content.slice(0, afterBracketIndex) +
      "\n" +
      reviewBlock +
      "\n" +
      content.slice(afterBracketIndex)
    );
  }

  return (
    content.slice(0, afterBracketIndex) +
    "\n" +
    reviewBlock +
    ",\n" +
    content.slice(afterBracketIndex)
  );
}

const issueBody = getEnv("ISSUE_BODY");
const issueTitle = getEnv("ISSUE_TITLE");
const issueNumber = getEnv("ISSUE_NUMBER");
const issueUrl = getEnv("ISSUE_URL");

if (!issueBody) {
  fail("Issue body was empty. Cannot approve review.");
}

if (!issueTitle.toLowerCase().includes("review submission")) {
  fail(`Issue #${issueNumber} does not look like a review submission. Title: ${issueTitle}`);
}

const name = extractField(issueBody, "Name");
const rating = extractField(issueBody, "Rating");
const eventType = extractField(issueBody, "Event Type");
const quote = extractReviewText(issueBody);

if (!name || !rating || !quote) {
  fail("Could not parse required review fields from issue body. Required: Name, Rating, Review.");
}

const review = makeReviewObject({
  name,
  eventType,
  rating,
  quote,
  issueUrl
});

const currentContent = fs.readFileSync(SITE_DATA_FILE, "utf8");

if (currentContent.includes(`sourceIssue: ${JSON.stringify(issueUrl)}`)) {
  console.log("This review source issue already exists in sitedata.js. No change needed.");
  process.exit(0);
}

const updatedContent = insertReviewIntoApprovedReviews(currentContent, formatReviewBlock(review));

fs.writeFileSync(SITE_DATA_FILE, updatedContent, "utf8");

console.log(`Added approved review from issue #${issueNumber} to ${SITE_DATA_FILE}.`);
