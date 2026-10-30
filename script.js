(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const PASSWORD = "1234";

  let currentScreen = "gate";
  let envelopeOpened = false;
  let cakeStarted = false;

  // CHANGE SCREEN
  function showScreen(id) {
    const next = $(id);
    if (!next) return;

    document.querySelectorAll(".screen").forEach((screen) => {
      screen.hidden = screen.id !== id;
      screen.classList.toggle("active", screen.id === id);
    });

    currentScreen = id;

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  }

  // MUSIC PLAYER
  const music = $("birthday-music");
  const musicButton = $("music-toggle");
  const musicStatus = $("music-status");
  let musicPlaying = false;

  musicButton.addEventListener("click", async () => {
    if (musicPlaying) {
      music.pause();
      musicPlaying = false;
      musicButton.textContent = "♫";
      musicButton.setAttribute("aria-label", "Play birthday music");
      musicStatus.textContent = "Music paused";
      return;
    }

    musicStatus.textContent = "Trying to play fireflies.mp3…";

    try {
      if (!music.getAttribute("src")) {
        music.src = "./fireflies.mp3";
      }

      music.load();
      await music.play();

      musicPlaying = true;
      musicButton.textContent = "Ⅱ";
      musicButton.setAttribute("aria-label", "Pause birthday music");
      musicStatus.textContent = "Now playing ♫";

    } catch (error) {
      musicPlaying = false;
      musicButton.textContent = "♫";

      if (error && error.name === "NotSupportedError") {
        musicStatus.textContent = "MP3 could not be decoded — try another MP3 export";
      } else if (error && error.name === "NotAllowedError") {
        musicStatus.textContent = "Tap the music button again to allow playback";
      } else {
        musicStatus.textContent =
          "Song not loaded — check that fireflies.mp3 is beside index.html";
      }
    }
  });

  music.addEventListener("playing", () => {
    musicPlaying = true;
    musicStatus.textContent = "Now playing ♫";
  });

  music.addEventListener("pause", () => {
    if (!music.ended) musicPlaying = false;
  });

  music.addEventListener("ended", () => {
    musicPlaying = false;
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-label", "Play birthday music");
  });

  music.addEventListener("error", () => {
    musicPlaying = false;
    musicStatus.textContent =
      "Can't find or play fireflies.mp3 — check its exact name and upload";
  });

  // PASSWORD GATE
  $("password-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if ($("password-input").value.trim() === PASSWORD) {
      $("password-error").textContent = "";
      showScreen("envelope-screen");
    } else {
      $("password-error").textContent =
        "Not quite — try the little secret code again.";
      $("password-input").select();
    }
  });

  // ENVELOPE
  $("envelope-button").addEventListener("click", () => {
    if (envelopeOpened) return;

    envelopeOpened = true;

    $("envelope-button").classList.add("opened");
    $("envelope-button").setAttribute("aria-label", "Envelope opened");
    $("envelope-message").hidden = false;

    $("envelope-message").scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });

  $("to-timeline-button").addEventListener("click", () => {
    if (envelopeOpened) {
      showScreen("birthday-timeline-screen");
    }
  });

  // BIRTHDAY TIMELINE COUNTDOWN
  // Target: 15 November 2026, 9:15 PM Nepal time.
  const birthdayTarget =
    new Date("2026-11-15T21:15:00+05:45").getTime();

  const countdownMessage = $("birthday-countdown-message");

  function updateBirthdayCountdown() {
    const remaining = birthdayTarget - Date.now();

    if (remaining <= 0) {
      $("birthday-days").textContent = "0";
      $("birthday-hours").textContent = "00";
      $("birthday-minutes").textContent = "00";
      $("birthday-seconds").textContent = "00";

      countdownMessage.textContent =
        "It's your birthday! Happy Birthday, Alisha! ♡";

      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    $("birthday-days").textContent = String(days);
    $("birthday-hours").textContent = String(hours).padStart(2, "0");
    $("birthday-minutes").textContent = String(minutes).padStart(2, "0");
    $("birthday-seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateBirthdayCountdown();
  setInterval(updateBirthdayCountdown, 1000);

  // TIMELINE TO CAKE
  $("timeline-to-cake-button").addEventListener("click", () => {
    if (currentScreen === "birthday-timeline-screen") {
      showScreen("cake-screen");
    }
  });

  // CAKE COUNTDOWN AND BALLOONS
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  $("blow-button").addEventListener("click", async () => {
    if (cakeStarted) return;

    cakeStarted = true;
    $("blow-button").disabled = true;
    $("cake-status").textContent = "Get ready to make your wish…";

    for (const number of [3, 2, 1]) {
      $("countdown").textContent = number;
      await wait(850);
    }

    // Candle goes out.
    $("countdown").textContent = "";
    $("flame").classList.add("out");

    $("cake-status").textContent =
      "Wish sent into the universe! ✨";

    // Balloons rise over the cake.
    launchBalloons();

    await wait(1800);

    $("birthday-reveal").hidden = false;
    $("cake-status").textContent = "";
    $("blow-button").hidden = true;

    makeConfetti(85);
  });

  $("to-memories-button").addEventListener("click", () => {
    if (cakeStarted) {
      showScreen("memories-screen");
    }
  });

  function launchBalloons() {
    const field = $("cake-balloons");
    field.innerHTML = "";

    const colors = [
      "#e9a9cd",
      "#c8b7ec",
      "#ffe0a6",
      "#f7c5d9",
      "#b9d8d2",
      "#d9c2f1"
    ];

    for (let i = 0; i < 24; i++) {
      const balloon = document.createElement("span");

      balloon.className = "balloon";

      balloon.style.left = `${Math.random() * 92 + 2}%`;
      balloon.style.setProperty(
        "--balloon-color",
        colors[i % colors.length]
      );
      balloon.style.setProperty(
        "--delay",
        `${Math.random() * 0.8}s`
      );
      balloon.style.setProperty(
        "--duration",
        `${2.3 + Math.random() * 1.5}s`
      );

      balloon.style.width = `${36 + Math.random() * 25}px`;
      balloon.style.height = `${49 + Math.random() * 31}px`;

      field.appendChild(balloon);
    }
  }

  // CONFETTI
  function makeConfetti(count) {
    const layer = $("confetti-layer");

    const colors = [
      "#e7a6c9",
      "#c6b5ed",
      "#ffdf9e",
      "#b7d9d1",
      "#f7c8d8"
    ];

    for (let i = 0; i < count; i++) {
      const bit = document.createElement("span");

      bit.className = "confetti";
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.background = colors[i % colors.length];

      bit.style.borderRadius =
        Math.random() > 0.5 ? "50%" : "2px";

      bit.style.setProperty(
        "--delay",
        `${Math.random() * 1.2}s`
      );

      bit.style.setProperty(
        "--dur",
        `${2.3 + Math.random() * 2.2}s`
      );

      layer.appendChild(bit);

      setTimeout(() => bit.remove(), 6000);
    }
  }

  // CONTROLLED SECTION NAVIGATION
  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.next;

      // Do not allow users to skip required sections.
      if (
        target === "friendship-screen" &&
        currentScreen !== "memories-screen"
      ) return;

      if (
        target === "quiz-screen" &&
        currentScreen !== "friendship-screen"
      ) return;

      if (
        target === "jar-screen" &&
        currentScreen !== "quiz-screen"
      ) return;

      if (
        target === "letter-screen" &&
        currentScreen !== "future-wish-screen"
      ) return;

      showScreen(target);
    });
  });

  // FRIENDSHIP QUIZ
  const questions = [
    {
      q: "What makes a friendship feel truly safe?",
      options: [
        "Being perfect all the time",
        "Honesty and showing up",
        "Never disagreeing"
      ],
      answer: 1,
      feedback: "Exactly — being real and being there matter. ♡"
    },
    {
      q: "What’s the point of this little website?",
      options: [
        "A random internet page",
        "A friendship-only birthday surprise",
        "A school assignment"
      ],
      answer: 1,
      feedback: "Yep! Just a birthday surprise to celebrate you. 🌷"
    },
    {
      q: "What do I hope you have more of this year?",
      options: [
        "Stress and deadlines",
        "Reasons to doubt yourself",
        "Peace, joy, and good memories"
      ],
      answer: 2,
      feedback: "That’s the wish — more of the good stuff, always. ✨"
    },
    {
      q: "What should you remember after this birthday?",
      options: [
        "You deserve good things on ordinary days too",
        "You must have everything figured out",
        "You can’t change your plans"
      ],
      answer: 0,
      feedback: "That’s the one. You deserve kindness on every kind of day. 💗"
    }
  ];

  let questionIndex = 0;
  let answered = false;

  function renderQuestion() {
    answered = false;

    const question = questions[questionIndex];

    $("quiz-progress-text").textContent =
      `Question ${questionIndex + 1} of ${questions.length}`;

    $("quiz-progress-bar").style.width =
      `${((questionIndex + 1) / questions.length) * 100}%`;

    $("quiz-question").textContent = question.q;
    $("quiz-feedback").textContent = "";
    $("quiz-next").disabled = true;

    $("quiz-next").textContent =
      questionIndex === questions.length - 1
        ? "Finish quiz ✨"
        : "Next question →";

    const options = $("quiz-options");
    options.innerHTML = "";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");

      button.className = "quiz-option";
      button.type = "button";
      button.textContent = option;

      button.addEventListener("click", () => {
        chooseAnswer(index);
      });

      options.appendChild(button);
    });
  }

  function chooseAnswer(index) {
    if (answered) return;

    answered = true;

    const question = questions[questionIndex];

    const buttons = [
      ...$("quiz-options").querySelectorAll("button")
    ];

    buttons.forEach((button, i) => {
      button.disabled = true;

      if (i === question.answer) {
        button.classList.add("correct");
      }

      if (i === index && i !== question.answer) {
        button.classList.add("wrong");
      }
    });

    $("quiz-feedback").textContent =
      index === question.answer
        ? question.feedback
        : `A lovely try! ${question.feedback}`;

    $("quiz-next").disabled = false;
  }

  $("quiz-next").addEventListener("click", () => {
    if (!answered) return;

    if (questionIndex < questions.length - 1) {
      questionIndex++;
      renderQuestion();
    } else {
      // Hide the entire quiz card, including the Next button.
      $("quiz-card").hidden = true;
      $("quiz-finished").hidden = false;
    }
  });

  renderQuestion();

  // WISH JAR
  const wishes = [
    "May you find courage for the dreams you haven’t said out loud yet.",
    "May your hard days be met with patience, comfort, and people who care.",
    "May you keep discovering new things that make you feel excited about life.",
    "May the little moments — songs, sunsets, silly laughs — bring you unexpected joy."
  ];

  let wishIndex = 0;

  $("jar-button").addEventListener("click", () => {
    // After all four notes, the jar no longer responds.
    if (wishIndex >= wishes.length) return;

    const note = $("wish-note");

    note.hidden = false;
    note.classList.remove("wish-note");

    // Restart the note animation each time.
    void note.offsetWidth;

    note.classList.add("wish-note");
    note.textContent = wishes[wishIndex];

    $("jar-count").textContent =
      `Wish ${wishIndex + 1} of ${wishes.length}`;

    $("jar-prompt").textContent =
      wishIndex === wishes.length - 1
        ? "ONE LAST WISH ♡"
        : "TAP THE JAR FOR ANOTHER WISH ✨";

    // Animate the jar.
    if (typeof $("jar-button").animate === "function") {
      $("jar-button").animate(
        [
          { transform: "rotate(-5deg)" },
          { transform: "rotate(5deg)" },
          { transform: "rotate(0)" }
        ],
        {
          duration: 420,
          easing: "ease-out"
        }
      );
    }

    wishIndex++;

    if (wishIndex === wishes.length) {
      $("jar-button").classList.add("done");

      $("jar-button").setAttribute(
        "aria-label",
        "All wish jar messages have been read"
      );

      $("jar-prompt").textContent =
        "ALL YOUR WISHES HAVE BEEN OPENED ♡";

      $("jar-count").textContent =
        `${wishes.length} of ${wishes.length} wishes read`;

      // Unlock the next button only after the last note.
      setTimeout(() => {
        $("letter-unlock").hidden = false;
      }, 850);
    }
  });

  $("letter-unlock").addEventListener("click", () => {
    if (wishIndex === wishes.length) {
      loadFutureWish();
      showScreen("future-wish-screen");
    }
  });

  // FUTURE WISH SAVING
  // This uses its own key and does not clear other saved browser data.
  const FUTURE_WISH_KEY = "alishaBirthdayFutureWish_v1";

  function loadFutureWish() {
    let saved = "";

    try {
      saved = localStorage.getItem(FUTURE_WISH_KEY) || "";
    } catch (error) {
      saved = "";
    }

    $("future-wish-input").value = saved;

    $("saved-future-wish").textContent =
      saved || "Your wish will appear here after you save it.";

    $("future-wish-status").textContent = saved
      ? "Your previous wish is still saved on this device ♡"
      : "Your wish stays in this browser on this device.";
  }

  $("save-future-wish").addEventListener("click", () => {
    const value = $("future-wish-input").value.trim();

    if (!value) {
      $("future-wish-status").textContent =
        "Write your wish first, then save it.";
      return;
    }

    try {
      localStorage.setItem(FUTURE_WISH_KEY, value);

      $("saved-future-wish").textContent = value;

      $("future-wish-status").textContent =
        "Your wish is saved on this device ♡";

    } catch (error) {
      $("future-wish-status").textContent =
        "This browser couldn't save it. Please keep a copy somewhere safe.";
    }
  });

  loadFutureWish();

  // FINAL LETTER TO MOON FINALE
  $("final-button").addEventListener("click", () => {
    $("final-message").hidden = false;
    $("final-button").hidden = true;

    const moonButton = document.createElement("button");

    moonButton.type = "button";
    moonButton.className = "primary-btn";
    moonButton.textContent = "One final thing under the moon →";

    moonButton.addEventListener("click", () => {
      showScreen("moon-screen");
    });

    $("final-message").after(moonButton);

    makeConfetti(65);
  });

  // REPLAY
  $("replay-button").addEventListener("click", () => {
    // Do not clear localStorage.
    // The saved Future Wish remains on this browser.

    showScreen("gate");

    $("password-input").value = "";
    $("password-error").textContent = "";

    envelopeOpened = false;
    cakeStarted = false;

    $("envelope-button").classList.remove("opened");
    $("envelope-button").setAttribute(
      "aria-label",
      "Open your birthday envelope"
    );
    $("envelope-message").hidden = true;

    $("blow-button").hidden = false;
    $("blow-button").disabled = false;

    $("flame").classList.remove("out");
    $("birthday-reveal").hidden = true;
    $("countdown").textContent = "";
    $("cake-balloons").innerHTML = "";
    $("cake-status").textContent = "Your wish is yours to keep ✨";

    // Reset quiz.
    $("quiz-card").hidden = false;
    $("quiz-finished").hidden = true;
    questionIndex = 0;
    renderQuestion();

    // Reset wish jar.
    wishIndex = 0;
    $("wish-note").hidden = true;
    $("jar-button").classList.remove("done");
    $("jar-button").setAttribute(
      "aria-label",
      "Tap the wish jar to reveal a message"
    );
    $("jar-count").textContent = `Wish 0 of ${wishes.length}`;
    $("jar-prompt").textContent = "TAP THE JAR TO OPEN A WISH ✨";
    $("letter-unlock").hidden = true;

    // Reset finale controls.
    $("final-button").hidden = false;
    $("final-message").hidden = true;

    const moonNext = $("final-message").nextElementSibling;

    if (moonNext && moonNext.tagName === "BUTTON") {
      moonNext.remove();
    }
  });

})();
