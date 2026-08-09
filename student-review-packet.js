(() => {
  "use strict";

  const PREFIX = "FMN-REVIEW:";

  function text(selector) {
    return document.querySelector(selector)?.textContent?.trim() || "";
  }

  function receiptValue(label) {
    const terms = [...document.querySelectorAll("#receiptCard dt")];
    const term = terms.find(item => item.textContent.trim().toLowerCase() === label.toLowerCase());
    return term?.nextElementSibling?.textContent?.trim() || "";
  }

  function responses() {
    return [...document.querySelectorAll("[data-response], [data-prompt-index]")]
      .map((field, index) => {
        const label = field.closest("label");
        const prompt = label
          ? [...label.childNodes]
            .filter(node => node !== field)
            .map(node => node.textContent || "")
            .join(" ")
            .replace(/\s+/g, " ")
            .trim()
          : "";
        return { step: index + 1, prompt, response: field.value.trim() };
      })
      .filter(item => item.response);
  }

  function packet() {
    const config = window.HUB_CONFIG || {};
    const studentFirst = document.getElementById("studentFirst")?.value.trim() || "";
    const studentLast = document.getElementById("studentLast")?.value.trim().slice(0, 1).toUpperCase() || "";
    const period = document.getElementById("studentPeriod")?.value || receiptValue("Period") || receiptValue("Class period");
    const topic = config.title || "Branding";
    const mission = text("#modalTitle") || receiptValue("Mission");
    const receiptCode = receiptValue("Receipt code");
    const entryText = receiptValue("Entries") || receiptValue("Provisional entries");
    const provisionalEntries = Number((entryText.match(/\d+/) || [0])[0]);

    return {
      version: 1,
      student: `${studentFirst} ${studentLast}.`.replace(" .", "."),
      first: studentFirst,
      last: studentLast,
      period,
      topic,
      mission,
      receiptCode,
      provisionalEntries,
      responses: responses(),
      submittedAt: new Date().toISOString()
    };
  }

  function encode(value) {
    const json = JSON.stringify(value);
    return PREFIX + btoa(unescape(encodeURIComponent(json)));
  }

  async function copyPacket() {
    const payload = packet();
    if (!payload.student || !payload.period || !payload.receiptCode || !payload.responses.length) {
      window.alert("Complete and submit the mission before copying the teacher review packet.");
      return;
    }
    const encoded = encode(payload);
    try {
      await navigator.clipboard.writeText(encoded);
      const button = document.getElementById("copyReviewPacket");
      if (button) {
        const original = button.textContent;
        button.textContent = "Review packet copied";
        setTimeout(() => { button.textContent = original; }, 1800);
      }
    } catch {
      window.prompt("Copy this teacher review packet:", encoded);
    }
  }

  function install() {
    const actions = document.querySelector("#receiptView .mission-actions");
    if (!actions || document.getElementById("copyReviewPacket")) return;
    const button = document.createElement("button");
    button.id = "copyReviewPacket";
    button.className = "mission-button primary";
    button.type = "button";
    button.textContent = "Copy teacher review packet";
    button.addEventListener("click", copyPacket);
    actions.prepend(button);

    const note = document.createElement("div");
    note.className = "briefing-callout";
    note.innerHTML = "<strong>Teacher review:</strong> Select <em>Copy teacher review packet</em> and paste it into the review queue in Fontaine Command. Keep your regular receipt too.";
    actions.parentElement?.insertBefore(note, actions);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
