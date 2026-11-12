/* A LITTLE SURPRISE FOR DIPIKA */
"use strict";
const PASSWORD="20100228";
const screens=[...document.querySelectorAll(".screen")];
const $=id=>document.getElementById(id);
const passwordInput=$("passwordInput"),passwordError=$("passwordError");
const music=$("backgroundMusic"),musicButton=$("musicButton"),musicLabel=$("musicLabel");
const particles=$("particles"),yesButton=$("yesButton"),noButton=$("noButton");
const choiceMessage=$("choiceMessage");
let noAttempts=0,musicPlaying=false,heartAnimationStarted=false,particleTimer=null;
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function showScreen(id){
  const target=$(id); if(!target)return;
  screens.forEach(screen=>screen.classList.toggle("active",screen===target));
  window.scrollTo({top:0,behavior:reducedMotion?"auto":"smooth"});
}
function unlockWebsite(){
  if(passwordInput.value.trim()===PASSWORD){
    passwordError.textContent="";passwordInput.value="";showScreen("welcomeScreen");startParticles("✨",18);
  }else{
    passwordError.textContent="That doesn't look right. Try again ♡";passwordInput.value="";passwordInput.focus();
  }
}
$("unlockButton").addEventListener("click",unlockWebsite);
passwordInput.addEventListener("keydown",e=>{if(e.key==="Enter")unlockWebsite()});
$("togglePassword").addEventListener("click",()=>{
  const hidden=passwordInput.type==="password";passwordInput.type=hidden?"text":"password";$("togglePassword").textContent=hidden?"◎":"◉";
});
$("startButton").addEventListener("click",()=>{showScreen("envelopeScreen");startParticles("♡",15)});
function removeNoButton(){
  noButton.classList.add("is-gone");noButton.setAttribute("aria-hidden","true");noButton.disabled=true;
  choiceMessage.textContent="That button has retired from its little game. You can still choose to leave below. ♡";
  startParticles("✧",12);
}
function dodgeNoButton(){
  if(noAttempts>=4)return;
  noAttempts++;
  const rect=noButton.getBoundingClientRect(),margin=14;
  const maxX=Math.max(margin,window.innerWidth-rect.width-margin);
  const maxY=Math.max(75,window.innerHeight-rect.height-margin);
  noButton.style.position="fixed";noButton.style.zIndex="30";
  noButton.style.left=(margin+Math.random()*Math.max(0,maxX-margin))+"px";
  noButton.style.top=(75+Math.random()*Math.max(0,maxY-75))+"px";
  noButton.style.transform="rotate("+(Math.random()*12-6)+"deg)";
  choiceMessage.textContent=["Oops! Too slow! 😂","Hehe, it moved again! 🙈","That button is very shy!","Okay, it has had its fun. ✨"][noAttempts-1];
  if(noAttempts===4){
    window.setTimeout(()=>{
      noButton.style.transition="opacity .35s, transform .35s";
      removeNoButton();
    },420);
  }
}
noButton.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse"&&noAttempts<4)dodgeNoButton()});
noButton.addEventListener("touchstart",()=>{if(noAttempts<4)dodgeNoButton()},{passive:true});
noButton.addEventListener("click",()=>{choiceMessage.textContent="That's completely okay. You can leave this surprise whenever you like. ♡"});
$("declineButton").addEventListener("click",()=>showScreen("noThanksScreen"));
$("backToEnvelope").addEventListener("click",()=>showScreen("envelopeScreen"));
yesButton.addEventListener("click",()=>{
  $("envelope").classList.add("open");yesButton.disabled=true;yesButton.style.opacity=".6";
  startParticles("💗",35);window.setTimeout(()=>showScreen("storyScreen"),1100);
});
document.querySelectorAll(".next-button").forEach(button=>button.addEventListener("click",()=>{
  const next=button.dataset.next;if(!next)return;showScreen(next);
  if(next==="revealScreen"&&!heartAnimationStarted){heartAnimationStarted=true;startParticles("♥",45)}
}));
document.querySelectorAll(".reason-card").forEach(card=>card.addEventListener("click",()=>{
  const detail=card.querySelector(".reason-detail"),opening=!card.classList.contains("open");
  card.classList.toggle("open",opening);detail.textContent=opening?card.dataset.reason:"";
  card.setAttribute("aria-expanded",String(opening));
}));
document.querySelectorAll(".memory-note").forEach(note=>note.addEventListener("click",()=>{
  document.querySelectorAll(".memory-note").forEach(n=>n.classList.remove("active"));
  note.classList.add("active");$("memoryMessage").textContent=note.dataset.note;startParticles("✧",7);
}));
const moodReplies={soft:"Your official result: a gentle day with a little extra peace. 🌸",sparkly:"Your official result: main-character sparkle energy. ✨",cozy:"Your official result: warm drinks, calm thoughts, and comfort. ☕"};
document.querySelectorAll(".mood-button").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".mood-button").forEach(b=>b.classList.remove("selected"));
  button.classList.add("selected");$("moodReply").textContent=moodReplies[button.dataset.mood];
}));
musicButton.addEventListener("click",async()=>{
  if(musicPlaying){music.pause();musicPlaying=false;musicLabel.textContent="Music off";musicButton.style.opacity=".8"}
  else{try{await music.play();musicPlaying=true;musicLabel.textContent="Music on";musicButton.style.opacity="1"}catch(error){musicLabel.textContent="Add music.mp3"}}
});
const symbols=["♡","✦","✧","🌸","♥"];
function createParticle(symbol){
  if(reducedMotion||!particles)return;
  const particle=document.createElement("span");particle.className="particle";
  particle.textContent=symbol||symbols[Math.floor(Math.random()*symbols.length)];
  particle.style.left=Math.random()*100+"vw";particle.style.fontSize=(12+Math.random()*17)+"px";
  particle.style.animationDuration=(6+Math.random()*7)+"s";particle.style.animationDelay=Math.random()+"s";
  particles.appendChild(particle);window.setTimeout(()=>particle.remove(),15000);
}
function startParticles(symbol,count=15){if(reducedMotion)return;for(let i=0;i<count;i++)window.setTimeout(()=>createParticle(symbol),i*75)}
if(!reducedMotion)particleTimer=window.setInterval(()=>{if(document.visibilityState==="visible")createParticle()},1000);
$("heartButton").addEventListener("click",()=>{
  $("heartResponse").textContent="A little sparkle, just for you. 💗";
  startParticles("💗",55);$("heartButton").disabled=true;
  window.setTimeout(()=>{showScreen("finalScreen");startParticles("🌸",30)},1800);
});
$("restartButton").addEventListener("click",()=>{
  noAttempts=0;heartAnimationStarted=false;
  $("envelope").classList.remove("open");
  noButton.classList.remove("is-gone");noButton.removeAttribute("aria-hidden");noButton.disabled=false;
  noButton.removeAttribute("style");
  yesButton.disabled=false;yesButton.style.opacity="1";
  choiceMessage.textContent="The buttons are dramatic. Your choice isn't. ♡";
  $("heartResponse").textContent="";$("heartButton").disabled=false;
  document.querySelectorAll(".reason-card").forEach(c=>{c.classList.remove("open");c.querySelector(".reason-detail").textContent=""});
  document.querySelectorAll(".memory-note").forEach(n=>n.classList.remove("active"));
  $("memoryMessage").textContent="Choose a little note to open it. ♡";
  document.querySelectorAll(".mood-button").forEach(b=>b.classList.remove("selected"));
  $("moodReply").textContent="Choose one to reveal your very official result.";
  showScreen("welcomeScreen");
});

/* Wish garden and open-when notes */
document.querySelectorAll(".wish-card").forEach(card=>card.addEventListener("click",()=>{
  document.querySelectorAll(".wish-card").forEach(item=>item.classList.remove("open"));
  card.classList.add("open");
  $("wishMessage").textContent=card.dataset.wish;
  startParticles("🌸",9);
}));
document.querySelectorAll(".when-card").forEach(card=>card.addEventListener("click",()=>{
  document.querySelectorAll(".when-card").forEach(item=>item.classList.remove("selected"));
  card.classList.add("selected");
  const note=$("whenNote");
  note.innerHTML='<span class="note-seal">♡</span><p></p>';
  note.querySelector("p").textContent=card.dataset.when;
  startParticles("♡",8);
}));
