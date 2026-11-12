(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasGsap=!!(window.gsap&&window.ScrollTrigger);
if(hasGsap)gsap.registerPlugin(ScrollTrigger);

/* ---------- cinematic story ---------- */
function initStory(){
  var story=$('#story');if(!story||!hasGsap)return;
  var scenes=$$('.scene'),imgs=scenes.map(function(s){return s.querySelector('img')});
  var panels=$$('.panel',story);
  var n=scenes.length;
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:story,start:'top top',end:'bottom bottom',scrub:.8}});
  tl.set({}, {}, n); /* fixes total duration to n */
  for(var i=0;i<n;i++){
    tl.fromTo(imgs[i],{scale:1.04},{scale:1.16,duration:1},i);
    if(i<n-1){
      tl.to(scenes[i],{opacity:0,duration:.4},i+.3);
      tl.fromTo(scenes[i+1],{opacity:0},{opacity:1,duration:.4},i+.3);
    }
  }
  /* copy blocks */
  panels.forEach(function(p,idx){
    var c=$('.copy',p);if(!c)return;
    if(idx===0){
      gsap.to(c,{opacity:0,y:-60,ease:'none',scrollTrigger:{trigger:p,start:'30% top',end:'75% top',scrub:true}});
      return;
    }
    gsap.timeline({scrollTrigger:{trigger:p,start:'top 70%',end:'bottom 30%',scrub:.6}})
      .fromTo(c,{opacity:0,y:50},{opacity:1,y:0,duration:.3,ease:'power2.out'})
      .to(c,{opacity:1,duration:.4})
      .to(c,{opacity:0,y:-50,duration:.3,ease:'power2.in'});
  });
  /* progress + hide when leaving story */
  var pgN=$('#pg-n'),pgBar=$('#pg-bar'),pg=$('#progress');
  ScrollTrigger.create({trigger:story,start:'top top',end:'bottom bottom',onUpdate:function(self){
    var k=Math.min(n,Math.floor(self.progress*n)+1);
    pgN.textContent='0'+k;pgBar.style.width=(self.progress*100)+'%';
  }});
  ScrollTrigger.create({trigger:story,start:'bottom 85%',onEnter:function(){pg.classList.add('hide')},onLeaveBack:function(){pg.classList.remove('hide')}});
}

/* ---------- dust ---------- */
function initDust(){
  var c=$('#dust');if(!c||reduce)return;
  var x=c.getContext('2d'),w,h,P=[],dpr=Math.min(window.devicePixelRatio||1,2);
  function size(){w=c.width=innerWidth*dpr;h=c.height=innerHeight*dpr}
  size();addEventListener('resize',size);
  var N=innerWidth<700?30:70;
  for(var i=0;i<N;i++)P.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+.4,s:Math.random()*.00022+.00004,a:Math.random()*.5+.15,p:Math.random()*6});
  var t=0;
  (function loop(){
    t+=1;x.clearRect(0,0,w,h);
    P.forEach(function(d){
      d.y-=d.s;d.x+=Math.sin(t*.008+d.p)*.00018;
      if(d.y<-.02){d.y=1.02;d.x=Math.random()}
      x.beginPath();x.fillStyle='rgba(224,192,127,'+(d.a*(.6+.4*Math.sin(t*.02+d.p)))+')';
      x.arc(d.x*w,d.y*h,d.r*dpr,0,6.283);x.fill();
    });
    requestAnimationFrame(loop);
  })();
}

/* ---------- nav ---------- */
function initNav(){
  var bar=$('#topbar'),btn=$('.menu-btn'),nav=$('#topnav');
  function chk(){bar.classList.toggle('solid',scrollY>60)}
  chk();addEventListener('scroll',chk,{passive:true});
  btn.addEventListener('click',function(){
    var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);
  });
  $$('a',nav).forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded',false)})});
  /* smooth anchor scroll */
  $$('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href');if(id.length<2)return;
      var t=$(id);if(!t)return;e.preventDefault();
      var y=t.getBoundingClientRect().top+scrollY-(id==='#hero'?0:70);
      window.scrollTo({top:y,behavior:reduce?'auto':'smooth'});
    });
  });
}

/* ---------- reveals + counters ---------- */
function initReveals(){
  var els=$$('.reveal');
  if(!hasGsap||reduce){els.forEach(function(e){e.style.opacity=1;e.style.transform='none'});}
  else{
    ScrollTrigger.batch(els,{start:'top 88%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,y:0,duration:.9,stagger:.12,ease:'power3.out'})}});
  }
  $$('[data-count]').forEach(function(el){
    var end=+el.dataset.count,suf=el.dataset.suffix||'',done=false;
    function run(){
      if(done)return;done=true;
      if(!hasGsap||reduce){el.textContent=end+suf;return}
      var o={v:0};gsap.to(o,{v:end,duration:1.8,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(o.v)+suf}});
    }
    if(hasGsap)ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:run});else run();
  });
}

