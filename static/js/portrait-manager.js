(() => {
    const file = document.getElementById('portrait-source');
    const form = document.getElementById('portrait-form');
    if (!file || !form) return;

    const info = document.getElementById('portrait-feedback');
    const save = document.getElementById('portrait-save');
    const canvas = document.getElementById('portrait-preview');
    const ctx = canvas.getContext('2d');
    const zoomInput = document.getElementById('portrait-zoom');
    const zoomValue = document.getElementById('portrait-zoom-value');
    const resetBtn = document.getElementById('portrait-reset');

    let img = null;
    let zoom = 1;
    let dx = 0;
    let dy = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function paint() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#f3f0e9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!img) return;

        const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const scale = baseScale * zoom;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2 + dx;
        const y = (canvas.height - h) / 2 + dy;

        ctx.drawImage(img, x, y, w, h);
    }

    function resetEditor() {
        zoom = 1;
        dx = 0;
        dy = 0;
        zoomInput.value = 100;
        zoomValue.textContent = '100%';
        paint();
    }

    file.addEventListener('change', () => {
        save.disabled = true;
        const f = file.files[0];
        if (!f) return;

        if (!['image/png', 'image/jpeg', 'image/webp'].includes(f.type) || f.size > 8 * 1024 * 1024) {
            info.textContent = 'Choose a PNG, JPG or WebP under 8 MB.';
            return;
        }

        const url = URL.createObjectURL(f);
        const candidate = new Image();

        candidate.onload = () => {
            URL.revokeObjectURL(url);
            img = candidate;
            resetEditor();
            info.textContent = 'Drag the image to reposition it, or adjust zoom.';
            save.disabled = false;
        };

        candidate.onerror = () => {
            URL.revokeObjectURL(url);
            info.textContent = 'Unable to read this image.';
        };

        candidate.src = url;
    });

    zoomInput.addEventListener('input', () => {
        zoom = Number(zoomInput.value) / 100;
        zoomValue.textContent = zoomInput.value + '%';
        paint();
    });

    resetBtn.addEventListener('click', () => {
        if (!img) return;
        resetEditor();
    });

    canvas.addEventListener('pointerdown', (event) => {
        if (!img) return;
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        const box = canvas.getBoundingClientRect();
        dx += (event.clientX - lastX) * canvas.width / box.width;
        dy += (event.clientY - lastY) * canvas.height / box.height;
        lastX = event.clientX;
        lastY = event.clientY;
        paint();
    });

    canvas.addEventListener('pointerup', () => {
        dragging = false;
    });

    canvas.addEventListener('pointercancel', () => {
        dragging = false;
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!img || save.disabled) return;

        save.disabled = true;
        info.textContent = 'Saving portrait…';

        try {
            const payload = new FormData(form);

            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(
                    (b) => b ? resolve(b) : reject(new Error('Unable to create portrait image')),
                    'image/png'
                );
            });

            payload.append('portrait', blob, 'portrait.png');

            const response = await fetch(form.getAttribute('action'), {
                method: 'POST',
                body: payload,
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Server returned HTTP ' + response.status);
            }

            window.location.assign(response.url);
        } catch (err) {
            info.textContent = 'Could not save: ' + err.message;
            save.disabled = false;
        }
    });
})();