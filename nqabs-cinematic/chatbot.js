(function(){
'use strict';
var BIZ={
  name:'NQABS Built-ins Services',phone:'073 572 6119',tel:'+27735726119',email:'njabuloasande43@gmail.com',
  hours:'Monday to Friday, 9AM to 6PM',since:2010,fee:'R1 000',
  services:['Kitchen cupboards','Walk-in wardrobes','TV stands','Floating beds','Shoe racks','Home office setups','Bookshelf units','Walk-in pantries']
};
var A=function(h,t){return '<a href="'+h+'">'+t+'</a>'};
var CALL=A('tel:'+BIZ.tel,BIZ.phone),MAIL=A('mailto:'+BIZ.email,BIZ.email),BOOK=A('#booking-form','booking form');
var KB=[
 {k:['hello','hi','hey','good morning','good afternoon','sawubona','howzit'],a:'Hello! I can answer questions about our services, process, consultations and warranty. What would you like to know?'},
 {k:['price','cost','how much','quote','rand','pricing','expensive','afford','budget'],a:'Every project is priced to your room, materials and finish, so we quote after the consultation. Pricing is transparent and flexible payment options are available. The consultation fee is '+BIZ.fee+', fully credited toward your project. Start with the '+BOOK+'.'},
 {k:['fee','consultation fee','deposit'],a:'The consultation fee is '+BIZ.fee+' and it is fully credited toward your project if you go ahead with us.'},
 {k:['book','booking','appointment','consultation','schedule','reserve'],a:'Booking takes a minute: pick a date and time, share your details and send. Use the '+BOOK+' and your email app opens with everything filled in. We then reply to confirm your slot.'},
 {k:['service','offer','make','build','do you do','products','what do you'],a:'We design and fit: '+BIZ.services.join(', ')+'. Anything else custom is possible too, just ask.'},
 {k:['kitchen','cupboard'],a:'Kitchen cupboards are one of our most popular builds: cut to your exact walls and corners in solid timber and premium boards. See examples under '+A('#portfolio','Work')+'.'},
 {k:['wardrobe','closet','walk-in','walk in'],a:'Our walk-in wardrobes are planned around how you dress and store things: drawers, hanging space, shelving and lighting, all fitted to your room.'},
 {k:['tv','entertainment','media'],a:'We build TV stands and entertainment units, floating or floor-standing, with cable management hidden inside.'},
 {k:['bed','floating'],a:'Yes, we build floating beds with built-in storage and bedside units, designed to suit your bedroom.'},
 {k:['pantry'],a:'Walk-in pantries are fully custom: shelving heights, pull-outs and lighting are all set to what you store.'},
 {k:['office','desk','study'],a:'Our home office setups combine desk, shelving and storage in one fitted unit, built around your workspace.'},
 {k:['shoe'],a:'We build shoe racks and shoe closets that fit entrance halls, wardrobes or passages of any size.'},
 {k:['book shelf','bookshelf','library','shelves'],a:'Bookshelf units can be built floor to ceiling or around windows and alcoves, finished to match your room.'},
 {k:['warranty','guarantee'],a:'Every custom built-in carries a 10-year warranty.'},
 {k:['material','wood','timber','board','finish'],a:'We work in solid timber and premium boards. Materials and finishes are chosen with you during the design phase.'},
 {k:['how long','time','duration','delivery','when will','lead'],a:'You receive a design proposal within 5 to 7 business days after the consultation. Build and installation time depends on the project, and we agree timeframes with you up front and keep to them.'},
 {k:['proposal','design'],a:'After the consultation we prepare a custom design with 3D visualisation and material selection, typically within 5 to 7 business days.'},
 {k:['process','steps','how does it work','how it work'],a:'Four steps: 1) Consultation, 2) Design with 3D visualisation, 3) Crafting in our workshop, 4) Installation and a final quality inspection.'},
 {k:['virtual','online','video','zoom','remote'],a:'Yes. You can choose an on-site visit or a virtual video consultation when you book.'},
 {k:['prepare','bring','need ready','measurement'],a:'Have room measurements, photos of the space, inspiration images, your budget and a list of must-haves ready.'},
 {k:['reschedule','cancel','change date'],a:'You can reschedule up to 24 hours before your appointment without penalty. Call '+CALL+' or email '+MAIL+'.'},
 {k:['hours','open','close','when are you','time do you'],a:'We are open '+BIZ.hours+'. Please note we are closed on weekends.'},
 {k:['where','location','address','area','durban','service area','come to'],a:'We are based in South Africa. For on-site visits, tell us your suburb when you book and we will confirm we cover your area. Virtual consultations work anywhere.'},
 {k:['contact','phone','call','number','whatsapp','email','reach'],a:'Call '+CALL+' or email '+MAIL+'. We are available '+BIZ.hours+'.'},
 {k:['experience','years','how old','since','about','who are you'],a:BIZ.name+' is a joinery studio working since '+BIZ.since+': 15+ years, 400+ homes fitted, and a 10-year warranty on every build.'},
 {k:['payment','pay','instalment','finance'],a:'We offer transparent pricing and flexible payment options. Discuss the schedule that suits you during your consultation.'},
 {k:['thank','thanks','ngiyabonga','cheers'],a:'You are welcome! Anything else I can help with?'}
];
var FALLBACK='I am not sure about that one. You can reach the team on '+CALL+' or at '+MAIL+', or send a request through the '+BOOK+'.';
var CHIPS=['Services','How much does it cost?','How do I book?','Warranty','Opening hours'];

function answer(q){
  q=q.toLowerCase();var best=null,score=0;
  KB.forEach(function(e){var s=0;e.k.forEach(function(k){if(q.indexOf(k)>-1)s+=k.length});if(s>score){score=s;best=e}});
  return best?best.a:FALLBACK;
}

var root=document.createElement('div');root.className='sbot';
root.innerHTML='<div class="sbot-win" role="dialog" aria-label="Chat with NQABS"><div class="sbot-head"><div><small>Ask us anything</small><b>NQABS Assistant</b></div><button class="sbot-x" aria-label="Close chat">&times;</button></div><div class="sbot-log" aria-live="polite"></div><div class="chips"></div><form class="sbot-form"><input type="text" placeholder="Type your question..." aria-label="Your question" autocomplete="off"><button type="button" class="sbot-mic" aria-label="Speak" hidden>&#127908;</button><button type="submit" aria-label="Send">&rarr;</button></form></div><button class="sbot-fab" aria-label="Open chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg></button>';
document.body.appendChild(root);
var log=root.querySelector('.sbot-log'),input=root.querySelector('input'),chips=root.querySelector('.chips'),mic=root.querySelector('.sbot-mic');

function add(html,me){var m=document.createElement('div');m.className='msg '+(me?'me':'bot');if(me)m.textContent=html;else m.innerHTML=html;log.appendChild(m);log.scrollTop=log.scrollHeight;return m}
function reply(q){
  var t=document.createElement('div');t.className='msg bot typing';t.innerHTML='<i></i><i></i><i></i>';log.appendChild(t);log.scrollTop=log.scrollHeight;
  var done=function(a){setTimeout(function(){t.remove();add(a)},450+Math.min(700,a.length*4))};
  if(window.NQABS_CHAT_API){
    fetch(window.NQABS_CHAT_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})})
      .then(function(r){return r.json()}).then(function(j){done(j.answer||answer(q))}).catch(function(){done(answer(q))});
  }else done(answer(q));
}
function ask(q){q=(q||'').trim();if(!q)return;add(q,true);reply(q)}
function open(){root.classList.add('open');if(!log.children.length)add('Welcome to '+BIZ.name+'. Ask me about our services, the consultation, pricing or warranty.');input.focus()}
CHIPS.forEach(function(c){var b=document.createElement('button');b.type='button';b.textContent=c;b.addEventListener('click',function(){ask(c)});chips.appendChild(b)});
root.querySelector('.sbot-fab').addEventListener('click',function(){root.classList.contains('open')?root.classList.remove('open'):open()});
root.querySelector('.sbot-x').addEventListener('click',function(){root.classList.remove('open')});
root.querySelector('form').addEventListener('submit',function(e){e.preventDefault();var v=input.value;input.value='';ask(v)});
document.addEventListener('click',function(e){var t=e.target.closest('[data-ask]');if(t&&t.dataset.ask){open();ask(t.dataset.ask)}});

/* optional voice input */
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){
  mic.hidden=false;var rec=new SR();rec.lang='en-ZA';rec.interimResults=false;
  rec.onresult=function(e){input.value=e.results[0][0].transcript;mic.classList.remove('on');ask(input.value);input.value=''};
  rec.onerror=rec.onend=function(){mic.classList.remove('on')};
  mic.addEventListener('click',function(){try{rec.start();mic.classList.add('on')}catch(_){}});
}
})();
