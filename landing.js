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
