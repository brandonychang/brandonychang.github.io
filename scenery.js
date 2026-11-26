// The small illustrations share a palette and drawing, with separate joints for wind, steps, and breathing.
(() => {
  const drawings = `<svg width="0" height="0" aria-hidden="true" focusable="false" class="scenery-drawings" xmlns="http://www.w3.org/2000/svg"><defs>
    <g id="blade"><path d="M0 0Q-5 -11 -4 -27Q0 -16 1 0Z" fill="#85955b"/><path d="M0 0Q1 -17 10 -25Q5 -12 2 0Z" fill="#a2ab6d"/><path d="M-1 0Q-11 -11 -14 -17Q-5 -14 1 0Z" fill="#a9b17e"/></g>
    <g id="daisy"><g fill="#fff0cf" stroke="#bc9b63" stroke-width=".65"><ellipse cy="-3" rx="2" ry="3.6"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(72)"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(144)"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(216)"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(288)"/></g><circle r="2.1" fill="#d9a247"/></g>
  </defs></svg>`;
  document.body.insertAdjacentHTML('afterbegin', drawings);

  function grass(x, y, size = 1, flowers = false) {
    return `<g transform="translate(${x} ${y}) scale(${size})"><g class="grass" style="--phase:-${x%13/3}s">
      <use href="#blade" transform="translate(-8 0) scale(.75)"/><use href="#blade" transform="translate(3 0) scale(.86 1.14)"/><use href="#blade" transform="translate(12 1) scale(.62)"/>
      ${flowers ? '<path d="M0 0Q-2 -18 -10 -35M2 0Q8 -10 11 -24" fill="none" stroke="#829162" stroke-width="1.5"/><use href="#daisy" transform="translate(-10 -35)"/><use href="#daisy" transform="translate(11 -24) scale(.8)"/>' : ''}
    </g></g>`;
  }

  function wallow(x, y, size) {
    return `<g transform="translate(${x} ${y}) scale(${size})"><path d="M-68 1Q-73 -8 -50 -11Q-36 -11 -24 -17Q-4 -23 19 -17Q28 -12 48 -12Q67 -11 69 -3Q76 7 53 11Q30 17 2 14Q-23 18 -41 12Q-64 11 -68 1Z" fill="#aa876d"/>
      <path d="M-52 -4q15 -5 26 -4m41 18q21 0 31 -5m-84 3q8 2 15 2" stroke="#d1ae8e" stroke-linecap="round" fill="none" stroke-width="2"/><ellipse cx="72" cy="10" rx="4" ry="1.8" fill="#b8997b"/></g>`;
  }

  const sprite = (name, x, y, width, height, motion = '') =>
    `<image class="${motion}" href="assets/farm/${name}.webp" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMax meet"/>`;

  const shadow = (x, y, radius, motion = '') =>
    `<ellipse class="${motion}" cx="${x}" cy="${y}" rx="${radius}" ry="3.2" fill="#51422f" opacity=".22"/>`;

  function noseApple() {
    return shadow(74,99,35) + sprite('snuffling',20,21,98,76,'nose-push') + `
      <g transform="translate(122 92)"><g class="rolling-apple">
        <path d="M0 -6C-12 -13 -14 1 -7 8Q-1 14 6 8C15 -1 10 -13 0 -6Z" fill="#bf5043" stroke="#824f3e" stroke-width="1.4"/>
        <path d="M0 -6Q-1 -11 4 -14" fill="none" stroke="#725a3e" stroke-width="1.7"/>
        <path d="M2 -9Q6 -16 11 -13Q9 -7 2 -9Z" fill="#6c8753"/>
      </g></g>`;
  }

  function mudBath() {
    const drops = [[55,86,-13,-19],[48,89,-20,-12],[135,87,17,-23],[145,91,23,-14]];
    return wallow(99,94,.99) + sprite('rolling',53,33,94,62,'mud-roll') +
      drops.map(([x,y,dx,dy]) => `<g transform="translate(${x} ${y})"><ellipse class="mud-drop" rx="3" ry="2.3" style="--dx:${dx}px;--dy:${dy}px" fill="#997351"/></g>`).join('');
  }

  function butterfly() {
    return `<g transform="translate(134 40)"><g class="butterfly-flight"><g class="butterfly-wings">
      <path d="M0 0C-13 -16 -17 -5 -7 1C-16 8 -5 11 0 2C9 12 16 3 6 0C20 -9 8 -16 0 0Z" fill="#e1ab54" stroke="#8c673f" stroke-width="1.4"/>
      <path d="M-1 -3L1 4" stroke="#64523f" stroke-width="2"/></g></g></g>`;
  }

  function pounce(fireflies = false) {
    const quarry = fireflies
      ? '<g transform="translate(122 49)"><g class="firefly"><circle r="6" fill="#fff6a4" opacity=".36"/><circle r="2.5" fill="#fff9bf"/></g></g>'
      : butterfly();
    return shadow(84,100,29,'jump-shadow') + sprite('leaping',34,37,83,63,'piglet-pounce') + quarry;
  }

  function wolfHuff() {
    return shadow(44,100,33) + sprite('wolf',4,9,90,91,'wolf-huff') + `
      <path class="huff-breath" d="M88 38q16 -8 32 -4t18 -3m-49 11q18 5 32 1" fill="none" stroke="#fff5d5" stroke-width="2.4" stroke-linecap="round"/>
      <g class="loose-straw" stroke="#d6ac54" stroke-linecap="round" stroke-width="2.6">
        <path d="M108 35l13 -5m-8 13l12 -2m-2 -11l8 -5m-4 17l10 2"/>
      </g>`;
  }

  function startledPig() {
    return shadow(78,100,30) + sprite('leaping',29,35,82,64,'startled-hop');
  }

  function twigBuilder() {
    return shadow(79,100,30) + `<g class="twig-lift">${sprite('snuffling',25,28,90,72)}
      <path d="M101 93l36 -19m-13 7l3 -10m-8 13l9 1" stroke="#826448" stroke-width="3" stroke-linecap="round" fill="none"/></g>
      <path d="M115 101l34 -4m-24 5l20 1" stroke="#9b7855" stroke-width="3" stroke-linecap="round"/>`;
  }

  function brickHideout() {
    return `<defs><clipPath id="behind-bricks"><rect x="12" y="0" width="174" height="88"/></clipPath></defs>
      <g clip-path="url(#behind-bricks)"><g class="piglet-peek">${sprite('peek',52,35,73,59)}</g></g>
      <g stroke="#895f4e" fill="#bd8069" stroke-width="1.2">
        <rect x="37" y="87" width="42" height="8" rx="2"/><rect x="80" y="87" width="44" height="8" rx="2"/>
        <rect x="51" y="96" width="42" height="8" rx="2"/><rect x="94" y="96" width="43" height="8" rx="2"/>
      </g>`;
  }

  function cuddle() {
    return shadow(89,101,64) + sprite('asleep',12,48,87,52,'soft-breath') +
      `<g class="nuzzle"><g transform="translate(180 0) scale(-1 1)">${sprite('snuffling',10,45,76,57)}</g></g>`;
  }

  function strawBed() {
    return `<path d="M35 96Q74 81 139 92L150 100Q94 108 28 101Z" fill="#cba56c"/>
      <path d="M32 100l26 -8m-14 12l30 -9m28 8l31 -10m-10 11l24 -6" fill="none" stroke="#eed397" stroke-width="2"/>` +
      sprite('asleep',44,38,92,61,'dream-kick');
  }

  // Each action has its own small coordinate system. Responsive placement never
  // stretches the characters when the background crop changes on a phone.
  const chapters = {
    morning: [['apple',18,noseApple],['bath',53,mudBath],['chase',83,pounce]],
    storybook: [['wolf',9,wolfHuff],['straw',30,startledPig],['twigs',55,twigBuilder],['bricks',84,brickHideout]],
    evening: [['fireflies',20,() => pounce(true)],['nest',53,cuddle],['straw-bed',84,strawBed]]
  };

  function fillLandscape(element) {
    const name = element.dataset.farm;
    const actions = chapters[name].map(([action, x, draw]) =>
      `<svg class="farm-action scenery action-${action}" style="--place:${x}%" viewBox="0 0 190 110" focusable="false" aria-hidden="true">${draw()}</svg>`
    ).join('');
    element.innerHTML = `<img class="farm-panorama" src="assets/farm/${name}.webp" alt="" loading="lazy" decoding="async" width="1680" height="560">${actions}`;
  }

  function detail(where, type, viewBox, art) {
    if (where) where.insertAdjacentHTML(type === 'mark' ? 'afterbegin' : 'beforeend',
      `<svg class="scenery scenery-${type}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${art}</svg>`);
  }
  detail(document.querySelector('.wordmark'), 'mark', '0 0 105 64', sprite('peek',23,1,60,61,'hello-pig'));
  detail(document.querySelector('.intro-copy'), 'intro', '0 0 260 89',
    grass(18,78,.45,true) + '<g transform="translate(22 3) scale(.74)">' + noseApple() + '</g>' +
    '<g transform="translate(119 -4) scale(.83)">' + pounce() + '</g>');
  detail(document.querySelector('#work .section-head'), 'verge', '0 0 245 79',
    grass(37,71,.6,true) + sprite('snuffling',82,12,79,59,'flower-sniff') + grass(201,69,.68));

  document.querySelector('.colophon')?.insertAdjacentHTML('afterbegin',
    '<div class="farm-landscape" data-farm="evening" aria-hidden="true"></div>');
  document.querySelectorAll('.farm-landscape').forEach(fillLandscape);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'scenery-toggle';
  let paused = false;
  try { paused = localStorage.getItem('scenery-paused') === 'true'; } catch {}
  function applyPreference() {
    document.documentElement.classList.toggle('scenery-paused', paused);
    toggle.textContent = paused ? 'Play scenery' : 'Pause scenery';
  }
  applyPreference();
  toggle.addEventListener('click', () => {
    paused = !paused;
    applyPreference();
    try { localStorage.setItem('scenery-paused', String(paused)); } catch {}
  });
  document.querySelector('.colophon .page')?.append(toggle);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('offscreen', !entry.isIntersecting);
    });
    document.querySelectorAll('.scenery:not(.farm-action), .farm-landscape').forEach(art => observer.observe(art));
  }
})();
