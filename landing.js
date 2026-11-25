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
