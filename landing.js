// A small, keyboard-accessible look at the decisions behind the HSG project.
const methodExamples = {
  understand: ['For the HSG inbox, the problem started with field teams waiting on access, reports, and answers they could trust.', 'Listen for what is getting in the way.'],
  simplify: ['Keep the familiar email address. Give every request a clear owner, priority, and status behind the scenes.', 'Make the next step obvious.'],
  build: ['Connect Outlook, Python, and a shared tracker. Use the dashboard and team feedback to find what needs to improve next.', 'Ship, measure, and keep learning.']
};
const methodDetail = document.querySelector('#method-detail');
document.querySelectorAll('[data-method]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-method]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const [example, principle] = methodExamples[button.dataset.method];
    methodDetail.querySelector('p').textContent = example;
    methodDetail.querySelector('span').textContent = principle;
  });
});

const contactToggle = document.querySelector('#contact-toggle');
const contactOptions = document.querySelector('#contact-options');
contactToggle.addEventListener('click', () => {
  const open = contactOptions.hidden;
  contactOptions.hidden = !open;
  contactToggle.setAttribute('aria-expanded', String(open));
});
contactOptions.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    contactOptions.hidden = true;
    contactToggle.setAttribute('aria-expanded', 'false');
    contactToggle.focus();
  }
});
document.querySelector('#copy-contact-email').addEventListener('click', async () => {
  const email = document.querySelector('#contact-email');
  const status = document.querySelector('#contact-copy-status');
  try {
    await navigator.clipboard.writeText(email.value);
    status.textContent = 'Email copied. Paste it into any email service.';
  } catch {
    email.focus();
    email.select();
    status.textContent = 'Select and copy the email address above.';
  }
});

// One mark for each workbook in the featured Tableau review.
const workbookMarks = document.querySelector('.workbook-marks');
const workbookCount = Number(document.querySelector('#workbook-count').textContent);
for (let index = 0; index < workbookCount; index++) {
  const mark = document.createElement('i');
  mark.style.setProperty('--order', index);
  workbookMarks.append(mark);
}

// Content stays visible while the browser waits for its first intersection.
if ('IntersectionObserver' in window) {
  const arrivals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-arrived');
        arrivals.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.workbook-marks, .section-title, .project-preview')
    .forEach(element => arrivals.observe(element));
}

