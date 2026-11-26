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
    <g id="pig-leg"><path d="M-4 -2Q0 -4 3 0L2 9Q0 12 -3 10Z" fill="var(--hoof, #e3a093)" stroke="#805e52" stroke-width="1.45"/></g>
    <g id="pig-body">
      <path d="M18 29C16 14 31 7 49 8C68 7 80 15 79 29C78 43 65 48 43 48C26 47 16 43 18 29Z" fill="var(--coat, url(#pig-blush))" stroke="#805e52" stroke-width="1.65"/>
      <path d="M25 23Q30 14 42 13" fill="none" stroke="#ffe5d0" stroke-width="2.2" stroke-linecap="round"/>
      <g fill="#b98270" opacity=".53"><circle cx="31" cy="21" r="1"/><circle cx="35" cy="23" r=".8"/><circle cx="33" cy="18" r=".65"/></g>
    </g>
    <g id="woolly-body">
      <path d="M17 29Q13 24 19 20Q17 14 24 13Q24 7 31 9Q34 3 40 7Q45 1 51 6Q58 2 62 8Q69 4 72 11Q80 10 79 17Q84 19 80 26Q84 32 78 36Q79 43 72 43Q68 50 62 46Q54 52 49 48Q41 51 36 47Q28 49 25 44Q19 45 19 38Q13 36 17 29Z" fill="#ce8b54" stroke="#865e48" stroke-width="1.6"/>
      <path d="M22 24q1 -6 6 -5m4 -6q4 -4 8 -1m7 -3q4 -2 7 1m7 3q4 -2 7 2M31 32q-1 4 3 6m12 1q0 5 5 4m8 -15q1 4 6 3" fill="none" stroke="#a9734d" stroke-linecap="round" stroke-width="1.5"/>
    </g>
    <g id="patches"><path d="M22 17q6 -8 21 -8q4 9 -4 13q-4 2 -8 0q-4 6 -9 2Z M46 40q-1 -7 5 -9q8 -2 11 6q1 7 -8 10q-7 1 -8 -7Z" fill="#534c45"/><ellipse cx="35" cy="34" rx="3.2" ry="2.5" fill="#75675c"/></g>
    <path id="white-belt" d="M49 9Q41 26 50 47L61 45Q53 27 62 11Z" fill="#f1dfbb"/>
    <g id="pig-face">
      <path d="M68 24Q66 15 69 10Q75 11 80 19" fill="#de9e91" stroke="#805e52" stroke-width="1.5"/>
      <path d="M63 24Q66 15 77 16Q88 16 92 28Q93 40 83 44Q70 48 62 39" fill="var(--coat, url(#pig-blush))" stroke="#805e52" stroke-width="1.65" stroke-linecap="round"/>
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

  function pig(x, y, size, pose = 'walking', delay = 0, coat = 'pink') {
    const legs = [[34,42,'far'],[65,42,'near'],[28,43,'near'],[71,42,'far']];
    const eye = pose === 'sleeping'
      ? '<path d="M76 29q2 3 5 0" fill="none" stroke="#705044" stroke-width="1.7" stroke-linecap="round"/>'
      : '<ellipse cx="80" cy="28" rx="1.55" ry="1.95" fill="#513c34"/>';
    const body = coat === 'ginger' ? 'woolly-body' : 'pig-body';
    const markings = { spotted: '<use href="#patches"/>', belted: '<use href="#white-belt"/>' };
    const ear = coat === 'belted' ? '<path d="M64 21Q57 14 61 4Q70 8 72 18Z" fill="#5c544e" stroke="#725e50" stroke-width="1.4"/>' : '';
    return `<g transform="translate(${x} ${y}) scale(${size})"><g class="pig ${pose} ${coat}" style="--phase:${delay}s">
      <g class="pig-direction"><ellipse cx="48" cy="54" rx="38" ry="3" fill="#859063" opacity=".19"/>
      ${legs.map(([lx,ly,side])=>`<g transform="translate(${lx} ${ly})"><g class="leg ${side}"><use href="#pig-leg"/></g></g>`).join('')}
      <g class="pig-back"><use href="#pig-tail" class="curly-tail"/><use href="#${body}"/>${markings[coat] || ''}
        <g class="pig-head"><use href="#pig-face"/>${ear}${eye}</g>
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

  // A front-facing sow sits belly-deep in the wallow. Her two ears and snout
  // read differently from the long side profiles even at phone sizes.
  function wallower(x, y, size) {
    return `<g transform="translate(${x} ${y}) scale(${size})"><g class="pig wallowing">
      <path d="M-34 6Q-32 -12 -18 -15Q7 -24 27 -12Q40 -6 37 6Q9 17 -34 6Z" fill="#cb9383" stroke="#805f50" stroke-width="1.6"/>
      <g class="mud-head">
        <path d="M-20 -19Q-32 -21 -33 -36Q-20 -39 -12 -26M11 -27Q22 -39 33 -36Q32 -24 20 -19" fill="#e9a797" stroke="#805f50" stroke-width="1.8"/>
        <path d="M-24 -14Q-24 -32 -4 -32Q17 -34 24 -18Q30 3 8 7Q-18 12 -24 -8Z" fill="#f0b9a5" stroke="#805f50" stroke-width="1.8"/>
        <path d="M-21 -9Q-15 -18 -8 -14Q-2 -10 -8 -4Q-16 0 -21 -9Z" fill="#a37560"/>
        <g fill="#513c34" class="mud-eyes"><ellipse cx="-11" cy="-12" rx="1.85" ry="2.35"/><ellipse cx="11" cy="-13" rx="1.85" ry="2.35"/></g>
        <ellipse cy="-2" rx="12" ry="7" fill="#df9b89" stroke="#996e5b" stroke-width="1.4"/>
        <path d="M-4 -3v2m8 -2v2" fill="none" stroke="#865950" stroke-linecap="round" stroke-width="2.5"/>
      </g><path d="M-36 8q11 -3 19 0m22 3q19 2 34 -5" fill="none" stroke="#b18d70" stroke-width="3" stroke-linecap="round"/>
    </g></g>`;
  }

  function fence(x, y, bays) {
    const end = bays * 49;
    const post = (_, i) => `<g transform="translate(${i * 49} 0)"><path d="M-3 0L-4 -30L0 -36L4 -31L4 0Z" fill="#c0a27d" stroke="#8d7559" stroke-width="1.2"/><path d="M0 -26L1 -7" stroke="#e4ceb0" stroke-width="1.2"/></g>`;
    return `<g transform="translate(${x} ${y})"><path d="M0 -24L${end} -26v5L0 -19ZM0 -11L${end} -13v5L0 -6Z" fill="#b69a78" stroke="#917758" stroke-width="1"/>
      ${Array.from({length:bays + 1}, post).join('')}</g>`;
  }

  function wallow(x, y, size) {
    return `<g transform="translate(${x} ${y}) scale(${size})"><path d="M-68 1Q-73 -8 -50 -11Q-36 -11 -24 -17Q-4 -23 19 -17Q28 -12 48 -12Q67 -11 69 -3Q76 7 53 11Q30 17 2 14Q-23 18 -41 12Q-64 11 -68 1Z" fill="#aa876d"/>
      <path d="M-52 -4q15 -5 26 -4m41 18q21 0 31 -5m-84 3q8 2 15 2" stroke="#d1ae8e" stroke-linecap="round" fill="none" stroke-width="2"/><ellipse cx="72" cy="10" rx="4" ry="1.8" fill="#b8997b"/></g>`;
  }

  function shelter() {
    return `<g transform="translate(33 8)"><path d="M3 32L34 5L72 28L72 66L3 66Z" fill="#b56e54" stroke="#855e4c" stroke-width="1.5"/>
      <path d="M-3 31L30 1Q34 -1 38 2L80 28L75 34L34 9L1 37Z" fill="#826d5b" stroke="#675a4a" stroke-width="1.8"/>
      <path d="M22 66V43Q32 28 46 41V66Z" fill="#665440"/><path d="M8 41V61M16 34V60M54 30V61M62 34V61" stroke="#ce9371" stroke-width="2"/>
      <path d="M20 66q10 -5 26 0m-20 2l9 -4m6 5l7 -3" stroke="#caaf73" fill="none" stroke-linecap="round"/></g>`;
  }

  const scenes = {
    mark: ['0 0 105 64', () => pig(0,0,1,'resting')],
    intro: ['0 0 510 250', () => tree()+grass(421,216,.86,true)+grass(468,191,.49)+grass(61,221,.58,true)+pig(215,171,.90,'walking',0,'spotted')+pig(133,192,.62,'walking',-3,'ginger')+pig(55,205,.49,'walking',-1)+grass(327,243,.57,true)],
    verge: ['0 0 245 79', () => grass(33,72,.57,true)+pig(83,32,.7,'walking',-5,'belted')+grass(198,67,.75)],
    wallow: ['0 0 535 106', () => fence(21,67,3)+grass(33,77,.72,true)+pig(67,30,.8,'rooting',-1,'ginger')+wallow(354,81,1.12)+wallower(357,77,.98)+pig(193,52,.62,'walking',-4,'spotted')+grass(474,87,.83,true)+grass(502,83,.51)],
    nursery: ['0 0 535 106', () => fence(245,67,5)+grass(472,74,.72,true)+pig(63,31,1,'rooting',-2,'belted')+grass(33,89,.56)+pig(184,51,.59,'walking',-6,'spotted')+pig(251,58,.46,'walking',-1)+pig(376,46,.72,'sleeping',-2,'ginger')+grass(495,88,.58)],
    rest: ['0 0 595 116', () => shelter()+fence(104,71,3)+fence(403,69,3)+grass(29,84,.61)+pig(111,43,.7,'sleeping',-1,'spotted')+pig(172,55,.50,'sleeping',-2)+wallow(334,85,1.09)+wallower(337,80,.89)+pig(435,46,.82,'rooting',-2,'ginger')+grass(559,82,.86,true)]
  };
  function scene(where, type) {
    if (!where) return;
    const [viewBox, art] = scenes[type];
    where.insertAdjacentHTML(type === 'mark' ? 'afterbegin' : 'beforeend', `<svg class="scenery scenery-${type}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${art()}</svg>`);
  }
  scene(document.querySelector('.wordmark'), 'mark');
  scene(document.querySelector('.intro-lead'), 'intro');
  scene(document.querySelector('#about'), 'wallow');
  scene(document.querySelector('#work'), 'nursery');
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
