
/* ==========================================
   A LITTLE SURPRISE FOR DIPIKA
   Main website interactions
========================================== */

const PASSWORD = "20100228";

const screens = document.querySelectorAll(".screen");

const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const unlockButton = document.getElementById("unlockButton");
const togglePassword = document.getElementById("togglePassword");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");

const particles = document.getElementById("particles");

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const choiceMessage = document.getElementById("choiceMessage");

let musicPlaying = false;
let noAttempts = 0;
let heartAnimationStarted = false;

/* ==========================================
   SCREEN NAVIGATION
========================================== */

function showScreen(screenId) {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ==========================================
   PASSWORD
========================================== */

function unlockWebsite() {
  const enteredPassword = passwordInput.value.trim();

  if (enteredPassword === PASSWORD) {
    passwordError.textContent = "";
    passwordInput.value = "";
    showScreen("welcomeScreen");

    startParticles("✨", 18);
  } else {
    passwordError.textContent = "Oops! That's not the right password. Try again ♡";
    passwordInput.value = "";
    passwordInput.focus();
  }
}

unlockButton.addEventListener("click", unlockWebsite);

passwordInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    unlockWebsite();
  }
});

togglePassword.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  togglePassword.textContent = hidden ? "◎" : "◉";
});

/* ==========================================
   WELCOME
========================================== */

document.getElementById("startButton").addEventListener("click", () => {
  showScreen("envelopeScreen");
  startParticles("♡", 15);
});

/* ==========================================
   ENVELOPE AND YES / NO
========================================== */

noButton.addEventListener("click", () => {
  choiceMessage.textContent =
    "That's completely okay. You can close this surprise whenever you like. ♡";
});

function dodgeNoButton() {
  // After a few playful dodges, leave the choice accessible.
  if (noAttempts >= 4) {
    choiceMessage.textContent =
      "Haha, okay! The choice is yours. ♡";
    return;
  }

  noAttempts++;

  const buttonWidth = noButton.offsetWidth;
  const buttonHeight = noButton.offsetHeight;

  const maxX = Math.max(10, window.innerWidth - buttonWidth - 15);
  const maxY = Math.max(90, window.innerHeight - buttonHeight - 20);

  const randomX = 10 + Math.random() * (maxX - 10);
  const randomY = 80 + Math.random() * (maxY - 80);

  noButton.classList.add("dodging");
  noButton.style.left = randomX + "px";
  noButton.style.top = randomY + "px";

  choiceMessage.textContent = [
    "Oops! Too slow! 😂",
    "Hehe, try again! 🙈",
    "That button is a little shy!",
    "Okay, you caught it! 😂"
  ][noAttempts - 1];
}

noButton.addEventListener("pointerenter", event => {
  if (event.pointerType === "mouse" && noAttempts < 4) {
    dodgeNoButton();
  }
});

noButton.addEventListener("touchstart", event => {
  if (noAttempts < 4) {
    // A brief playful movement, without blocking the choice.
    dodgeNoButton();
  }
}, { passive: true });

yesButton.addEventListener("click", () => {
  const envelope = document.querySelector(".envelope");

  envelope.classList.add("open");

  yesButton.disabled = true;
  yesButton.style.opacity = ".6";

  startParticles("💗", 35);

  setTimeout(() => {
    showScreen("storyScreen");
  }, 1100);
});

/* ==========================================
   NEXT BUTTONS
========================================== */

document.querySelectorAll(".next-button").forEach(button => {
  button.addEventListener("click", () => {
    const nextScreen = button.dataset.next;

    if (nextScreen === "revealScreen") {
      showScreen("revealScreen");

      if (!heartAnimationStarted) {
        heartAnimationStarted = true;
        startParticles("♥", 45);
      }
    } else {
      showScreen(nextScreen);
    }
  });
});

/* ==========================================
   MUSIC
========================================== */

musicButton.addEventListener("click", async () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicLabel.textContent = "Music off";
    musicButton.style.opacity = ".8";
  } else {
    try {
      await music.play();

      musicPlaying = true;
      musicLabel.textContent = "Music on";
      musicButton.style.opacity = "1";
    } catch (error) {
      musicLabel.textContent = "Add music.mp3";
    }
  }
});

/* ==========================================
   FALLING PARTICLES
========================================== */

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const symbols = ["♡", "✦", "✧", "🌸", "♥"];

function createParticle(symbol) {
  if (reducedMotion) return;

  const particle = document.createElement("span");

  particle.className = "particle";
  particle.textContent = symbol ||
    symbols[Math.floor(Math.random() * symbols.length)];

  particle.style.left = Math.random() * 100 + "vw";
  particle.style.fontSize = (12 + Math.random() * 17) + "px";
  particle.style.animationDuration = (6 + Math.random() * 7) + "s";
  particle.style.animationDelay = Math.random() * 1.5 + "s";

  particles.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 15000);
}

function startParticles(symbol, count = 15) {
  if (reducedMotion) return;

  for (let i = 0; i < count; i++) {
    setTimeout(() => createParticle(symbol), i * 90);
  }
}

// Gentle background decoration.
if (!reducedMotion) {
  setInterval(() => {
    if (document.visibilityState === "visible") {
      createParticle();
    }
  }, 850);
}

/* ==========================================
   SEND A LITTLE LOVE
========================================== */

document.getElementById("heartButton").addEventListener("click", () => {
  const response = document.getElementById("heartResponse");

  response.textContent = "Sending you all the love! 💗";

  startParticles("💗", 55);

  setTimeout(() => {
    showScreen("finalScreen");
    startParticles("🌸", 30);
  }, 1800);
});

/* ==========================================
   RESTART
========================================== */

document.getElementById("restartButton").addEventListener("click", () => {
  noAttempts = 0;
  heartAnimationStarted = false;

  const envelope = document.querySelector(".envelope");

  envelope.classList.remove("open");

  noButton.classList.remove("dodging");
  noButton.style.left = "";
  noButton.style.top = "";

  yesButton.disabled = false;
  yesButton.style.opacity = "1";

  choiceMessage.textContent =
    "Choose whichever you like. No pressure. ♡";

  document.getElementById("heartResponse").textContent = "";

  showScreen("welcomeScreen");
});