function startProjectReel() {
  const reel = document.querySelector('#reel-track');
  const controls = document.querySelector('.reel-controls');
  const switchButton = document.querySelector('.motion-switch');
  const canvas = document.querySelector('.current-field');
  const context = canvas.getContext('2d');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  let railVisible = false;
  let fieldVisible = false;
  let hovering = false;
  let direction = 1;
  let fraction = 0;
  let resumeAfter = 0;
  let frame = 0;
  let previousTime = 0;
  let phase = 0;
  let pointer = 0;
  let bend = 0;
  let drag = null;
  let suppressClick = false;
  let width = 0;
  let height = 0;
  let accent = getComputedStyle(canvas).getPropertyValue('--accent').trim();
  // Resolve the theme variable to a canvas-compatible color.
  canvas.style.color = 'var(--accent)';

  function drawField() {
    if (!context || !width || !height) return;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = accent;
    context.fillStyle = accent;
    for (let line = 0; line < 16; line++) {
      const layer = line / 15;
      const y = x => height * (.24 + .48 * layer
        + .19 * Math.sin(x * 6.5 + phase + layer * 3.8)
        + (.11 + .13 * bend) * Math.sin(x * 12 - phase * .8 + layer * 2.4));
      context.globalAlpha = .25 + .48 * layer;
      context.lineWidth = 1;
      context.beginPath();
      for (let step = 0; step <= 72; step++) {
        const x = step / 72;
        if (step === 0) context.moveTo(0, y(0));
        else context.lineTo(x * width, y(x));
      }
      context.stroke();
      if (line % 3 === 0) {
        const x = (phase * .15 + layer * 1.7) % 1;
        context.globalAlpha = .9;
        context.beginPath();
        context.arc(x * width, y(x), 2, 0, 2 * Math.PI);
        context.fill();
      }
    }
    context.globalAlpha = 1;
  }

  function resizeField() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context?.setTransform(scale, 0, 0, scale, 0, 0);
    accent = getComputedStyle(canvas).color;
    drawField();
  }

  function advance(time) {
    const dt = previousTime ? Math.min(time - previousTime, 50) : 0;
    previousTime = time;
    if (fieldVisible) {
      phase += dt * .00085;
      bend += (pointer - bend) * Math.min(dt / 110, 1);
      drawField();
    }
    if (railVisible && !hovering && !drag && time > resumeAfter && !reel.closest('section').contains(document.activeElement)) {
      fraction += direction * dt * .052;
      const pixels = Math.trunc(fraction);
      fraction -= pixels;
      reel.scrollLeft += pixels;
      const limit = reel.scrollWidth - reel.clientWidth;
      if (reel.scrollLeft >= limit - 1) direction = -1;
      if (reel.scrollLeft <= 1) direction = 1;
    }
    frame = requestAnimationFrame(advance);
  }

  function syncMotion() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    switchButton.textContent = paused ? 'Play motion' : 'Pause motion';
    if (!paused && !document.hidden && (fieldVisible || railVisible)) {
      frame = requestAnimationFrame(advance);
    }
  }

  switchButton.hidden = false;
  controls.hidden = false;
  switchButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  preference.addEventListener('change', () => { paused = preference.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  new ResizeObserver(resizeField).observe(canvas);
  new MutationObserver(resizeField).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === canvas) fieldVisible = entry.isIntersecting;
      if (entry.target === reel) railVisible = entry.isIntersecting;
    }
    syncMotion();
  });
  visibility.observe(canvas);
  visibility.observe(reel);
  const intro = canvas.parentElement;
  intro.addEventListener('pointermove', event => {
    const box = intro.getBoundingClientRect();
    pointer = Math.max(-1, Math.min(1, 2 * (event.clientY - box.top) / box.height - 1));
  });
  intro.addEventListener('pointerleave', () => { pointer = 0; });

  const postpone = () => { resumeAfter = performance.now() + 3500; };
  reel.addEventListener('wheel', postpone, {passive:true});
  reel.addEventListener('pointerenter', event => { hovering = event.pointerType === 'mouse'; });
  reel.addEventListener('pointerleave', () => { hovering = false; });
  reel.addEventListener('dragstart', event => event.preventDefault());
  reel.addEventListener('pointerdown', event => {
    postpone();
    suppressClick = false;
    if (event.pointerType === 'mouse' && event.button === 0) {
      drag = { x:event.clientX, left:reel.scrollLeft, id:event.pointerId };
    }
  });
  reel.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId || !(event.buttons & 1)) return;
    const delta = event.clientX - drag.x;
    if (!suppressClick && Math.abs(delta) < 6) return;
    suppressClick = true;
    reel.setPointerCapture(event.pointerId);
    reel.scrollLeft = drag.left - delta;
  });
  window.addEventListener('pointerup', () => { drag = null; });
  window.addEventListener('pointercancel', () => { drag = null; });
  reel.addEventListener('click', event => {
    if (suppressClick && event.detail) event.preventDefault();
    suppressClick = false;
  }, true);
  for (const button of controls.querySelectorAll('button')) {
    button.addEventListener('click', () => {
      const step = Number(button.dataset.step);
      const span = reel.children[1].offsetLeft - reel.children[0].offsetLeft;
      const last = reel.scrollWidth - reel.clientWidth;
      let next = reel.scrollLeft + step * span;
      if (step > 0 && reel.scrollLeft >= last - 1) next = 0;
      if (step < 0 && reel.scrollLeft <= 1) next = last;
      reel.scrollTo({left:next, behavior:paused ? 'instant' : 'smooth'});
      postpone();
    });
  }
}
startProjectReel();
