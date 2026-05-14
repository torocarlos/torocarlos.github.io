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
window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
});
window.addEventListener("load", () => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");

    if (scrollPosition !== null) {
        window.scrollTo(0, parseInt(scrollPosition));
    }
});


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