/* Farm miniatures. Coordinates are in metres, with +Y up and +Z towards the viewer. */
window.createPasture = function createPasture(T, kind, compact) {
  const TAU = Math.PI * 2;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const ease = v => { const u = clamp(v); return u * u * (3 - 2 * u); };
  const pulse = (p, a, b, c, d) => ease((p-a)/(b-a)) * (1-ease((p-c)/(d-c)));
  const mix = (a,b,t) => a+(b-a)*t;
  let seed = {intro:41, morning:83, storybook:137, evening:271}[kind];
  function random() { seed = (Math.imul(1664525,seed)+1013904223) >>> 0; return seed / 4294967296; }
  const scene = new T.Scene(), camera = new T.OrthographicCamera();
  const miniature = kind === 'intro', dusk = kind === 'evening';
  const span = miniature ? 5.6 : compact ? 15 : 24;
  const world = new T.Group();
  scene.add(world);
  const updates = [];
  const geometries = {
    ball: new T.SphereGeometry(1,18,12), berry: new T.SphereGeometry(1,10,8),
    box: new T.BoxGeometry(1,1,1), cone: new T.ConeGeometry(1,1,5),
    post: new T.CylinderGeometry(1,1,1,8), crown: new T.IcosahedronGeometry(1,2)
  };
  const foliage = geometries.crown.attributes.position;
  for(let i=0;i<foliage.count;i++){
    const x=foliage.getX(i),y=foliage.getY(i),z=foliage.getZ(i);
    const r=1+.079*Math.sin(6*x+3*z)*Math.cos(5*y-2*z)+.048*Math.sin(9*z+3*y);
    foliage.setXYZ(i,x*r,y*r,z*r);
  }
  geometries.crown.computeVertexNormals();
  const clay = new T.MeshLambertMaterial({vertexColors:true});
  function joint(parent,x=0,y=0,z=0) {
    const node=new T.Group(); node.position.set(x,y,z); parent.add(node); return node;
  }
  function shape(parent,geometry,color,x,y,z,sx,sy,sz) {
    const mesh=new T.Mesh(geometry,clay); mesh.position.set(x,y,z); mesh.scale.set(sx,sy,sz);
    mesh.userData.paint=new T.Color(color); parent.add(mesh); return mesh;
  }
  const ball=(p,c,x,y,z,a,b,d)=>shape(p,geometries.ball,c,x,y,z,a,b,d);
  const dot=(p,c,x,y,z,a,b,d)=>shape(p,geometries.berry,c,x,y,z,a,b,d);
  const box=(p,c,x,y,z,a,b,d)=>shape(p,geometries.box,c,x,y,z,a,b,d);
  const crown=(p,c,x,y,z,a,b,d)=>shape(p,geometries.crown,c,x,y,z,a,b,d);
  function stick(parent,color,start,end,radius) {
    const a=new T.Vector3(...start), b=new T.Vector3(...end), v=b.clone().sub(a);
    const m=shape(parent,geometries.post,color,(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2,radius,v.length(),radius);
    m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize()); return m;
  }
  function wire(parent,color,points,radius) {
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    return shape(parent,new T.TubeGeometry(curve,points.length*3,radius,6,false),color,0,0,0,1,1,1);
  }
  // Bake the rigid geometry at each joint together. An ear can flex independently
  // while all the coloured surfaces attached to it share a single draw call.
  function bake(node) {
    for(const child of [...node.children]) if(child.isGroup) bake(child);
    const parts=node.children.filter(c=>c.userData.paint);
    if(!parts.length)return;
    const pos=[],norm=[],col=[],index=[];
    const point=new T.Vector3(), normal=new T.Vector3(), nm=new T.Matrix3();
    for(const part of parts){
      part.updateMatrix(); nm.getNormalMatrix(part.matrix);
      const g=part.geometry, vertices=g.attributes.position, normals=g.attributes.normal;
      const first=pos.length/3, paint=part.userData.paint, pattern=part.userData.pattern;
      for(let i=0;i<vertices.count;i++){
        point.fromBufferAttribute(vertices,i);
        const ink=pattern ? pattern(point) || paint : paint;
        point.applyMatrix4(part.matrix); normal.fromBufferAttribute(normals,i).applyNormalMatrix(nm);
        pos.push(point.x,point.y,point.z);norm.push(normal.x,normal.y,normal.z);col.push(ink.r,ink.g,ink.b);
      }
      if(g.index){for(const i of g.index.array)index.push(first+i);}
      else{for(let i=0;i<vertices.count;i++)index.push(first+i);}
      node.remove(part);
    }
    const g=new T.BufferGeometry();
    for(const [name,list] of [['position',pos],['normal',norm],['color',col]])g.setAttribute(name,new T.Float32BufferAttribute(list,3));
    g.setIndex(index);const mesh=new T.Mesh(g,clay);mesh.castShadow=true;mesh.receiveShadow=true;node.add(mesh);
  }
  function terrain(x,z) {
    // Level foreground lets planted hooves and the mud surface share one datum.
    const rise=ease((-z-4)/12);
    return rise*(1.65+.83*Math.sin(x*.17-z*.21)+.48*Math.cos(x*.31+z*.13)) + ease((-z-17)/9)*2;
  }
  function field() {
    const ground=new T.PlaneGeometry(90,56,100,72);
    ground.rotateX(-Math.PI/2);ground.translate(0,0,-12);
    const v=ground.attributes.position, colors=[];
    const near=new T.Color(dusk?'#89977b':'#b4c38d'),far=new T.Color(dusk?'#8a92a3':'#95af94');
    for(let i=0;i<v.count;i++){
      const x=v.getX(i),z=v.getZ(i);v.setY(i,terrain(x,z));
      const patch=.5+.5*Math.sin(x*.52+Math.cos(z*.85)*1.4)*Math.cos(z*.88+x*.19);
      const c=near.clone().lerp(far,ease((-z-3)/19)).lerp(new T.Color(dusk?'#848e80':'#9ba77c'),patch*.43).multiplyScalar(.97+random()*.035);
      colors.push(c.r,c.g,c.b);
    }
    ground.computeVertexNormals();ground.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    const paper=document.createElement('canvas');paper.width=paper.height=192;
    const ctx=paper.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,192,192);
    for(let i=0;i<2800;i++){ctx.strokeStyle=i%3?'rgba(105,110,88,.12)':'rgba(149,142,110,.16)';ctx.lineWidth=.65+random()*.7;
      const x=random()*192,y=random()*192;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+random()*2,y-random()*3);ctx.stroke();}
    const grain=new T.CanvasTexture(paper);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(33,20);grain.colorSpace=T.SRGBColorSpace;
    const groundMat=clay.clone();groundMat.map=grain;const mesh=new T.Mesh(ground,groundMat);mesh.receiveShadow=true;scene.add(mesh);
  }
  function tuft(parent,x,y,z,size,flower=false) {
    for(let n=0;n<4;n++){
      const h=size*(.58+random()*.48), dx=(random()-.5)*size*.85;
      const blade=shape(parent,geometries.cone,n%2?'#89975f':'#a5a96c',x+dx,y+h*.46,z+(random()-.5)*size*.4,.026+h*.055,h,.027);
      blade.rotation.z=dx/size*1.3;
    }
    if(flower){
      stick(parent,'#79875b',[x,y,z],[x+.04,y+size,z],.014);
      for(let n=0;n<5;n++){const a=n*TAU/5;dot(parent,'#fff0cc',x+.04+Math.cos(a)*.048,y+size+.012,z+Math.sin(a)*.048,.048,.029,.036);}
      dot(parent,'#cf9853',x+.04,y+size+.035,z,.036,.027,.036);
    }
  }
  function meadowGrass() {
    // Each blade bends towards the same travelling gust. The root vertices have
    // zero displacement. Flowering clumps also partially hide the pigs' hooves.
    const pos=[],cols=[],weights=[];const ink=new T.Color();
    const shades=dusk?['#879367','#9e9e76','#707f60']:['#a3b075','#96a469','#c2c485','#859862'];
    const count=compact?850:1560;
    for(let i=0;i<count;i++){
      const x=(random()-.5)*(span+7),z=7.4-random()*19.5,base=terrain(x,z);
      for(let j=0;j<7;j++){
        const px=x+(random()-.5)*.38,pz=z+(random()-.5)*.24,h=.065+random()*.18,w=.012+random()*.016;
        const dx=(random()-.5)*.22;ink.set(shades[(random()*shades.length)|0]);
        pos.push(px-w,base,pz,px+w,base,pz,px+dx,base+h,pz+.035);weights.push(0,0,h);
        for(let q=0;q<3;q++){const tint=q===2?1.18:.85;cols.push(ink.r*tint,ink.g*tint,ink.b*tint);}
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setAttribute('bladeHeight',new T.Float32BufferAttribute(weights,1));
    const time={value:0},mat=new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{s.uniforms.breezeTime=time;s.vertexShader='uniform float breezeTime; attribute float bladeHeight;\n'+s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float gust=sin(position.x*.68-position.z*.84+breezeTime*1.65)+.42*sin(position.x*1.61+breezeTime*2.7);
      transformed.x+=bladeHeight*gust*.32; transformed.z+=bladeHeight*gust*.12;`);};
    scene.add(new T.Mesh(g,mat));updates.push(t=>{time.value=t;});
  }
  function fence(parent,start,end,z) {
    const length=end-start,n=Math.round(length/.38);
    for(const h of [.28,.54])box(parent,'#dbdccc',(start+end)/2,h,z,length,.074,.07);
    for(let i=0;i<=n;i++){
      const x=mix(start,end,i/n),h=.66+Math.sin(i*1.5)*.025;
      box(parent,'#f6f0db',x,h/2,z+.06,.17,h,.095);
      const peak=shape(parent,geometries.cone,'#f6f0db',x,h+.056,z+.06,.121,.115,.073);peak.rotation.y=Math.PI/4;
    }
  }
  function tree(parent,x,z,s,fruit=false) {
    const y=terrain(x,z);stick(parent,'#8f7559',[x,y,z],[x+.13*s,y+1.83*s,z],.10*s);
    stick(parent,'#957c5c',[x+.07*s,y+1.03*s,z],[x-.35*s,y+1.65*s,z],.054*s);
    const leaves=joint(parent,x+.12*s,y+1.4*s,z);leaves.scale.setScalar(s);
    const palette=dusk?['#74866d','#87957b','#697e6c']:['#84996c','#a3b47c','#92a775'];
    for(let i=0;i<9;i++){
      const a=i*2.39, r=i<6?.49:.25;
      const px=Math.cos(a)*r, py=.34+Math.sin(i*.92)*.22+(i>5?.40:0), pz=Math.sin(a)*r;
      const twig=z>-6&&i%3===0?joint(leaves,px*.6,py*.5,pz*.6):leaves;
      if(twig!==leaves)updates.push(t=>{twig.rotation.z=.042*Math.sin(t*1.6+i*.7+x);twig.rotation.x=.019*Math.cos(t*1.13+i);});
      const lobe=crown(twig,palette[i%3],twig===leaves?px:px*.4,twig===leaves?py:py*.5,twig===leaves?pz:pz*.4,.58,.51+random()*.20,.49);lobe.rotation.y=i*.8;
    }
    if(fruit)for(let i=0;i<10;i++){let a=i*2.4;dot(leaves,'#c57b62',Math.cos(a)*.87,.28+(i%3)*.16,Math.sin(a)*.82,.085,.088,.085);}
    const phase=random()*6;updates.push(t=>{leaves.rotation.z=.019*Math.sin(t*1.46+phase)+.009*Math.sin(t*.74+x);});
  }
  function house(parent,x,z,size,style) {
    const h=joint(parent,x,terrain(x,z),z);h.scale.setScalar(size);h.rotation.y=-.16;
    const brick=style==='brick',straw=style==='straw',wood=style==='stick';
    const wall=brick?'#bd806a':wood?'#ae9471':straw?'#d4b77b':'#f0dec0';
    const roof=straw?'#c3a263':wood?'#918167':'#b26e57';
    box(h,wall,0,.72,0,1.85,1.44,1.45);
    const face=new T.Shape();face.moveTo(-.925,0);face.lineTo(.925,0);face.lineTo(0,.81);face.closePath();
    shape(h,new T.ExtrudeGeometry(face,{depth:1.45,bevelEnabled:false}),wall,0,1.44,-.725,1,1,1);
    for(const sign of [-1,1]){
      const slope=box(h,roof,sign*.53,1.84,0,1.48,.13,1.77);slope.rotation.z=-sign*.71;
      for(let j=0;j<8;j++)stick(h,straw?'#d8bc80':wood?'#a69170':'#bd7f65',[sign*.025,2.34,-.78+j*.22],[sign*1.07,1.43,-.78+j*.22],straw?.031:.018);
    }
    if(straw){
      // Bundles follow the roof pitch and break up the silhouette at the eaves.
      for(const side of [-1,1])for(let i=0;i<19;i++){
        const z=-.91+i*.101, drop=random()*.10;
        stick(h,i%3?'#cfb173':'#ddc387',[side*.015,2.38,z],[side*1.12,1.40-drop,z+.02],.047);
      }
    }else if(wood){
      for(const side of [-1,1])for(let i=0;i<8;i++)
        stick(h,'#81705c',[side*.02,2.39,-.84+i*.24],[side*1.11,1.39,-.90+i*.24],.036);
      stick(h,'#8f775a',[-.88,.08,.793],[-.25,1.26,.793],.043);
    }
    if(straw||wood)for(let i=0;i<14;i++)stick(h,straw?'#bb9b64':'#8d7456',[-.86+i*.13,.06,.738],[-.83+i*.13,1.41,.74],wood?.032:.016);
    if(brick)for(let row=0;row<7;row++)for(let i=0;i<4;i++)box(h,'#d79a7f',-.78+i*.42+(row%2)*.12,.16+row*.18,.732,.24,.085,.02);
    box(h,'#5e7569',.02,.44,.756,.39,.87,.055);
    dot(h,'#e7c08a',.15,.45,.8,.025,.025,.02);
    for(const wx of [-.56,.56]){
      box(h,'#e8d8b7',wx,.80,.754,.40,.48,.06);
      box(h,dusk?'#ffca76':'#8ba79d',wx,.80,.793,.31,.38,.015);
      box(h,'#eee6c9',wx,.8,.81,.027,.38,.025);box(h,'#eee6c9',wx,.8,.81,.31,.027,.025);
      box(h,'#a87561',wx,.52,.83,.45,.12,.15);
      for(let j=0;j<4;j++)dot(h,j%2?'#d58a78':'#899867',wx-.15+j*.1,.61,.84,.055,.07,.048);
    }
    if(!wood&&!straw){
      box(h,'#e6d5b7',0,1.69,.741,.29,.31,.052);box(h,dusk?'#ffce80':'#7c968b',0,1.69,.776,.22,.24,.026);
      for(const wx of [-.56,.56])for(const side of [-1,1]){
        box(h,'#91a18d',wx+side*.255,.8,.752,.095,.45,.045);
        for(let k=0;k<3;k++)box(h,'#788b79',wx+side*.255,.69+k*.09,.785,.074,.014,.014);
      }
    }
    if(dusk){
      const lit=new T.MeshBasicMaterial({color:'#ffdc9f'});
      for(const wx of [-.56,.56])for(const offset of [-.08,.08])for(const dy of [-.10,.10]){
        const pane=new T.Mesh(new T.PlaneGeometry(.125,.155),lit);pane.position.set(wx+offset,.80+dy,.813);h.add(pane);
      }
    }
    box(h,'#dbc5a0',0,.055,.93,.68,.11,.43);
    if(!straw&&!wood){box(h,'#ac7966',.50,2.16,-.38,.23,.78,.24);box(h,'#c19376',.50,2.55,-.38,.28,.09,.28);}
    if(!brick&&!wood&&!straw){
      const porch=box(h,'#8b9a87',0,1.13,1.02,1.72,.095,.62);porch.rotation.x=.13;
      for(const side of [-.74,.74])box(h,'#f4e7ce',side,.54,1.26,.065,1.06,.065);
    }
  }
  function ear(parent,side,coat,wolf=false) {
    const base=joint(parent,.035,.17,side*.165), tip=wolf?.34:.29;
    const vertices=[-.13,0,0,.12,0,0,-.07,tip,side*.116,0,.06,-side*.10];
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
    g.setIndex(side>0?[0,1,2,0,3,1,1,3,2,2,3,0]:[2,1,0,1,3,0,2,3,1,0,3,2]);g.computeVertexNormals();
    shape(base,g,coat,0,0,0,1,1,1);shape(base,g,wolf?'#a79186':'#d79589',.001,.03,side*.011,.61,.68,.91);
    return base;
  }
  const stamp=document.createElement('canvas');stamp.width=stamp.height=64;
  const pen=stamp.getContext('2d'),gradient=pen.createRadialGradient(32,32,2,32,32,32);
  gradient.addColorStop(0,'rgba(79,66,51,.33)');gradient.addColorStop(.54,'rgba(79,66,51,.14)');gradient.addColorStop(1,'rgba(79,66,51,0)');
  pen.fillStyle=gradient;pen.fillRect(0,0,64,64);
  const contactMaterial=new T.MeshBasicMaterial({map:new T.CanvasTexture(stamp),transparent:true,depthWrite:false});
  function groundContact(parent,x,z,size){
    const shade=new T.Mesh(new T.PlaneGeometry(1.8*size,.93*size),contactMaterial);
    shade.rotation.x=-Math.PI/2;shade.position.set(x,.011,z);parent.add(shade);
  }
  function pig(parent,x,z,size,coat='blush') {
    groundContact(parent,x,z,size);
    const pivot=joint(parent,x,0,z);pivot.name='piglet-'+coat;pivot.scale.setScalar(size);
    const ink={blush:'#ebbaaa',spotted:'#e8c9b3',ginger:'#d6a477',belt:'#958880'}[coat];
    const dark=new T.Color('#766a62'),pale=new T.Color('#f3dcca');
    const spine=joint(pivot,0,.52,0),torso=joint(spine), barrel=ball(torso,ink,-.08,0,0,.54,.345,.33);
    if(coat==='spotted')barrel.userData.pattern=v=>((v.x+.34)**2+(v.y-.45)**2<.26 || (v.x-.26)**2+(v.z-.91)**2<.11)?dark:null;
    if(coat==='belt')barrel.userData.pattern=v=>v.x>.05&&v.x<.51?pale:null;
    const neck=joint(torso,.29,.025,0);neck.name='neck';
    ball(neck,ink,.12,.02,0,.345,.29,.28);
    const muzzle=ball(neck,'#df9d94',.402,-.038,0,.115,.123,.175);muzzle.rotation.z=-.14;
    for(const s of [-1,1])dot(neck,'#795b55',.50,-.03,s*.067,.018,.037,.024);
    wire(neck,'#946e62',[[.407,-.127,.09],[.375,-.14,.13],[.351,-.13,.155]],.009);
    const ears=[ear(neck,-1,ink),ear(neck,1,coat==='spotted'?'#776b63':ink)];
    const eyes=[-1,1].map(side=>{
      const eye=joint(neck,.255,.088,side*.237);
      dot(eye,'#403a35',0,0,0,.043,.053,.031);dot(eye,'#fff5da',.014,.014,side*.017,.010,.010,.009);
      return eye;
    });
    const tail=joint(torso,-.57,.015,0);
    wire(tail,'#ca9484',[[0,0,0],[-.08,.035,.012],[-.117,.102,.036],[-.06,.14,.068],[-.03,.091,.084],[-.09,.06,.089],[-.163,.095,.08]],.018);
    const legs=[];
    for(const front of [-1,1])for(const side of [-1,1]){
      const hip=joint(spine,front*.31-.025,-.106,side*.19);
      ball(hip,ink,0,-.100,0,.102,.161,.093);
      const knee=joint(hip,0,-.235,0);ball(knee,ink,0,-.078,0,.068,.120,.066);
      const foot=joint(knee,0,-.20,0);foot.name='hoof';
      for(const toe of [-1,1])dot(foot,'#a88170',.018,-.004,toe*.028,.083,.049,.035);
      legs.push({front,side,hip,knee,foot});
    }
    const phase=random()*6;
    function pose(t,options={}) {
      const lower=options.lower||0, lift=options.lift||0, roll=options.roll||0;
      torso.position.y=-lower+Math.sin(t*2.5+phase)*.012;
      spine.rotation.x=roll;torso.rotation.z=options.lean||0;
      torso.scale.set(1,1+.015*Math.sin(t*2.6+phase),1+.012*Math.sin(t*2.6+phase));
      neck.rotation.set(options.tilt||0,options.look||0,options.nod||0);
      neck.position.x=.29+(options.reach||0);
      const blink=(t+phase)%4.83;
      for(const e of eyes)e.scale.y=options.asleep?.10:blink<.16?.12+.88*Math.abs(blink-.08)/.08:1;
      ears.forEach((e,i)=>{e.rotation.x=(i?1:-1)*(.23+.09*Math.sin(t*2+phase)+(options.alert||0));
        e.rotation.z=-.25+.10*Math.sin(t*2.8+i+phase)+.35*pulse((t*.38+phase+i*.4)%1,.22,.27,.28,.35);});
      tail.rotation.x=.24*Math.sin(t*6+phase);tail.rotation.z=.12*Math.sin(t*4.1+phase);
      for(const leg of legs){
        const {front,side,hip,knee,foot}=leg;
        if(options.bellyUp){
          hip.position.y=-.106;hip.rotation.z=front*(.32+.42*Math.sin(t*5+side+front));knee.rotation.z=-.30+side*.30*Math.cos(t*6);
          hip.rotation.x=side*(.36+.16*Math.cos(t*4+front));foot.rotation.z=.18*Math.sin(t*5);continue;
        }
        hip.rotation.x=0;hip.position.y=-.106-lower*.8;
        // Solve to a fixed ground contact; the knees flex as the weight shifts.
        const down=Math.max(.09,.52+hip.position.y-.05-lift*(front>0?.14:.11));
        const brace=(options.brace||0)*front;
        hip.position.x=front*.31-.025-brace;
        const dx=brace+lift*(front>0?.15:-.14);
        const length=clamp(Math.hypot(dx,down),.04,.4349);
        const a=Math.atan2(dx,down)+front*Math.acos(clamp((.235**2+length**2-.20**2)/(.47*length),-1,1));
        const b=Math.atan2(dx-.235*Math.sin(a),down-.235*Math.cos(a));
        hip.rotation.z=a;knee.rotation.z=b-a;foot.rotation.z=-b+lift*front*.45;
      }
    }
    return {pivot,neck,pose};
  }
  function wolf(parent,x,z) {
    const base=joint(parent,x,0,z);base.rotation.y=-.26;
    const grey='#8d8b89',light='#bfb8a8';
    ball(base,grey,-.18,.42,0,.39,.46,.27);ball(base,light,-.34,.22,.13,.25,.20,.17);
    const chest=joint(base,0,.33,0);ball(chest,grey,-.035,.34,0,.28,.46,.26);
    ball(chest,'#b96d54',.029,.58,0,.248,.14,.26);
    const head=joint(chest,.02,.71,0);ball(head,grey,.035,.03,0,.29,.26,.235);
    ball(head,light,.30,-.012,0,.29,.115,.14);dot(head,'#4f4944',.54,0,0,.068,.062,.091);
    const jaw=joint(head,.17,-.09,0);ball(jaw,light,.105,0,0,.17,.046,.102);
    const ears=[ear(head,-1,grey,true),ear(head,1,grey,true)];
    for(const s of [-1,1])dot(head,'#413c35',.211,.09,s*.166,.032,.041,.027);
    for(const s of [-1,1]){stick(base,grey,[.08,.59,s*.155],[.22,.12,s*.15],.067);ball(base,light,.263,.085,s*.15,.124,.081,.077);}
    const tail=joint(base,-.38,.29,0);const plume=ball(tail,grey,-.25,.11,0,.35,.135,.14);plume.rotation.z=-.41;
    dot(tail,'#d1cabb',-.52,.23,0,.13,.09,.095);
    return (t,blow,inhale)=>{chest.rotation.z=.15*inhale-.28*blow;chest.scale.z=1+.14*inhale;
      head.rotation.z=.11*inhale-.11*blow;jaw.rotation.z=-.32*blow;ears[0].rotation.z=ears[1].rotation.z=.13-.28*blow;
      tail.rotation.y=.19*Math.sin(t*2);};
  }
  function pool(parent,x,z,s) {
    const m=ball(parent,'#9c8267',x,.016,z,s,.05,s*.51);
    m.rotation.y=-.22;
    for(const k of [-1,1])wire(parent,'#c1a58a',[[x+k*.35,.069,z+.12],[x+k*.56,.064,z+.20],[x+k*.74,.060,z+.17]],.014);
  }
  function firefly(parent,color) {
    const body=joint(parent);
    dot(body,color,0,0,0,.048,.046,.04);
    const wings=[-1,1].map(s=>{const wing=joint(body,0,.02,s*.016);ball(wing,'#f1ddb0',0,.014,s*.057,.042,.011,.074);return wing;});
    return {body,wings};
  }
  function forage(x,z,size,apple=true) {
    const piglet=pig(world,x,z,size,'blush');piglet.pivot.rotation.y=-.55;
    const fruit=joint(world,x+.90*size,.10*size,z+.44*size);
    if(apple){ball(fruit,'#bd6c53',0,0,0,.118*size,.111*size,.113*size);stick(fruit,'#80684c',[0,.08*size,0],[.025*size,.155*size,0],.012*size);}
    updates.push(t=>{
      const p=(t%5.2)/5.2,dig=pulse(p,.03,.23,.41,.66),nudge=pulse(p,.29,.39,.42,.56);
      piglet.pose(t,{lower:.12*dig,nod:-.63*dig+.04*Math.sin(t*9)*dig,reach:.13*dig+.07*nudge,brace:.026*dig,look:.08*Math.sin(t*.8)});
      const travel=p<.35?0:p<.57?ease((p-.35)/.22):1-ease((p-.57)/.43);
      fruit.position.x=x+size*(.82+.26*travel);fruit.rotation.z=-2.4*travel;
    });
  }
  function hopper(x,z,size,night=false) {
    const h=pig(world,x,z,size,'spotted'),bug=firefly(world,night?'#fff1a1':'#c7934e');
    updates.push(t=>{
      const p=(t%5.4)/5.4,air=clamp((p-.21)/.22),arc=Math.sin(Math.PI*air);
      const crouch=pulse(p,.03,.16,.17,.23)+.8*pulse(p,.408,.45,.47,.59);
      h.pivot.position.y=arc*.47*size;
      h.pivot.rotation.y=-.54+.25*Math.sin(t*.9);
      h.pose(t,{lift:arc,lower:.11*crouch,nod:.24*Math.sin(t*1.16)+.12*arc,look:-.23*Math.sin(t*.92),lean:.13*arc,alert:-.20*arc});
      bug.body.position.set(x+size*(.92+.21*Math.sin(t*1.15)),size*(1.16+.13*Math.sin(t*2.23)),z+.44+.22*Math.cos(t*1.2));
      bug.wings.forEach((w,i)=>w.rotation.x=(i?1:-1)*(.55+.68*Math.sin(t*24)));
    });
  }
  function bathe(x,z,size) {
    pool(world,x,z,size*1.13);
    const b=pig(world,x,z,size,'ginger');b.pivot.rotation.y=-.48;
    const drops=Array.from({length:6},(_,i)=>{const drop=joint(world);dot(drop,'#96795e',0,0,0,.035+i*.002,.037,.028);return drop;});
    updates.push(t=>{
      const p=(t%4.4)/4.4,roll=.25+.61*Math.sin(t*1.43);
      b.pivot.position.y=-.29*size;b.pose(t,{roll:2.56+roll,bellyUp:true,tilt:.12*Math.sin(t*2),nod:.09*Math.cos(t*2.6)});
      drops.forEach((d,i)=>{const u=clamp((p-.28-i*.011)/.21),s=i%2?1:-1;d.visible=u>0&&u<1;
        d.position.set(x+s*size*(.24+u*(.45+i*.05)),size*(.13+Math.sin(u*Math.PI)*(.24+i*.037)),z+size*(.12+i*.038+u*.23));});
    });
  }
  function story() {
    const xs=[-.29*span,.015*span,.32*span];
    for(let i=0;i<3;i++)house(world,xs[i],-2.6,compact?.92:1.17,['straw','stick','brick'][i]);
    const w=wolf(world,-span*.397,1.5);
    const startled=pig(world,-span*.225,1.65,1.07,'spotted');startled.pivot.rotation.y=-.64;
    const builder=pig(world,span*.015,1.05,1.08,'blush');builder.pivot.rotation.y=-.45;
    const twig=joint(world);
    stick(twig,'#877052',[-.08,0,0],[.52,.13,.12],.035);stick(twig,'#95805b',[.26,.07,.07],[.35,.21,.10],.024);
    const third=pig(world,xs[2]-.60,-.22,1.05,'ginger');third.pivot.rotation.y=-.68;
    // A low wall occludes the third pig when it crouches.
    for(let r=0;r<3;r++)for(let i=0;i<4;i++)box(world,'#bc8f77',xs[2]-1.18+i*.36+.14*(r%2),.095+r*.19,.38,.347,.176,.23);
    const straw=Array.from({length:7},(_,i)=>{const stalk=joint(world);box(stalk,'#ccac6b',0,0,0,.17+i*.016,.025,.028);return stalk;});
    const grip=new T.Vector3();
    updates.push(t=>{
      const p=(t%7.6)/7.6, inhale=pulse(p,.09,.27,.28,.39),blow=pulse(p,.27,.35,.40,.56);
      const u=clamp((p-.36)/.16),hop=Math.sin(u*Math.PI);
      w(t,blow,inhale);
      startled.pivot.position.y=hop*.48;startled.pose(t,{lift:hop,lower:.13*pulse(p,.30,.345,.35,.375)+.08*pulse(p,.49,.54,.55,.61),nod:.18*hop,look:.65*blow,alert:-.4*blow});
      const bend=.5+.5*Math.cos(t*1.28);
      builder.pose(t,{lower:.09*bend,nod:-.50*bend+.16,reach:.09*bend,brace:.025*bend});
      // Resolve the twig's grip from the animated snout, in world space.
      builder.pivot.updateWorldMatrix(true,true);
      grip.set(.48,-.13,0).applyMatrix4(builder.neck.matrixWorld);
      twig.position.copy(grip);twig.rotation.set(0,.48,-.2+.45*(1-bend));
      const duck=pulse(p,.32,.42,.62,.81);third.pose(t,{lower:.20*duck,nod:-.29*duck,look:.43*Math.sin(t*.85),alert:-.28*blow});
      straw.forEach((s,i)=>{const v=clamp((p-.33-i*.013)/.25);s.visible=v>0&&v<1;
        s.position.set(xs[0]-.42+v*(1.2+i*.13),1.5+i*.045+Math.sin(v*Math.PI)*.46-v*.75,-1.73+.48*v);
        s.rotation.set(v*4+i,.3*i,v*6+i);});
    });
  }
  function sleepAt(x,z,s,coat,phase) {
    const p=pig(world,x,z,s,coat);p.pivot.rotation.y=-.66+phase*.09;
    updates.push(t=>{p.pose(t,{lower:.235,nod:-.24,tilt:.16,look:.22,brace:.085,asleep:true});});
  }
  function fireflies() {
    for(let i=0;i<9;i++){
      const pos=[(random()-.5)*span*.85,.42+random()*.70,random()*3.6-1];
      const fly=dot(world,'#ffdf92',...pos,.032,.032,.032);
      // Separate transform, since the dots themselves will be baked.
      const pivot=joint(world,...pos);pivot.add(fly);fly.position.set(0,0,0);
      updates.push(t=>{pivot.position.set(pos[0]+.24*Math.sin(t*.67+i),pos[1]+.15*Math.sin(t*1.11+i),pos[2]+.19*Math.cos(t*.81+i));
        pivot.scale.setScalar(.58+.48*Math.sin(t*1.65+i));});
    }
  }
  const sky=new T.HemisphereLight(dusk?'#b6bddc':'#eff4fc',dusk?'#a19388':'#aaae92',1.65);scene.add(sky);
  const sun=new T.DirectionalLight(dusk?'#ffd3ac':'#fff0d8',2.25);
  sun.position.set(-6,10,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  const reach=miniature?4:span*.76;Object.assign(sun.shadow.camera,{left:-reach,right:reach,top:reach,bottom:-reach,near:.1,far:52});sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.normalBias=.022;sun.shadow.bias=-.00028;sun.shadow.radius=3;scene.add(sun);
  if(miniature) {
    forage(-.92,0,1.14);const small=pig(world,.91,-.24,.72,'ginger');small.pivot.rotation.y=2.63;
    updates.push(t=>small.pose(t,{look:.16*Math.sin(t*1.2),nod:.10+.16*Math.sin(t*2.3),alert:-.16*Math.sin(t*3)}));
    for(const [x,z] of [[-1.67,.05],[1.36,.32],[.51,-.51]])tuft(world,x,0,z,.33,true);
    const mat=new T.ShadowMaterial({color:0x746957,opacity:.17});
    const plane=new T.Mesh(new T.PlaneGeometry(9,5),mat);plane.rotation.x=-Math.PI/2;plane.position.y=-.003;plane.receiveShadow=true;scene.add(plane);
  } else {
    scene.fog=new T.FogExp2(dusk?'#d4bebd':'#dde5d8',dusk?.027:.021);
    field();meadowGrass();
    // Staggered hedges and canopies make depth legible even with a still pointer.
    for(const centre of [-15,-8,1.8,12,21]){
      for(let i=0;i<3;i++){const x=centre+i*.85+random()*.52,z=-11-random()*7;
        tree(world,x,z,.38+random()*.66);}
    }
    for(let i=0;i<38;i++){
      const x=(random()-.5)*span*1.35,z=2.7-random()*6;
      tuft(world,x,0,z,.17+random()*.18,i%3===0);
    }
    fence(world,-span*.72,-span*.18,-1.23);fence(world,span*.19,span*.75,-1.53);
    if(kind==='storybook')story();
    else {
      const houseX=span*(dusk?.205:-.245);
      house(world,houseX,-3.28,compact?1.25:1.48,'farm');
      tree(world,span*(dusk?-.35:.31),-2.63,compact?1.12:1.45,true);
      tree(world,houseX-2.2,-4.18,.95);
      // Flat stepping stones follow the farm door rather than a straight line.
      for(let i=0;i<9;i++){const z=-1.45+i*.28,x=houseX+Math.sin(i*.43)*.42;
        const step=dot(world,'#c8bea2',x,.024,z,.25+random()*.1,.027,.125);step.rotation.y=random()*.9;}
      if(dusk){hopper(-span*.26,1.5,1.05,true);sleepAt(span*.19,1.62,1.11,'spotted',0);sleepAt(span*.24,1.03,.83,'blush',1.3);fireflies();}
      else{forage(-span*.25,1.62,1.17);bathe(span*.055,1.16,1.04);hopper(span*.31,2.05,1.04);}
    }
  }
  bake(world);
  const view=new T.PerspectiveCamera(27,1,.1,100),target=new T.Vector3();
  function frame(t,width,height,px=0,py=0) {
    for(const update of updates)update(t);
    const aspect=width/height;
    if(miniature) {
      const w=4.15;Object.assign(camera,{left:-w/2,right:w/2,top:w/aspect/2,bottom:-w/aspect/2,near:.1,far:30});
      camera.position.set(2,2.05,6);camera.lookAt(0,.47,0);camera.updateProjectionMatrix();return camera;
    }
    const distance=span/(2*aspect*Math.tan(Math.PI*27/360));
    target.set(0,compact?1.40:1.67,-.55);
    view.aspect=aspect;view.position.set(distance*(.105+px*.024),target.y+distance*(.206+py*.009),target.z+distance*.97);
    view.lookAt(target);view.updateProjectionMatrix();return view;
  }
  return {scene,frame};
};
