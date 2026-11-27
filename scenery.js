(() => {
  const footer = document.querySelector('.colophon');
  footer?.insertAdjacentHTML('afterbegin','<div class="farm-landscape" data-farm="evening" aria-hidden="true"></div>');
  const introCopy=document.querySelector('.intro-copy');
  if(introCopy){
    const miniature=document.createElement('span');
    miniature.className='scenery-intro';miniature.dataset.farm='intro';miniature.setAttribute('aria-hidden','true');
    const narrow=matchMedia('(max-width: 760px)');
    const placeMiniature=()=>(narrow.matches?introCopy.querySelector('.intro-kicker'):introCopy).append(miniature);
    placeMiniature();narrow.addEventListener('change',placeMiniature);
  }
  document.querySelector('.wordmark')?.insertAdjacentHTML('afterbegin',
    '<svg class="scenery-mark" viewBox="0 0 44 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17c0-7 7-11 17-10l4-4 2 6q5 2 6 6l4 1v5l-5 1-3 3-1 4h-3l-1-4q-5 2-11 0l-1 4h-3l-1-6q-4-2-4-6Zm0 0q-6 3-4-2q2-3 3 0"/><circle cx="30" cy="14" r=".8"/></g></svg>');
  const hosts = [...document.querySelectorAll('[data-farm]')];
  if (!hosts.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.className = 'scenery-toggle';footer?.querySelector('.page')?.append(toggle);
  let paused = false, renderer, loading, failed = false, request = 0, lastFrame = 0;
  try { paused = localStorage.getItem('scenery-paused') === 'true'; } catch {}
  const states = hosts.map(host => {
    const kind = host.dataset.farm,canvas=document.createElement('canvas');
    canvas.className='pasture-canvas';canvas.setAttribute('aria-hidden','true');host.append(canvas);
    const state={host,kind,canvas,visible:false,clock:kind==='storybook'?1.3:.6,px:0,py:0,aimX:0,aimY:0};
    host.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse')return;
      const r=host.getBoundingClientRect();state.aimX=(e.clientX-r.left)/r.width*2-1;state.aimY=(e.clientY-r.top)/r.height*2-1;
    });
    host.addEventListener('pointerleave',()=>{state.aimX=state.aimY=0;});
    return state;
  });
  function loadScript(src) {
    return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.append(script);});
  }
  function displayPreference(){toggle.textContent=paused?'Play scenery':'Pause scenery';}
  function canRun(){return !failed&&!paused&&!reduced.matches&&!document.hidden&&states.some(s=>s.visible);}
  function disposeWorld(model) {
    if(!model)return;
    const resources=new Set();
    model.scene.traverse(node=>{
      if(node.geometry)resources.add(node.geometry);
      if(node.material){resources.add(node.material);if(node.material.map)resources.add(node.material.map);}
      if(node.shadow)resources.add(node.shadow);
    });
    resources.forEach(r=>r.dispose());
  }
  function draw(state,dt) {
    const {host,canvas,kind}=state,rect=host.getBoundingClientRect();
    if(rect.width<1||rect.height<1)return;
    const compact=rect.width<660, ratio=Math.min(devicePixelRatio||1,1.4,1540/rect.width);
    const w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);
    if(!state.model||state.compact!==compact){disposeWorld(state.model);state.model=window.createPasture(THREE,kind,compact);state.compact=compact;}
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    if(renderer.domElement.width!==w||renderer.domElement.height!==h)renderer.setSize(w,h,false);
    state.clock+=dt;state.px+=(state.aimX-state.px)*.08;state.py+=(state.aimY-state.py)*.08;
    const camera=state.model.frame(state.clock,w,h,state.px,state.py);
    renderer.render(state.model.scene,camera);
    state.context ||= canvas.getContext('2d',{alpha:true});
    state.context.clearRect(0,0,w,h);state.context.drawImage(renderer.domElement,0,0);
    host.classList.add('pasture-ready');
  }
  function fail(){failed=true;states.forEach(s=>s.host.classList.remove('pasture-ready'));toggle.hidden=true;}
  function tick(now) {
    request=0;if(!canRun()){lastFrame=0;return;}
    if(!lastFrame||now-lastFrame>=39){
      const dt=lastFrame?Math.min(.080,(now-lastFrame)/1000):0;lastFrame=now;
      try {for(const state of states)if(state.visible)draw(state,dt);} catch(error){console.error('Pasture rendering failed',error);fail();return;}
    }
    request=requestAnimationFrame(tick);
  }
  function wake(){
    if(!canRun()) {cancelAnimationFrame(request);request=0;lastFrame=0;return;}
    if(!loading)loading=Promise.all([loadScript('assets/pasture/three.min.js'),loadScript('pasture.js?v=1')]).then(()=>{
      renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.domElement.addEventListener('webglcontextlost',fail);
      wake();
    }).catch(fail);
    if(renderer&&!request)request=requestAnimationFrame(tick);
  }
  toggle.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('scenery-paused',String(paused));}catch{}displayPreference();wake();});
  displayPreference();
  document.addEventListener('visibilitychange',wake);
  reduced.addEventListener('change',wake);
  const byHost=new Map(states.map(s=>[s.host,s]));
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)byHost.get(entry.target).visible=entry.isIntersecting;
    wake();
  });
  hosts.forEach(host=>observer.observe(host));
})();
