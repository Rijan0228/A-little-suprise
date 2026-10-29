"use strict";

const $ = (id) => document.getElementById(id);

const PASSWORD = "1234";

// Alisha's birth date: Nepal time.
const BIRTHDAY = new Date("2009-11-15T00:00:00+05:45");

// Birthday celebration date and time: November 15, 2026, at 9:15 PM Nepal time.
const CELEBRATION_DATE = new Date("2026-11-15T21:15:00+05:45");

let quizIndex = 0;
let quizAnswered = false;
let wishesRead = 0;
let countdownRunning = false;
let musicPlaying = false;

const quizQuestions = [
  {
    question: "What makes a friendship truly special?",
    answers: [
      "Being there for each other",
      "Keeping score of every favor",
      "Never talking about anything"
    ],
    correct: 0,
    feedback: "It's the little moments of support that matter. 💗"
  },
  {
    question: "What's the best kind of memory?",
    answers: [
      "A moment that makes us smile",
      "One that we must forget",
      "One that never happened"
    ],
    correct: 0,
    feedback: "The simplest memories can mean the most. ✨"
  },
  {
    question: "What's my birthday wish for you?",
    answers: [
      "More happiness, peace, and opportunities",
      "More homework forever",
      "No more birthdays"
    ],
    correct: 0,
    feedback: "Exactly! I hope your year is full of good things. 🎂"
  }
];

const jarWishes = [
  "I hope you always find a reason to smile, even on an ordinary day. 💗",
  "May you find the courage to chase the dreams that matter to you. ✨",
  "I hope you meet people who appreciate your honesty and kindness. 🌷",
  "Most of all, I hope this next chapter brings you beautiful memories. Here's to you! ♡"
];

/* ---------------------------
   SCREEN NAVIGATION
--------------------------- */

