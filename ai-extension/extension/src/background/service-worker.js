const BACKEND_BASE_URL = "https://api.igrisai.cloud";

const ENDPOINTS = {
  generate: "/api/v1/email/generate",
  reply: "/api/v1/email/reply",
  improve: "/api/v1/email/improve",
  grammar: "/api/v1/email/grammar",
  tone: "/api/v1/email/tone",
  subject: "/api/v1/email/subject",
  summarize: "/api/v1/email/summarize"
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "EMAIL_ASSISTANT_REQUEST") {
    return false;
  }

  callBackend(message.action, message.payload)
    .then(sendResponse)
    .catch((error) => {
      sendResponse({
        ok: false,
        error: error.message || "Request failed"
      });
    });

  return true;
});

async function callBackend(action, payload) {
  const endpoint = ENDPOINTS[action];
  if (!endpoint) {
    throw new Error(`Unsupported action: ${action}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Backend request failed with ${response.status}`);
    }

    return { ok: true, data };
  } finally {
    clearTimeout(timeoutId);
  }
}