/* ---------- portfolio lightbox ---------- */
function initLightbox(){
  var cards=$$('.p-card'),lb=$('#lightbox'),cur=0;
  function show(i){
    cur=(i+cards.length)%cards.length;
    var c=cards[cur],im=c.querySelector('img');
    $('#lb-img').src=im.currentSrc||im.src;$('#lb-img').alt=im.alt;
    $('#lb-tag').textContent=c.dataset.tag;$('#lb-name').textContent=c.dataset.name;
    $('#lb-ask').dataset.ask='Tell me about your '+c.dataset.name+' service';
  }
  function open(i){show(i);lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  cards.forEach(function(c,i){c.querySelector('button').addEventListener('click',function(){open(i)})});
  $('.lb-close').addEventListener('click',close);
  $('.lb-prev').addEventListener('click',function(){show(cur-1)});
  $('.lb-next').addEventListener('click',function(){show(cur+1)});
  $('#lb-book').addEventListener('click',close);
  $('#lb-ask').addEventListener('click',close);
  lb.addEventListener('click',function(e){if(e.target===lb)close()});
  addEventListener('keydown',function(e){
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);
  });
}

/* ---------- FAQ + testimonials ---------- */
function initFaq(){
  $$('.faq-toggle').forEach(function(b){
    b.addEventListener('click',function(){
      var item=b.parentNode,c=$('.faq-content',item),open=b.getAttribute('aria-expanded')==='true';
      $$('.faq-toggle').forEach(function(o){o.setAttribute('aria-expanded','false');$('.faq-content',o.parentNode).style.maxHeight=0});
      if(!open){b.setAttribute('aria-expanded','true');c.style.maxHeight=c.scrollHeight+'px'}
      if(hasGsap)setTimeout(function(){ScrollTrigger.refresh()},550);
    });
  });
}
function initQuotes(){
  var qs=$$('.quote'),dots=$('.q-dots'),cur=0,timer;if(!qs.length)return;
  qs.forEach(function(_,i){var d=document.createElement('i');d.addEventListener('click',function(){go(i,true)});dots.appendChild(d)});
  function go(i,manual){
    cur=(i+qs.length)%qs.length;
    qs.forEach(function(q,k){q.classList.toggle('active',k===cur)});
    $$('i',dots).forEach(function(d,k){d.classList.toggle('on',k===cur)});
    if(manual){clearInterval(timer);timer=setInterval(function(){go(cur+1)},7000)}
  }
  $('.q-prev').addEventListener('click',function(){go(cur-1,true)});
  $('.q-next').addEventListener('click',function(){go(cur+1,true)});
  go(0,true);
}

/* ---------- booking (opens email app, honest flow) ---------- */
function initBooking(){
  var form=$('#consultationForm');if(!form)return;
  var date=$('#bDate'),time=$('#bTime'),note=$('#bookNote');
  var d=new Date();d.setDate(d.getDate()+1);
  date.min=d.toISOString().slice(0,10);
  for(var h=9;h<=17;h++){for(var m=0;m<60;m+=30){
    if(h===17&&m>0)continue;
    var v=('0'+h).slice(-2)+':'+('0'+m).slice(-2),o=document.createElement('option');o.value=o.textContent=v;time.appendChild(o);
  }}
  date.addEventListener('input',function(){
    var day=new Date(date.value+'T00:00').getDay();
    note.textContent=day===0?'We are closed on Sundays. Please pick another day.':'';
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=false;
    $$('input[required],select[required]',form).forEach(function(f){
      var ok=f.value.trim()!==''&&(f.type!=='email'||/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('err',!ok);if(!ok)bad=true;
    });
    if(bad){note.textContent='Please complete the highlighted fields.';return}
    var fd=new FormData(form),g=function(k){return (fd.get(k)||'').toString().trim()};
    var dt=new Date(g('date')+'T00:00');
    var nice=dt.toLocaleDateString('en-ZA',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    var body='Hello NQABS Built-ins Services,\n\nI would like to book a consultation.\n\n'+
      'Name: '+g('firstName')+' '+g('lastName')+'\nEmail: '+g('email')+'\nPhone: '+g('phone')+
      '\nService: '+g('service')+'\nType: '+g('mode')+'\nPreferred date: '+nice+'\nPreferred time: '+g('time')+
      '\n\nProject details:\n'+(g('description')||'(none provided)')+'\n\nSent from the NQABS website.';
    $('#confirmDate').textContent=nice;$('#confirmTime').textContent=g('time')+' · '+g('mode');
    $('#successModal').classList.remove('hidden');
    location.href='mailto:njabuloasande43@gmail.com?subject='+encodeURIComponent('Consultation request: '+g('service'))+'&body='+encodeURIComponent(body);
  });
  $('#closeModal').addEventListener('click',function(){$('#successModal').classList.add('hidden');form.reset();note.textContent=''});
}

function init(){
  $('#yr').textContent=new Date().getFullYear();
  initStory();initDust();initNav();initReveals();initLightbox();initFaq();initQuotes();initBooking();
  addEventListener('load',function(){if(hasGsap)ScrollTrigger.refresh()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
