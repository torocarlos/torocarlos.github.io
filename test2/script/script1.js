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