// The small illustrations share a palette and drawing, with separate joints for wind, steps, and breathing.
(() => {
  const leaf = (x, y, angle, scale = 1) =>
    `<use href="#orchard-leaf" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"/>`;

  function branch(x, y, angle, size) {
    const leaves = [[4,-8,-116,.78],[9,-17,-51,.8],[13,-25,-128,.8],[17,-31,-51,.78],[21,-37,-96,.7]];
    return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})"><g class="twig">
      <path d="M0 0Q13 -14 23 -41" stroke="#867753" stroke-width="1.7" fill="none"/>
      ${leaves.map(args => leaf(...args)).join('')}
    </g></g>`;
  }

  const drawings = `<svg width="0" height="0" aria-hidden="true" focusable="false" class="scenery-drawings" xmlns="http://www.w3.org/2000/svg"><defs>
    <linearGradient id="pig-blush" x1=".2" y1="0" x2=".65" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#ffddc5"/><stop offset=".55" stop-color="#f6baa9"/><stop offset="1" stop-color="#db9889"/>
    </linearGradient>
    <linearGradient id="leaf-wash" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#abb77a"/><stop offset="1" stop-color="#718856"/></linearGradient>
    <g id="orchard-leaf"><path d="M0 0Q5 -8 19 -5Q17 3 9 4Q4 4 0 0Z" fill="url(#leaf-wash)"/><path d="M1 0Q8 0 16 -4" fill="none" stroke="#63754e" stroke-width=".8"/></g>
    <g id="pig-leg"><path d="M-4 -2Q0 -4 3 0L2 9Q0 12 -3 10Z" fill="#e3a093" stroke="#805e52" stroke-width="1.45"/></g>
    <g id="pig-body">
      <path d="M18 29C16 14 31 7 49 8C68 7 80 15 79 29C78 43 65 48 43 48C26 47 16 43 18 29Z" fill="url(#pig-blush)" stroke="#805e52" stroke-width="1.65"/>
      <path d="M25 23Q30 14 42 13" fill="none" stroke="#ffe5d0" stroke-width="2.2" stroke-linecap="round"/>
      <g fill="#b98270" opacity=".53"><circle cx="31" cy="21" r="1"/><circle cx="35" cy="23" r=".8"/><circle cx="33" cy="18" r=".65"/></g>
    </g>
    <g id="pig-face">
      <path d="M68 24Q66 15 69 10Q75 11 80 19" fill="#de9e91" stroke="#805e52" stroke-width="1.5"/>
      <path d="M63 24Q66 15 77 16Q88 16 92 28Q93 40 83 44Q70 48 62 39" fill="url(#pig-blush)" stroke="#805e52" stroke-width="1.65" stroke-linecap="round"/>
      <path d="M63 22Q56 13 60 7Q68 7 72 18Q69 22 63 22Z" fill="#f4baa9" stroke="#805e52" stroke-width="1.5"/>
      <path d="M63 11Q67 13 68 17" fill="none" stroke="#cf9181" stroke-width="1.55" stroke-linecap="round"/>
      <ellipse cx="76" cy="35" rx="4.1" ry="2.4" fill="#e9988b" opacity=".7"/>
      <ellipse cx="91" cy="33" rx="7" ry="5.5" transform="rotate(-9 91 33)" fill="#f1ab9c" stroke="#805e52" stroke-width="1.45"/>
      <g fill="#986b5e"><ellipse cx="90" cy="33" rx="1" ry="1.7"/><ellipse cx="94" cy="32.5" rx=".85" ry="1.55"/></g>
      <path d="M79 39Q82 41 85 38" fill="none" stroke="#926659" stroke-width="1.25" stroke-linecap="round"/>
    </g>
    <path id="pig-tail" d="M18 29C12 32 7 27 10 23C13 20 16 23 14 26C12 29 5 27 6 21" fill="none" stroke="#91675b" stroke-width="1.7" stroke-linecap="round"/>
    <g id="blade"><path d="M0 0Q-5 -11 -4 -27Q0 -16 1 0Z" fill="#85955b"/><path d="M0 0Q1 -17 10 -25Q5 -12 2 0Z" fill="#a2ab6d"/><path d="M-1 0Q-11 -11 -14 -17Q-5 -14 1 0Z" fill="#a9b17e"/></g>
    <g id="daisy"><g fill="#fff0cf" stroke="#bc9b63" stroke-width=".65"><ellipse cy="-3" rx="2" ry="3.6"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(72)"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(144)"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(216)"/><ellipse cy="-3" rx="2" ry="3.6" transform="rotate(288)"/></g><circle r="2.1" fill="#d9a247"/></g>
  </defs></svg>`;
  document.body.insertAdjacentHTML('afterbegin', drawings);

  function pig(x, y, size, pose = 'walking', delay = 0) {
    const legs = [[34,42,'far'],[65,42,'near'],[28,43,'near'],[71,42,'far']];
    const eye = pose === 'sleeping'
      ? '<path d="M76 29q2 3 5 0" fill="none" stroke="#705044" stroke-width="1.7" stroke-linecap="round"/>'
      : '<ellipse cx="80" cy="28" rx="1.55" ry="1.95" fill="#513c34"/>';
    return `<g transform="translate(${x} ${y}) scale(${size})"><g class="pig ${pose}" style="--phase:${delay}s">
      <g class="pig-direction"><ellipse cx="48" cy="54" rx="38" ry="3" fill="#859063" opacity=".19"/>
      ${legs.map(([lx,ly,side])=>`<g transform="translate(${lx} ${ly})"><g class="leg ${side}"><use href="#pig-leg"/></g></g>`).join('')}
      <g class="pig-back"><use href="#pig-tail" class="curly-tail"/><use href="#pig-body"/>
        <g class="pig-head"><use href="#pig-face"/>${eye}</g>
      </g></g></g></g>`;
  }

  function grass(x, y, size = 1, flowers = false) {
    return `<g transform="translate(${x} ${y}) scale(${size})"><g class="grass" style="--phase:-${x%13/3}s">
      <use href="#blade" transform="translate(-8 0) scale(.75)"/><use href="#blade" transform="translate(3 0) scale(.86 1.14)"/><use href="#blade" transform="translate(12 1) scale(.62)"/>
      ${flowers ? '<path d="M0 0Q-2 -18 -10 -35M2 0Q8 -10 11 -24" fill="none" stroke="#829162" stroke-width="1.5"/><use href="#daisy" transform="translate(-10 -35)"/><use href="#daisy" transform="translate(11 -24) scale(.8)"/>' : ''}
    </g></g>`;
  }

  function tree() {
    const tips=[[0,-3,-57,1.1],[-20,-23,-74,1],[-39,-31,-50,1.12],[-50,-33,-94,.83],
      [-36,-33,-23,1.03],[-5,-19,-29,1.1],[6,-38,-30,1.13],[16,-59,-15,.85],
      [23,-68,5,.8],[15,-53,20,.89],[29,-34,35,.95],[38,-44,49,.9],[43,-51,18,.87],[7,-17,54,1.06]];
    return `<g class="orchard-tree" transform="translate(401 160) scale(1.19)"><ellipse cy="45" rx="32" ry="3.7" fill="#849363" opacity=".17"/>
      <path d="M-6 46Q1 28 -3 4Q-4 -11 -14 -21Q-8 -20 -1 -10Q3 -23 5 -30Q5 -15 5 -7Q4 18 1 35L4 46Z" fill="#a48666" stroke="#816c52" stroke-width="1.4"/>
      <g class="tree-crown"><path d="M0 3Q-10 -25 -49 -33M-16 -20Q-27 -32 -36 -39M0 -5Q3 -35 23 -69M1 -5Q21 -28 45 -51" fill="none" stroke="#896f52" stroke-width="2.8" stroke-linecap="round"/>
      ${tips.map(t=>branch(...t)).join('')}
      ${[[-38,-37],[-11,-24],[14,-54],[34,-43]].map(([x,y])=>`<g transform="translate(${x} ${y})"><path d="M0 0q-1 4 1 7" fill="none" stroke="#786c4c"/><path d="M1 6c-8 -4 -9 5 -4 9q3 3 6 0c6 -5 5 -12 -2 -9Z" fill="#cb7863"/><path d="M-2 9l-1 2" stroke="#efd0a3" stroke-linecap="round"/></g>`).join('')}</g></g>`;
  }

  const scenes = {
    mark: ['0 0 105 64', () => pig(0,0,1,'resting')],
    intro: ['0 0 510 250', () => tree()+grass(421,216,.86,true)+grass(468,191,.49)+grass(302,214,.55)+grass(61,221,.58,true)+pig(211,170,.95)+pig(132,190,.63,'walking',-3)+grass(327,243,.57,true)+grass(101,239,.43)],
    verge: ['0 0 245 79', () => grass(33,72,.57,true)+pig(83,32,.7,'walking',-5)+grass(198,67,.75)+grass(220,67,.39)],
    flowers: ['0 0 105 68', () => grass(36,65,.8)+grass(58,62,1.14,true)+grass(82,65,.55)],
    rest: ['0 0 260 76', () => grass(34,68,.65)+pig(88,28,.78,'sleeping')+pig(149,40,.54,'sleeping',-1)+grass(211,69,.76,true)]
  };
  function scene(where, type) {
    if (!where) return;
    const [viewBox, art] = scenes[type];
    where.insertAdjacentHTML(type === 'mark' ? 'afterbegin' : 'beforeend', `<svg class="scenery scenery-${type}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${art()}</svg>`);
  }
  scene(document.querySelector('.wordmark'), 'mark');
  scene(document.querySelector('.intro-lead'), 'intro');
  scene(document.querySelector('.about-portrait'), 'flowers');
  scene(document.querySelector('#work .section-head'), 'verge');
  scene(document.querySelector('.colophon'), 'rest');

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
    document.querySelectorAll('.scenery').forEach(art => observer.observe(art));
  }
})();
