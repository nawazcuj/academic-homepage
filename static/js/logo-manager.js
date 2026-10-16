(() => {
  'use strict';
  const form = document.getElementById('logo-form');
  const file = document.getElementById('logo-source');
  const preview = document.getElementById('logo-preview');
  const slider = document.getElementById('logo-zoom');
  const zoomValue = document.getElementById('logo-zoom-value');
  const reset = document.getElementById('logo-reset');
  const save = document.getElementById('logo-save');
  const info = document.getElementById('logo-feedback');
  if (!form || !file || !preview || !slider || !save || !info) return;

  const states = {
    round: { zoom: 1, dx: 0, dy: 0 },
    square: { zoom: 1, dx: 0, dy: 0 }
  };
  let active = 'round';
  let img = null;
  let imageURL = null;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function paint(canvas, shape) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    if (!img) return;
    const state = states[shape];
    ctx.save();
    if (shape === 'round') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.clip();
    }
    const scale = Math.max(size / img.width, size / img.height) * state.zoom;
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (size - w) / 2 + state.dx, (size - h) / 2 + state.dy, w, h);
    ctx.restore();
  }

  function showShape(shape) {
    if (!states[shape]) return;
    active = shape;
    document.querySelectorAll('.logo-shape-tab').forEach(button => {
      const selected = button.dataset.shape === shape;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    preview.classList.toggle('is-round', shape === 'round');
    slider.value = String(Math.round(states[shape].zoom * 100));
    zoomValue.textContent = slider.value + '%';
    paint(preview, shape);
  }

  document.querySelectorAll('.logo-shape-tab').forEach(button => {
    button.addEventListener('click', () => showShape(button.dataset.shape));
  });

  slider.addEventListener('input', () => {
    states[active].zoom = Number(slider.value) / 100;
    zoomValue.textContent = slider.value + '%';
    paint(preview, active);
  });

  reset.addEventListener('click', () => {
    states[active] = { zoom: 1, dx: 0, dy: 0 };
    showShape(active);
  });

  file.addEventListener('change', () => {
    save.disabled = true;
    img = null;
    const selected = file.files[0];
    if (!selected) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(selected.type) || selected.size > 8 * 1024 * 1024) {
      info.textContent = 'Choose a PNG, JPG or WebP under 8 MB.';
      return;
    }
    if (imageURL) URL.revokeObjectURL(imageURL);
    imageURL = URL.createObjectURL(selected);
    const candidate = new Image();
    candidate.onload = () => {
      if (!candidate.width || !candidate.height || candidate.width * candidate.height > 30000000) {
        info.textContent = 'The image dimensions are too large.';
        return;
      }
      img = candidate;
      states.round = { zoom: 1, dx: 0, dy: 0 };
      states.square = { zoom: 1, dx: 0, dy: 0 };
      showShape(active);
      info.textContent = 'Customize each shape using the switch above. Your crops are preserved when switching.';
      save.disabled = false;
    };
    candidate.onerror = () => { info.textContent = 'Unable to read this image.'; };
    candidate.src = imageURL;
  });

  preview.addEventListener('pointerdown', event => {
    if (!img) return;
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    preview.setPointerCapture(event.pointerId);
  });
  preview.addEventListener('pointermove', event => {
    if (!dragging) return;
    const bounds = preview.getBoundingClientRect();
    const state = states[active];
    state.dx += (event.clientX - lastX) * preview.width / bounds.width;
    state.dy += (event.clientY - lastY) * preview.height / bounds.height;
    lastX = event.clientX;
    lastY = event.clientY;
    paint(preview, active);
  });
  preview.addEventListener('pointerup', () => { dragging = false; });
  preview.addEventListener('pointercancel', () => { dragging = false; });
  preview.addEventListener('lostpointercapture', () => { dragging = false; });

  function exportBlob(shape) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    paint(canvas, shape);
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Unable to create ' + shape + ' PNG')), 'image/png');
    });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!img || save.disabled) return;
    save.disabled = true;
    info.textContent = 'Saving both logo versions…';
    try {
      const payload = new FormData(form);
      for (const shape of ['square', 'round']) {
        payload.append('logo_' + shape, await exportBlob(shape), shape + '.png');
      }
      const response = await fetch(form.getAttribute('action'), {
        method: 'POST',
        body: payload,
        credentials: 'same-origin',
        redirect: 'follow'
      });
      if (!response.ok) {
        throw new Error('Server returned HTTP ' + response.status + ' at ' + new URL(response.url).pathname);
      }
      window.location.assign(response.url);
    } catch (error) {
      info.textContent = 'Could not save: ' + error.message;
      save.disabled = false;
    }
  });

  showShape('round');
})();
