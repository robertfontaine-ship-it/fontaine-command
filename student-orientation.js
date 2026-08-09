(() => {
  "use strict";

  const steps = [...document.querySelectorAll("[data-step]")];
  const previous = document.getElementById("previousStep");
  const next = document.getElementById("nextStep");
  const dots = document.getElementById("stepDots");
  let active = 0;

  dots.innerHTML = steps.map((_, index) => `<button type="button" data-go-step="${index}" aria-label="Go to orientation step ${index + 1}">${index + 1}</button>`).join("");

  function show(index, moveFocus = true) {
    active = Math.max(0, Math.min(steps.length - 1, index));
    steps.forEach((step, stepIndex) => {
      const selected = stepIndex === active;
      step.hidden = !selected;
      step.classList.toggle("active", selected);
      step.setAttribute("aria-hidden", String(!selected));
    });
    dots.querySelectorAll("button").forEach((button, buttonIndex) => {
      const selected = buttonIndex === active;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-current", selected ? "step" : "false");
    });
    document.getElementById("stepCounter").textContent = `${active + 1} of ${steps.length}`;
    document.getElementById("orientationProgressBar").style.width = `${(active + 1) / steps.length * 100}%`;
    previous.disabled = active === 0;
    next.disabled = active === steps.length - 1;
    next.textContent = active === steps.length - 2 ? "Finish →" : "Next →";
    if (moveFocus) {
      const heading = steps[active].querySelector("h1");
      if (heading) {
        heading.tabIndex = -1;
        requestAnimationFrame(() => heading.focus({ preventScroll: true }));
      }
    }
  }

  previous.addEventListener("click", () => show(active - 1));
  next.addEventListener("click", () => show(active + 1));
  dots.addEventListener("click", event => {
    const button = event.target.closest("[data-go-step]");
    if (button) show(Number(button.dataset.goStep));
  });
  document.addEventListener("keydown", event => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      show(active + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      show(active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      show(0);
    } else if (event.key === "End") {
      event.preventDefault();
      show(steps.length - 1);
    }
  });

  show(0, false);
})();
