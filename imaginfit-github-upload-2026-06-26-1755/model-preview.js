(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function safeImageUrl(value = "") {
    return value.replaceAll('"', "%22").replaceAll("\\", "\\\\");
  }

  function createImaginFitModelPreview(container) {
    if (!container) return null;

    const state = {
      x: 50,
      y: 50,
      scale: 100,
      referenceImage: "",
    };

    container.innerHTML = `
      <div class="look-preview">
        <div class="look-preview-frame" data-drag-surface>
          <div class="look-preview-image" data-look-image></div>
          <div class="look-fabric-overlay"></div>
          <div class="look-preview-fallback" aria-hidden="true">
            <strong>Design preview</strong>
            <span>Upload or drag a reference photo to preview it here.</span>
          </div>
          <div class="look-preview-shine"></div>
        </div>
        <div class="look-preview-controls" aria-label="Reference placement controls">
          <button type="button" data-preview-zoom-out aria-label="Zoom reference out">-</button>
          <button type="button" data-preview-reset aria-label="Reset reference position">R</button>
          <button type="button" data-preview-zoom-in aria-label="Zoom reference in">+</button>
        </div>
      </div>
    `;

    const dragSurface = container.querySelector("[data-drag-surface]");
    const imageLayer = container.querySelector("[data-look-image]");
    const zoomIn = container.querySelector("[data-preview-zoom-in]");
    const zoomOut = container.querySelector("[data-preview-zoom-out]");
    const reset = container.querySelector("[data-preview-reset]");
    let dragStart = null;

    function applyImagePlacement() {
      imageLayer.style.backgroundPosition = `${state.x}% ${state.y}%`;
      imageLayer.style.backgroundSize = `${state.scale}% auto`;
    }

    function applyReference() {
      if (state.referenceImage) {
        imageLayer.style.backgroundImage = `url("${safeImageUrl(state.referenceImage)}")`;
        container.classList.add("has-reference");
      } else {
        imageLayer.style.backgroundImage = "";
        container.classList.remove("has-reference");
      }

      applyImagePlacement();
    }

    function applyConfig(config = {}, color = "#222222") {
      container.dataset.category = config.category || "Kurti";
      container.dataset.fabric = config.fabric || "Cotton";
      container.dataset.fit = config.fit || "Tailored";
      container.dataset.neckline = config.neckline || "Round";
      container.dataset.sleeves = config.sleeves || "Three Quarter";
      container.dataset.layout = config.layout || "";
      container.style.setProperty("--garment-color", color || "#222222");

      if ((config.referenceImage || "") !== state.referenceImage) {
        state.referenceImage = config.referenceImage || "";
        state.x = 50;
        state.y = 50;
        state.scale = 100;
      }

      applyReference();
    }

    function startDrag(event) {
      if (!state.referenceImage) return;
      dragStart = {
        x: event.clientX,
        y: event.clientY,
        refX: state.x,
        refY: state.y,
      };
      dragSurface.setPointerCapture?.(event.pointerId);
      container.classList.add("is-dragging");
    }

    function dragReference(event) {
      if (!dragStart) return;
      state.x = clamp(dragStart.refX + (event.clientX - dragStart.x) * 0.14, 0, 100);
      state.y = clamp(dragStart.refY + (event.clientY - dragStart.y) * 0.14, 0, 100);
      applyImagePlacement();
    }

    function stopDrag() {
      dragStart = null;
      container.classList.remove("is-dragging");
    }

    dragSurface.addEventListener("pointerdown", startDrag);
    dragSurface.addEventListener("pointermove", dragReference);
    dragSurface.addEventListener("pointerup", stopDrag);
    dragSurface.addEventListener("pointercancel", stopDrag);
    dragSurface.addEventListener("pointerleave", stopDrag);

    zoomIn.addEventListener("click", () => {
      state.scale = clamp(state.scale + 10, 70, 180);
      applyImagePlacement();
    });

    zoomOut.addEventListener("click", () => {
      state.scale = clamp(state.scale - 10, 70, 180);
      applyImagePlacement();
    });

    reset.addEventListener("click", () => {
      state.x = 50;
      state.y = 50;
      state.scale = 100;
      applyReference();
    });

    applyConfig();
    container.classList.add("is-ready");

    return {
      update: applyConfig,
    };
  }

  window.createImaginFitModelPreview = createImaginFitModelPreview;
})();
