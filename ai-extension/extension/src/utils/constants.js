(function attachConstants(global) {
  global.EmailAssistantConstants = {
    backendBaseUrl: "http://localhost:8080",
    messageTypes: {
      emailRequest: "EMAIL_ASSISTANT_REQUEST"
    },
    endpoints: {
      generate: "/api/v1/email/generate",
      reply: "/api/v1/email/reply",
      improve: "/api/v1/email/improve",
      grammar: "/api/v1/email/grammar",
      tone: "/api/v1/email/tone",
      subject: "/api/v1/email/subject",
      summarize: "/api/v1/email/summarize"
    },
    tones: ["PROFESSIONAL", "FRIENDLY", "FORMAL", "CASUAL"]
  };
})(window);
