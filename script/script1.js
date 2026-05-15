//Thumb Grid
function updateMasonrySpans() { const grid = document.querySelector(".thumb-grid");
  if (!grid) return;
  const rowSize = 8;
  const gap = 16;
  const items = grid.querySelectorAll(".thumb");

  items.forEach((item) => {   const img = item.querySelector("img");
    if (!img) return;
    const height = img.getBoundingClientRect().height;
    const span = Math.ceil((height + gap) / (rowSize + gap));
    item.style.gridRowEnd = "span " + span;
  });
}
window.addEventListener("load", updateMasonrySpans);
window.addEventListener("resize", updateMasonrySpans);


// Scroll Position
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
function saveScrollPosition() {
  sessionStorage.setItem("scrollPosition", window.scrollY);
}
window.addEventListener("beforeunload", saveScrollPosition);
window.addEventListener("pagehide", saveScrollPosition);

function restoreScrollPosition() {
  const scrollPosition = sessionStorage.getItem("scrollPosition");

  if (scrollPosition !== null) {
    const y = parseInt(scrollPosition, 10);

    setTimeout(() => {
      updateMasonrySpans();
      window.scrollTo(0, y);
    }, 300);

    setTimeout(() => {
      updateMasonrySpans();
      window.scrollTo(0, y);
    }, 800);
  }
}
window.addEventListener("pageshow", restoreScrollPosition);


// guardar ultimo elemento enfocado
document.addEventListener("focusin", (e) => {
  if (e.target.id) {
    sessionStorage.setItem("lastFocus", e.target.id);
  }
});

// restaurar foco al volver
window.addEventListener("pageshow", () => {
  const lastFocus = sessionStorage.getItem("lastFocus");

  if (lastFocus) {
    const el = document.getElementById(lastFocus);

    if (el) {
      el.focus();
    }
  }
});