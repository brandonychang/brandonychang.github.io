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

function setDemoView(demo, mode) {
  demo.dataset.state = mode;
  for (const label of demo.querySelectorAll('[data-first]')) {
    label.textContent = mode === '1' ? label.dataset.second : label.dataset.first;
  }
  for (const button of demo.querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
}

function enableDemo(demo) {
  let selection = '0';
  const surface = demo.firstElementChild;
  const choices = demo.querySelectorAll('[data-mode]');
  const commit = mode => {
    selection = mode;
    setDemoView(demo, mode);
  };

  for (const button of choices) {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') setDemoView(demo, button.dataset.mode);
    });
    button.addEventListener('focus', () => setDemoView(demo, button.dataset.mode));
    button.addEventListener('click', () => commit(button.dataset.mode));
  }

  surface.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setDemoView(demo, '1');
  });
  if (surface.matches('.map-screen, .pose-screen')) {
    surface.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const bounds = surface.getBoundingClientRect();
      const fraction = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      surface.style.setProperty('--reveal', (fraction * 100).toFixed(1) + '%');
      surface.classList.add('is-scrubbing');
      setDemoView(demo, fraction >= .5 ? '1' : '0');
    });
    surface.addEventListener('pointerleave', () => surface.classList.remove('is-scrubbing'));
  }
  function restoreSelection() {
    const focused = demo.querySelector('[data-mode]:focus-visible');
    setDemoView(demo, focused ? focused.dataset.mode : selection);
  }
  demo.addEventListener('pointerleave', restoreSelection);
  demo.addEventListener('focusout', event => {
    if (!demo.contains(event.relatedTarget)) setDemoView(demo, selection);
  });
  return restoreSelection;
}

function startProjectReel() {
  const track = document.querySelector('#reel-track');
  const reel = track.closest('.work-reel');
  const slides = [...track.querySelectorAll('.reel-project')];
  const links = [...reel.querySelectorAll('.reel-index a')];
  const toggle = reel.querySelector('.motion-switch');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const restore = slides.map(slide => enableDemo(slide.querySelector('.project-demo')));
  const progress = document.createElement('span');
  progress.className = 'time-left';
  progress.setAttribute('aria-hidden', 'true');

  let active = 0;
  let paused = media.matches;
  let visible = false;
  let hovered = false;
  let elapsed = 0;
  let lastTime = 0;
  let frame = 0;
  let settling = 0;
  let dragging = null;
  let dragMoved = false;
  const duration = 8500;

  function offset(index) {
    return slides[index].offsetLeft - slides[0].offsetLeft;
  }

  function select(index) {
    restore[active]();
    active = index;
    elapsed = 0;
    progress.style.transform = 'scaleX(0)';
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    links[index].append(progress);
    const nav = links[index].parentElement;
    if (nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft += links[index].getBoundingClientRect().left - nav.getBoundingClientRect().left;
    }
  }

  function go(index) {
    index = (index + slides.length) % slides.length;
    select(index);
    track.scrollTo({left:offset(index), behavior:media.matches ? 'instant' : 'smooth'});
  }

  function tick(now) {
    const previous = elapsed;
    elapsed += lastTime ? Math.min(now - lastTime, 90) : 0;
    lastTime = now;
    progress.style.transform = 'scaleX(' + Math.min(1, elapsed / duration) + ')';
    if (previous < 3400 && elapsed >= 3400) {
      setDemoView(slides[active].querySelector('.project-demo'), '1');
    }
    if (elapsed >= duration) go(active + 1);
    frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    cancelAnimationFrame(frame);
    lastTime = 0;
    toggle.textContent = paused ? 'Play reel' : 'Pause reel';
    if (!paused && visible && !document.hidden && !hovered && !dragging &&
        !track.contains(document.activeElement) && !reel.querySelector('.reel-index :focus-visible, [data-step]:focus-visible')) {
      frame = requestAnimationFrame(tick);
    }
  }

  select(0);
  reel.querySelector('.reel-controls').hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; syncPlayback(); });
  media.addEventListener('change', () => { paused = media.matches; syncPlayback(); });
  document.addEventListener('visibilitychange', syncPlayback);
  reel.addEventListener('focusin', syncPlayback);
  reel.addEventListener('focusout', () => queueMicrotask(syncPlayback));
  track.addEventListener('pointerenter', e => { hovered = e.pointerType === 'mouse'; syncPlayback(); });
  track.addEventListener('pointerleave', () => { hovered = false; syncPlayback(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }, {threshold:.3}).observe(track);

  for (const button of reel.querySelectorAll('[data-step]')) {
    button.addEventListener('click', () => go(active + Number(button.dataset.step)));
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    go(index);
  }));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  function nearestSlide() {
    return slides.reduce((best, _, i) =>
      Math.abs(offset(i) - track.scrollLeft) < Math.abs(offset(best) - track.scrollLeft) ? i : best, 0);
  }
  track.addEventListener('scroll', () => {
    clearTimeout(settling);
    settling = setTimeout(() => {
      const next = nearestSlide();
      if (!dragging && next !== active) select(next);
    }, 140);
  }, {passive:true});

  // Touch and trackpads use native scrolling. Drag the printed side with a mouse.
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 ||
        event.target.closest('a, button, .project-demo')) return;
    dragging = {x:event.clientX, left:track.scrollLeft};
    dragMoved = false;
    syncPlayback();
  });
  track.addEventListener('pointermove', event => {
    if (!dragging || !(event.buttons & 1)) return;
    const delta = event.clientX - dragging.x;
    if (!dragMoved && Math.abs(delta) < 7) return;
    dragMoved = true;
    track.setPointerCapture(event.pointerId);
    track.classList.add('is-dragging');
    track.scrollLeft = dragging.left - delta;
  });
  function finishDrag() {
    if (!dragging) return;
    const delta = track.scrollLeft - dragging.left;
    const next = Math.abs(delta) > 45 ? active + Math.sign(delta) : nearestSlide();
    dragging = null;
    track.classList.remove('is-dragging');
    if (dragMoved) go(Math.max(0, Math.min(slides.length-1, next)));
    syncPlayback();
  }
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);
}
startProjectReel();