function showScreen(id) {
  const target = $(id);

  if (!target) return;

  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  target.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ---------------------------
   PASSWORD GATE
--------------------------- */

$("password-form").addEventListener("submit", (event) => {
  event.preventDefault();

  if ($("password").value === PASSWORD) {
    $("password-error").textContent = "";
    $("password").value = "";
    showScreen("envelope-screen");
  } else {
    $("password-error").textContent =
      "Not quite! Try the secret code again. 💌";

    $("password").value = "";
    $("password").focus();
  }
});

/* ---------------------------
   OPEN THE ENVELOPE
--------------------------- */

$("envelope-button").addEventListener("click", () => {
  const button = $("envelope-button");

  if (button.disabled) return;

  button.disabled = true;
  button.innerHTML =
    '<span class="envelope-art">💖</span>' +
    '<span class="envelope-label">OPENED WITH LOVE</span>';

  setTimeout(() => {
    showScreen("cake-screen");
  }, 650);
});

/* ---------------------------
   BIRTHDAY CANDLE COUNTDOWN
--------------------------- */

$("blow-button").addEventListener("click", async () => {
  if (countdownRunning) return;

  countdownRunning = true;
  $("blow-button").disabled = true;
  $("cake-message").textContent =
    "Make a wish. This moment is yours. 💗";

  for (const number of ["3", "2", "1"]) {
    $("countdown").textContent = number;

    await new Promise((resolve) => {
      setTimeout(resolve, 850);
    });
  }

  $("countdown").textContent = "✨";
  $("flame").classList.add("out");

  $("cake-message").textContent =
    "Your wish is on its way. Happy Birthday, Alisha!";

  launchCelebration();

  setTimeout(() => {
    showScreen("story");
  }, 2900);
});

/* ---------------------------
   BALLOONS AND CONFETTI
--------------------------- */

function launchCelebration() {
  const container = $("celebration");

  const balloonColors = [
    "#f4b9d4",
    "#e4c9ff",
    "#ffe2a7",
    "#f7d7e9",
    "#cbb8ff",
    "#fff0da"
  ];

  const confettiColors = [
    "#f4b9d4",
    "#e4c9ff",
    "#ffe2a7",
    "#ffffff",
    "#d991bd"
  ];

  container.innerHTML = "";
  container.classList.remove("show");

  for (let i = 0; i < 22; i++) {
    const balloon = document.createElement("span");

    balloon.className = "balloon";
    balloon.style.left = `${(i * 43) % 100}%`;

    balloon.style.setProperty(
      "--balloon-color",
      balloonColors[i % balloonColors.length]
    );

    balloon.style.setProperty(
      "--drift",
      `${((i % 5) - 2) * 28}px`
    );

    balloon.style.animationDelay = `${(i % 8) * 0.09}s`;

    container.appendChild(balloon);
  }

  for (let i = 0; i < 55; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;

    piece.style.setProperty(
      "--confetti-color",
      confettiColors[i % confettiColors.length]
    );

    piece.style.setProperty(
      "--drift",
      `${Math.random() * 160 - 80}px`
    );

    piece.style.animationDelay = `${Math.random() * 0.9}s`;

    container.appendChild(piece);
  }

  requestAnimationFrame(() => {
    container.classList.add("show");
  });

  setTimeout(() => {
    container.classList.remove("show");
    container.innerHTML = "";
  }, 3400);
}

/* ---------------------------
   LIVE AGE COUNTER
--------------------------- */

function updateAge() {
  const now = new Date();

  let years = now.getFullYear() - BIRTHDAY.getFullYear();
  let months = now.getMonth() - BIRTHDAY.getMonth();
  let days = now.getDate() - BIRTHDAY.getDate();

  if (days < 0) {
    months--;

    const previousMonthDays = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).getDate();

    days += previousMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Calculate the time elapsed since the last whole calendar day.
  const elapsedToday =
    ((now.getHours() - BIRTHDAY.getHours()) * 60 +
      (now.getMinutes() - BIRTHDAY.getMinutes())) * 60 +
    (now.getSeconds() - BIRTHDAY.getSeconds());

  let remainingSeconds = (
    (now.getTime() - new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime()) / 1000
  );

  // Use the current clock for the smaller live units.
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  $("age-years").textContent = Math.max(0, years);
  $("age-months").textContent = Math.max(0, months);
  $("age-days").textContent = Math.max(0, days);
  $("age-hours").textContent = hours;
  $("age-minutes").textContent = minutes;
  $("age-seconds").textContent = seconds;
}

function updateBirthdayCountdown() {
  const now = new Date();

  let target = new Date(CELEBRATION_DATE);

  if (now >= target) {
    target = new Date("2027-11-15T21:15:00+05:45");
  }

  let difference = Math.max(0, target.getTime() - now.getTime());

  const days = Math.floor(difference / 86400000);
  difference %= 86400000;

  const hours = Math.floor(difference / 3600000);
  difference %= 3600000;

  const minutes = Math.floor(difference / 60000);
  difference %= 60000;

  const seconds = Math.floor(difference / 1000);

  $("birthday-countdown").textContent =
    `${days} days · ${hours} hours · ${minutes} minutes · ${seconds} seconds`;
}

function updateClocks() {
  updateAge();
  updateBirthdayCountdown();
}

updateClocks();
setInterval(updateClocks, 1000);

/* ---------------------------
   FRIENDSHIP QUIZ
--------------------------- */

function renderQuestion() {
  const question = quizQuestions[quizIndex];

  quizAnswered = false;

  $("quiz-progress").textContent =
    `Question ${quizIndex + 1} of ${quizQuestions.length}`;

  $("quiz-question").textContent = question.question;
  $("quiz-feedback").textContent = "";
  $("quiz-next").hidden = true;
  $("quiz-complete").hidden = true;
  $("quiz-answers").hidden = false;
  $("quiz-answers").innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer";
    button.textContent = answer;

    button.addEventListener("click", () => {
      if (quizAnswered) return;

      quizAnswered = true;

      $("quiz-answers")
        .querySelectorAll(".answer")
        .forEach((item) => {
          item.disabled = true;
        });

      button.classList.add("chosen");

      $("quiz-feedback").textContent =
        index === question.correct
          ? question.feedback
          : "That's okay! Friendship is about understanding, not perfect answers. 💗";

      if (quizIndex < quizQuestions.length - 1) {
        $("quiz-next").hidden = false;
      } else {
        $("quiz-answers").hidden = true;
        $("quiz-progress").textContent = "Quiz completed! ✨";
        $("quiz-complete").hidden = false;
      }
    });

    $("quiz-answers").appendChild(button);
  });
}

$("quiz-next").addEventListener("click", () => {
  if (!quizAnswered) return;

  quizIndex++;

  if (quizIndex < quizQuestions.length) {
    renderQuestion();
  }
});

