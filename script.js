(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const PASSWORD = "1234";
  let currentScreen = "gate";
  const visitedScreens = new Set(["gate"]);

  function showScreen(id) {
    const next = $(id);
    if (!next) return;
    document.querySelectorAll(".screen").forEach(screen => {
      screen.hidden = screen.id !== id;
      screen.classList.toggle("active", screen.id === id);
    });
    currentScreen = id;
    visitedScreens.add(id);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  // Music: GitHub Pages paths are case-sensitive. Try common root/assets names.
  const music = $("birthday-music");
  const musicButton = $("music-toggle");
  const musicStatus = $("music-status");
  const musicCandidates = [
    "./fireflies.mp3", "./Fireflies.mp3", "./assets/fireflies.mp3", "./assets/Fireflies.mp3"
  ];
  let musicReady = false;
  let musicPlaying = false;

  async function locateMusic() {
    if (musicReady) return true;
    for (const path of musicCandidates) {
      try {
        const response = await fetch(path, { method: "HEAD", cache: "no-store" });
        if (response.ok) {
          music.src = path;
          music.load();
          musicReady = true;
          musicStatus.textContent = "Birthday song ready ♡";
          return true;
        }
      } catch (_) { /* Try the next known filename/path. */ }
    }
    musicStatus.textContent = "Song not found — add fireflies.mp3 to the repository root";
    return false;
  }

  musicButton.addEventListener("click", async () => {
    if (musicPlaying) {
      music.pause();
      musicPlaying = false;
      musicButton.textContent = "♫";
      musicButton.setAttribute("aria-label", "Play birthday music");
      musicStatus.textContent = "Music paused";
      return;
    }
    musicStatus.textContent = "Loading song…";
    const found = await locateMusic();
    if (!found) return;
    try {
      await music.play();
      musicPlaying = true;
      musicButton.textContent = "Ⅱ";
      musicButton.setAttribute("aria-label", "Pause birthday music");
      musicStatus.textContent = "Now playing ♫";
    } catch (error) {
      musicPlaying = false;
      musicStatus.textContent = error && error.name === "NotSupportedError"
        ? "This MP3 format/file cannot be played"
        : "Tap play again — the browser blocked playback";
    }
  });
  music.addEventListener("ended", () => {
    musicPlaying = false;
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-label", "Play birthday music");
  });
  music.addEventListener("error", () => {
    musicPlaying = false;
    musicStatus.textContent = "Could not load the MP3 — check its filename and upload";
  });

  $("password-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if ($("password-input").value.trim() === PASSWORD) {
      $("password-error").textContent = "";
      showScreen("envelope-screen");
    } else {
      $("password-error").textContent = "Not quite — try the little secret code again.";
      $("password-input").select();
    }
  });

  let envelopeOpened = false;
  $("envelope-button").addEventListener("click", () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    $("envelope-button").classList.add("opened");
    $("envelope-button").setAttribute("aria-label", "Envelope opened");
    $("envelope-message").hidden = false;
    $("envelope-message").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("to-cake-button").addEventListener("click", () => {
    if (envelopeOpened) showScreen("cake-screen");
  });

  let cakeStarted = false;
  $("blow-button").addEventListener("click", async () => {
    if (cakeStarted) return;
    cakeStarted = true;
    $("blow-button").disabled = true;
    $("cake-status").textContent = "Get ready to make your wish…";
    for (const n of [3, 2, 1]) {
      $("countdown").textContent = n;
      await wait(850);
    }
    $("countdown").textContent = "";
    $("flame").classList.add("out");
    $("cake-status").textContent = "Wish sent into the universe! ✨";
    launchBalloons();
    await wait(1800);
    $("birthday-reveal").hidden = false;
    $("cake-status").textContent = "";
    $("blow-button").hidden = true;
    makeConfetti(85);
  });
  $("to-memories-button").addEventListener("click", () => {
    if (cakeStarted) showScreen("memories-screen");
  });

  function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  function launchBalloons() {
    const field = $("cake-balloons");
    field.innerHTML = "";
    const colors = ["#e9a9cd", "#c8b7ec", "#ffe0a6", "#f7c5d9", "#b9d8d2", "#d9c2f1"];
    for (let i = 0; i < 24; i++) {
      const balloon = document.createElement("span");
      balloon.className = "balloon";
      balloon.style.left = `${Math.random() * 92 + 2}%`;
      balloon.style.setProperty("--balloon-color", colors[i % colors.length]);
      balloon.style.setProperty("--delay", `${Math.random() * .8}s`);
      balloon.style.setProperty("--duration", `${2.3 + Math.random() * 1.5}s`);
      balloon.style.width = `${36 + Math.random() * 25}px`;
      balloon.style.height = `${49 + Math.random() * 31}px`;
      field.appendChild(balloon);
    }
  }
  function makeConfetti(count) {
    const layer = $("confetti-layer");
    const colors = ["#e7a6c9", "#c6b5ed", "#ffdf9e", "#b7d9d1", "#f7c8d8"];
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("span");
      bit.className = "confetti";
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.background = colors[i % colors.length];
      bit.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
      bit.style.setProperty("--delay", `${Math.random() * 1.2}s`);
      bit.style.setProperty("--dur", `${2.3 + Math.random() * 2.2}s`);
      layer.appendChild(bit);
      setTimeout(() => bit.remove(), 6000);
    }
  }

  document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.next;
      // Guard the only gated transitions; the cake and envelope cannot be bypassed.
      if (target === "friendship-screen" && currentScreen !== "memories-screen") return;
      if (target === "quiz-screen" && currentScreen !== "friendship-screen") return;
      if (target === "jar-screen" && currentScreen !== "quiz-screen") return;
      showScreen(target);
    });
  });

  const questions = [
    { q: "What makes a friendship feel truly safe?", options: ["Being perfect all the time", "Honesty and showing up", "Never disagreeing"], answer: 1, feedback: "Exactly — being real and being there matter. ♡" },
    { q: "What’s the point of this little website?", options: ["A random internet page", "A friendship-only birthday surprise", "A school assignment"], answer: 1, feedback: "Yep! Just a birthday surprise to celebrate you. 🌷" },
    { q: "What do I hope you have more of this year?", options: ["Stress and deadlines", "Reasons to doubt yourself", "Peace, joy, and good memories"], answer: 2, feedback: "That’s the wish — more of the good stuff, always. ✨" },
    { q: "What should you remember after this birthday?", options: ["You deserve good things on ordinary days too", "You must have everything figured out", "You can’t change your plans"], answer: 0, feedback: "That’s the one. You deserve kindness on every kind of day. 💗" }
  ];
  let questionIndex = 0;
  let answered = false;
  function renderQuestion() {
    answered = false;
    const question = questions[questionIndex];
    $("quiz-progress-text").textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    $("quiz-progress-bar").style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
    $("quiz-question").textContent = question.q;
    $("quiz-feedback").textContent = "";
    $("quiz-next").disabled = true;
    $("quiz-next").textContent = questionIndex === questions.length - 1 ? "Finish quiz ✨" : "Next question →";
    const options = $("quiz-options");
    options.innerHTML = "";
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => chooseAnswer(index));
      options.appendChild(button);
    });
  }
  function chooseAnswer(index) {
    if (answered) return;
    answered = true;
    const question = questions[questionIndex];
    const buttons = [...$("quiz-options").querySelectorAll("button")];
    buttons.forEach((button, i) => {
      button.disabled = true;
      if (i === question.answer) button.classList.add("correct");
      if (i === index && i !== question.answer) button.classList.add("wrong");
    });
    $("quiz-feedback").textContent = index === question.answer ? question.feedback : `A lovely try! ${question.feedback}`;
    $("quiz-next").disabled = false;
  }
  $("quiz-next").addEventListener("click", () => {
    if (!answered) return;
    if (questionIndex < questions.length - 1) {
      questionIndex++;
      renderQuestion();
    } else {
      $("quiz-card").hidden = true; // removes the question and Next button entirely
      $("quiz-finished").hidden = false;
    }
  });
  renderQuestion();

  const wishes = [
    "May you find courage for the dreams you haven’t said out loud yet.",
    "May your hard days be met with patience, comfort, and people who care.",
    "May you keep discovering new things that make you feel excited to be alive.",
    "May the little moments — songs, sunsets, silly laughs — bring you unexpected joy.",
  ];
  let wishIndex = 0;
  $("jar-button").addEventListener("click", () => {
    if (wishIndex >= wishes.length) return; // after the last message, taps do nothing
    const note = $("wish-note");
    note.hidden = false;
    note.classList.remove("wish-note");
    void note.offsetWidth;
    note.classList.add("wish-note");
    note.textContent = wishes[wishIndex];
    $("jar-count").textContent = `Wish ${wishIndex + 1} of ${wishes.length}`;
    $("jar-prompt").textContent = wishIndex === wishes.length - 1 ? "ONE LAST WISH ♡" : "TAP THE JAR FOR ANOTHER WISH ✨";
    $("jar-wrap")?.classList.remove("note-visible");
    $("jar-button").animate([{ transform: "rotate(-5deg)" }, { transform: "rotate(5deg)" }, { transform: "rotate(0)" }], { duration: 420, easing: "ease-out" });
    wishIndex++;
    if (wishIndex === wishes.length) {
      $("jar-button").classList.add("done");
      $("jar-button").setAttribute("aria-label", "All wish jar messages have been read");
      $("jar-prompt").textContent = "ALL YOUR WISHES HAVE BEEN OPENED ♡";
      $("jar-count").textContent = `${wishes.length} of ${wishes.length} wishes read`;
      setTimeout(() => { $("letter-unlock").hidden = false; }, 850);
    }
  });
  $("letter-unlock").addEventListener("click", () => {
    if (wishIndex === wishes.length) showScreen("letter-screen");
  });
  $("final-button").addEventListener("click", () => {
    $("final-message").hidden = false;
    $("final-button").hidden = true;
    const moonButton = document.createElement("button");
    moonButton.type = "button";
    moonButton.className = "primary-btn";
    moonButton.textContent = "One final thing under the moon →";
    moonButton.addEventListener("click", () => showScreen("moon-screen"));
    $("final-message").after(moonButton);
    makeConfetti(65);
  });

  $("replay-button").addEventListener("click", () => {
    // Do not clear localStorage: any existing Future Wishes text stays on this browser.
    showScreen("gate");
    $("password-input").value = "";
    envelopeOpened = false;
    cakeStarted = false;
    $("envelope-button").classList.remove("opened");
    $("envelope-message").hidden = true;
    $("blow-button").hidden = false;
    $("blow-button").disabled = false;
    $("flame").classList.remove("out");
    $("birthday-reveal").hidden = true;
    $("countdown").textContent = "";
    $("quiz-card").hidden = false;
    $("quiz-finished").hidden = true;
    questionIndex = 0;
    renderQuestion();
    wishIndex = 0;
    $("wish-note").hidden = true;
    $("jar-button").classList.remove("done");
    $("jar-count").textContent = "Wish 0 of " + wishes.length;
    $("jar-prompt").textContent = "TAP THE JAR TO OPEN A WISH ✨";
    $("letter-unlock").hidden = true;
    $("final-button").hidden = false;
    $("final-message").hidden = true;
    const moonNext = $("final-message").nextElementSibling;
    if (moonNext && moonNext.tagName === "BUTTON") moonNext.remove();
  });
})();