/* ---------------------------
   SECTION NAVIGATION
--------------------------- */

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.next;

    if (destination === "quiz") {
      quizIndex = 0;
      renderQuestion();
    }

    showScreen(destination);
  });
});

/* ---------------------------
   WISH JAR
--------------------------- */

$("jar-button").addEventListener("click", () => {
  if (wishesRead >= jarWishes.length) return;

  const message = $("memory-message");

  message.classList.remove("reveal");

  // Restart the animation for each new message.
  void message.offsetWidth;

  message.textContent = jarWishes[wishesRead];
  message.classList.add("reveal");

  wishesRead++;

  $("jar-count").textContent =
    `${wishesRead} of ${jarWishes.length} wishes discovered`;

  if (wishesRead === jarWishes.length) {
    $("jar-prompt").textContent = "ALL WISHES DISCOVERED ♡";
    $("letter-unlock").hidden = false;
  }
});

$("letter-unlock").addEventListener("click", () => {
  if (wishesRead !== jarWishes.length) return;

  showScreen("time-capsule");
});

/* ---------------------------
   FUTURE-WISH TIME CAPSULE
--------------------------- */

$("save-wish").addEventListener("click", () => {
  const wish = $("future-wish").value.trim();

  if (!wish) {
    $("wish-status").textContent =
      "Write a little wish before sealing your time capsule. 💌";
    return;
  }

  try {
    localStorage.setItem("alishaFutureWish", wish);

    $("wish-status").textContent =
      "Your wish has been sealed in this browser. ✨";

    $("saved-wish").textContent = wish;
    $("saved-wish").hidden = false;
  } catch (error) {
    $("wish-status").textContent =
      "Your browser couldn't save this wish. You can keep it in the box above.";
  }
});

function loadSavedWish() {
  try {
    const savedWish = localStorage.getItem("alishaFutureWish");

    if (savedWish) {
      $("future-wish").value = savedWish;
      $("saved-wish").textContent = savedWish;
      $("saved-wish").hidden = false;
      $("wish-status").textContent =
        "Your saved wish is waiting here. ♡";
    }
  } catch (error) {
    // The time capsule still works if local storage is unavailable.
  }
}

loadSavedWish();

/* ---------------------------
   BIRTHDAY LETTER AND FINALE
--------------------------- */

$("finish-button").addEventListener("click", () => {
  showScreen("final");
});

/* ---------------------------
   BACKGROUND MUSIC PLAYER
--------------------------- */

const music = $("birthday-music");
const musicToggle = $("music-toggle");

musicToggle.addEventListener("click", async () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicToggle.textContent = "▶";
    $("music-status").textContent = "Music paused";
    return;
  }

  try {
    await music.play();

    musicPlaying = true;
    musicToggle.textContent = "Ⅱ";
    $("music-status").textContent = "Now playing ♫";
  } catch (error) {
    $("music-status").textContent =
      "Add fireflies.mp3 to the website folder";
  }
});

music.addEventListener("ended", () => {
  musicPlaying = false;
  musicToggle.textContent = "▶";
});

/* ---------------------------
   REPLAY THE EXPERIENCE
--------------------------- */

$("replay-button").addEventListener("click", () => {
  quizIndex = 0;
  quizAnswered = false;
  wishesRead = 0;
  countdownRunning = false;

  $("flame").classList.remove("out");
  $("blow-button").disabled = false;
  $("countdown").textContent = "";

  $("cake-message").textContent =
    "Your wish can stay a secret. 💗";

  $("envelope-button").disabled = false;

  $("envelope-button").innerHTML =
    '<span class="envelope-art">💌</span>' +
    '<span class="envelope-label">TAP TO OPEN IT</span>';

  $("jar-prompt").textContent = "TAP THE JAR ♡";
  $("jar-count").textContent = "0 of 4 wishes discovered";
  $("memory-message").textContent = "";
  $("memory-message").classList.remove("reveal");
  $("letter-unlock").hidden = true;

  $("quiz-next").hidden = true;
  $("quiz-complete").hidden = true;

  $("future-wish").value = "";
  $("wish-status").textContent = "";
  $("saved-wish").textContent = "";
  $("saved-wish").hidden = true;

  showScreen("gate");
});

/* ---------------------------
   START
--------------------------- */

showScreen("gate");
