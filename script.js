const footballs = [
  {
    year: "2010",
    name: "Jabulani",
    image: "images/jabulani.png",
    intro: "Features 11 different colours representing the 11 players on a team, the 11 official languages of South Africa, and its diverse communities.",
    extra: " Jabulani means 'to celebrate' in isiZulu. Its eight thermally bonded panels and textured surface were a change from traditional stitched footballs, although players also debated its unpredictable flight.",
    player: "Andrés Iniesta",
    minute: "116'",
    country: "SPAIN",
    opponent: "NETHERLANDS",
    score: "1 — 0",
    scoreBefore: "ESP 0 : 0 NED",
    shotDirection: 1, // 1 means right, -1 means left
    goalText: "the winning goal of the 2010 World Cup final, scored by Andrés Iniesta in the 116th minute."
  },
  {
    year: "2014",
    name: "Brazuca",
    image: "images/brazuca.png",
    intro: "A developmental successor to the Adidas Tango 12 series of balls, with the same bladder and carcass but a different surface structure.",
    extra: " Brazuca uses six identical thermally bonded panels and a colourful ribbon-like graphic inspired by Brazil. The ball underwent extensive testing to improve the consistency of its flight and touch.",
    player: "Mario Götze",
    minute: "113'",
    country: "GERMANY",
    opponent: "ARGENTINA",
    score: "1 — 0",
    scoreBefore: "GER 0 : 0 ARG",
    shotDirection: -1,
    goalText: "the winning goal of the 2014 World Cup final, scored by Mario Götze in the 113th minute."
  },
  {
    year: "2018",
    name: "Telstar 18",
    image: "images/telstar18.png",
    intro: "The Telstar 18 pays homage to Adidas's first World Cup match ball, the Telstar, which was named after the Telstar communications satellite.",
    extra: " Its pixelated black-and-white graphics reinterpret the original 1970 design. Telstar 18 used six thermally bonded panels and featured an embedded NFC chip.",
    player: "Paul Pogba",
    minute: "59'",
    country: "FRANCE",
    opponent: "CROATIA",
    score: "4 — 2",
    scoreBefore: "FRA 2 : 1 CRO",
    shotDirection: -1,
    goalText: "Paul Pogba's third goal for France in the 2018 World Cup final. France went on to win 4–2."
  }
];


function get(id) {
  return document.getElementById(id);
}

const app = get("app");
const archive = get("archive");
const menu = get("menu");
const ballButtons = document.querySelectorAll(".ball-slot");
let currentBall = 0;
let showingMore = false;
let switchingBall = false;


function showArchive() {
  app.classList.add("is-archive");
  archive.setAttribute("aria-hidden", "false");
}

function showHome() {
  app.classList.remove("is-archive");
  archive.setAttribute("aria-hidden", "true");
  showingMore = false;
  updateCarousel();
}


function updateCarousel() {
  const ball = footballs[currentBall];

  get("year").textContent = ball.year;
  get("ballName").textContent = ball.name;
  get("copyIntro").textContent = ball.intro;
  get("copyExtra").textContent = showingMore ? ball.extra : "";
  get("more").textContent = showingMore ? " see less." : " see more.";
  get("more").setAttribute("aria-expanded", String(showingMore));
  archive.classList.toggle("expanded", showingMore);

  for (let i = 0; i < ballButtons.length; i++) {
    const button = ballButtons[i];
    button.classList.remove("center", "before", "after");

    if (i === currentBall) {
      button.classList.add("center");
    } else if (i === (currentBall + 1) % 3) {
      button.classList.add("after");
    } else {
      button.classList.add("before");
    }
  }
}

function changeBall(direction) {
  if (switchingBall || !app.classList.contains("is-archive")) return;
  if (menu.classList.contains("open") || app.classList.contains("is-playing")) return;

  switchingBall = true;
  get("story").classList.add("is-changing");

  setTimeout(function () {
    currentBall = (currentBall + direction + footballs.length) % footballs.length;
    showingMore = false;
    updateCarousel();
    get("story").classList.remove("is-changing");
  }, 210);


  setTimeout(function () {
    switchingBall = false;
  }, 900);
}

get("explore").addEventListener("click", showArchive);
get("brandBtn").addEventListener("click", showHome);
get("more").addEventListener("click", function () {
  showingMore = !showingMore;
  updateCarousel();
});

// Click the side balls to switch; click the middle one to read more.
for (let i = 0; i < ballButtons.length; i++) {
  ballButtons[i].addEventListener("click", function () {
    if (i === currentBall) {
      showingMore = !showingMore;
      updateCarousel();
    } else if (i === (currentBall + 1) % 3) {
      changeBall(1);
    } else {
      changeBall(-1);
    }
  });
}


let lastScroll = 0;
archive.addEventListener("wheel", function (event) {
  event.preventDefault();
  if (Math.abs(event.deltaY) < 8) return;
  if (Date.now() - lastScroll < 850) return;

  lastScroll = Date.now();
  changeBall(event.deltaY > 0 ? 1 : -1);
}, { passive: false });


let dragStart = null;
get("rail").addEventListener("pointerdown", function (event) {
  dragStart = event.clientX;
});
window.addEventListener("pointerup", function (event) {
  if (dragStart === null) return;

  const distance = event.clientX - dragStart;
  dragStart = null;
  if (Math.abs(distance) > 55) changeBall(distance < 0 ? 1 : -1);
});
get("rail").addEventListener("dragstart", function (event) {
  event.preventDefault();
});

function openMenu() {
  menu.classList.add("open");
  menu.classList.remove("show-about");
  menu.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  menu.classList.remove("open", "show-about");
  menu.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-menu]").forEach(function (button) {
  button.addEventListener("click", openMenu);
});

get("closeMenu").addEventListener("click", function () {
  if (menu.classList.contains("show-about")) {
    menu.classList.remove("show-about");
  } else {
    closeMenu();
  }
});

document.querySelectorAll("[data-nav]").forEach(function (button) {
  button.addEventListener("click", function () {
    const page = button.dataset.nav;

    if (page === "about") {
      menu.classList.add("show-about");
      return;
    }

    closeMenu();
    if (page === "home") showHome();
    if (page === "archive") showArchive();
  });
});

const game = get("gameScreen");
let tutorialStep = 0;
let gameState = "closed"; 

function showGamePart(part) {
  get("gameTutorial").hidden = part !== "tutorial";
  get("gamePlay").hidden = part !== "play";
  get("gameResult").hidden = part !== "result";
}

function changeTutorial(step) {
  tutorialStep = step;
  const kickPage = step === 0;

  get("tutorialHeading").textContent = kickPage ? "KICK THE BALL" : "CURVE THE BALL";
  get("tutorialCopy").textContent = kickPage
    ? "Press and hold to charge the shot. Release to kick."
    : "Swipe left or right while the ball is in the air.";

  get("tutorialKickGraphic").hidden = !kickPage;
  get("tutorialCurveGraphic").hidden = kickPage;
  get("tutorialPrev").disabled = kickPage;
  get("tutorialNext").hidden = !kickPage;
  get("tutorialStart").hidden = kickPage;
  get("tutorialDots").textContent = kickPage ? "● ○" : "○ ●";
}

function openGame() {
  gameState = "tutorial";
  get("gameTopLabel").textContent = footballs[currentBall].year + " / " + footballs[currentBall].name.toUpperCase();
  app.classList.add("is-playing");
  game.classList.add("active");
  game.setAttribute("aria-hidden", "false");
  changeTutorial(0);
  showGamePart("tutorial");
}

function closeGame() {
  stopAnimations();
  gameState = "closed";
  game.classList.remove("active");
  app.classList.remove("is-playing");
  game.setAttribute("aria-hidden", "true");
}

get("testBall").addEventListener("click", openGame);
get("gameBack").addEventListener("click", closeGame);
get("gameHelp").addEventListener("click", function () {
  stopAnimations();
  gameState = "tutorial";
  changeTutorial(0);
  showGamePart("tutorial");
});
get("tutorialNext").addEventListener("click", function () { changeTutorial(1); });
get("tutorialPrev").addEventListener("click", function () { changeTutorial(0); });
get("tutorialStart").addEventListener("click", startChallenge);

let charging = false;
let flying = false;
let power = 0;
let curve = 0;
let powerStart = 0;
let flightStart = 0;
let powerTimer = null;
let flightFrame = null;
let resultTimer = null;
let fieldDragX = null;

function stopAnimations() {
  clearInterval(powerTimer);
  cancelAnimationFrame(flightFrame);
  clearTimeout(resultTimer);
  charging = false;
  flying = false;
}

function startChallenge() {
  stopAnimations();
  gameState = "play";
  power = 0;
  curve = 0;
  fieldDragX = null;

  const ball = footballs[currentBall];
  const direction = ball.shotDirection === 1 ? "RIGHT" : "LEFT";

  get("gameChallengeYear").textContent = ball.year + " · WORLD CUP FINAL · " + ball.minute;
  get("gameChallengeName").textContent = "RECREATE " + ball.player.toUpperCase() + "'S GOAL.";
  get("gameChallengeHint").textContent = "HOLD TO KICK · SWIPE " + direction + " TO CURVE";
  get("fieldScore").textContent = ball.scoreBefore + " · " + ball.minute;
  get("goalMarker").style.left = ball.shotDirection === 1 ? "62%" : "38%";
  get("goalFrame").classList.remove("is-goal");
  get("keeper").style.transform = "translate(-50%, -50%)";
  get("gameOrbImage").src = ball.image;
  get("gameOrb").style.left = "50%";
  get("gameOrb").style.top = "79%";
  get("gameOrb").style.transform = "translate(-50%, -50%)";
  get("powerFill").style.width = "0%";
  get("powerValue").textContent = "0%";
  get("kickButton").disabled = false;
  get("kickButton").textContent = "HOLD TO KICK";
  get("gameStatus").textContent = "Aim for the highlighted corner.";
  showGamePart("play");
}

function startCharge(event) {
  if (gameState !== "play" || charging || flying || get("kickButton").disabled) return;
  if (event && event.cancelable) event.preventDefault();

  charging = true;
  powerStart = Date.now();
  get("kickButton").textContent = "RELEASE TO SHOOT";

  powerTimer = setInterval(function () {
    const seconds = (Date.now() - powerStart) / 1000;
    power = Math.round(Math.abs(Math.sin(seconds * 1.4)) * 100);
    get("powerFill").style.width = power + "%";
    get("powerValue").textContent = power + "%";
  }, 25);
}

function releaseShot(event) {
  if (!charging) return;
  if (event && event.cancelable) event.preventDefault();

  charging = false;
  clearInterval(powerTimer);
  flying = true;
  flightStart = performance.now();
  get("kickButton").disabled = true;
  get("kickButton").textContent = "IN FLIGHT";
  get("gameStatus").textContent = "SWIPE TO CURVE THE BALL!";
  flightFrame = requestAnimationFrame(moveBall);
}

function moveBall(time) {
  if (!flying) return;

  let progress = (time - flightStart) / 1850;
  progress = Math.min(progress, 1);
  const smooth = progress * progress * (3 - 2 * progress);
  const x = 50 + curve * 21 * smooth;
  const y = 79 - 49 * smooth;

  get("gameOrb").style.left = x + "%";
  get("gameOrb").style.top = y + "%";
  get("gameOrb").style.transform = "translate(-50%, -50%) scale(" + (1 - 0.69 * smooth) + ")";

  if (progress < 1) {
    flightFrame = requestAnimationFrame(moveBall);
  } else {
    checkGoal();
  }
}

function checkGoal() {
  flying = false;
  const ball = footballs[currentBall];
  const goal = power >= 43 && power <= 96 && curve * ball.shotDirection >= 0.23;

  if (goal) {
    get("goalFrame").classList.add("is-goal");
    get("keeper").style.transform = ball.shotDirection === 1
      ? "translate(-170%, -50%) rotate(-35deg)"
      : "translate(80%, -50%) rotate(35deg)";
    get("gameStatus").textContent = "GOAL!";
  } else {
    get("gameStatus").textContent = "NO GOAL — TRY AGAIN.";
  }

  resultTimer = setTimeout(function () {
    if (gameState !== "play") return;
    gameState = "result";
    get("resultEyebrow").textContent = goal ? "GOAL / RECREATED" : "NO GOAL / TRY AGAIN";
    get("resultHeadline").textContent = goal ? "CONGRATULATIONS." : "SO CLOSE.";
    get("resultHeadline").classList.toggle("missed", !goal);

    if (goal) {
      get("resultDescription").textContent = "You just recreated " + ball.goalText;
    } else if (power < 43) {
      get("resultDescription").textContent = "Not enough power. Hold a little longer, then release.";
    } else if (power > 96) {
      get("resultDescription").textContent = "Too much power! Release earlier.";
    } else {
      const direction = ball.shotDirection === 1 ? "right" : "left";
      get("resultDescription").textContent = "Try swiping " + direction + " while the ball is flying.";
    }

    get("resultScore").textContent = ball.country + " " + ball.score + " " + ball.opponent;
    get("resultNext").hidden = !goal;
    showGamePart("result");
  }, 620);
}

function addCurve(amount) {
  if (!flying) return;
  curve = Math.max(-1, Math.min(1, curve + amount));
  get("gameStatus").textContent = "CURVE " + (curve < 0 ? "LEFT" : "RIGHT") + " · " + Math.round(Math.abs(curve) * 100) + "%";
}

const kickButton = get("kickButton");
kickButton.addEventListener("pointerdown", function (event) {
  if (event.button !== 0) return;
  kickButton.setPointerCapture(event.pointerId);
  startCharge(event);
});
kickButton.addEventListener("pointerup", releaseShot);
kickButton.addEventListener("pointercancel", releaseShot);

const gameField = get("gameField");
let curveAtSwipeStart = 0;

gameField.addEventListener("pointerdown", function (event) {
  if (!flying) return;
  fieldDragX = event.clientX;
  curveAtSwipeStart = curve;
});

window.addEventListener("pointermove", function (event) {
  if (!flying || fieldDragX === null) return;
  const distance = event.clientX - fieldDragX;
  curve = curveAtSwipeStart;
  addCurve(distance / 170);
});

window.addEventListener("pointerup", function (event) {
  if (flying && fieldDragX !== null) {
    const distance = event.clientX - fieldDragX;
    curve = curveAtSwipeStart;
    addCurve(distance / 170);
  }
  fieldDragX = null;
});
window.addEventListener("pointercancel", function () { fieldDragX = null; });

get("resultAgain").addEventListener("click", startChallenge);
get("resultBack").addEventListener("click", closeGame);
get("resultNext").addEventListener("click", function () {
  currentBall = (currentBall + 1) % footballs.length;
  showingMore = false;
  updateCarousel();
  get("gameTopLabel").textContent = footballs[currentBall].year + " / " + footballs[currentBall].name.toUpperCase();
  startChallenge();
});

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    if (gameState !== "closed") closeGame();
    else if (menu.classList.contains("open")) closeMenu();
    else if (showingMore) { showingMore = false; updateCarousel(); }
    return;
  }

  if (gameState === "tutorial") {
    if (event.key === "ArrowRight") changeTutorial(1);
    if (event.key === "ArrowLeft") changeTutorial(0);
    if (event.key === "Enter" && tutorialStep === 1) startChallenge();
    return;
  }

  if (gameState === "play") {
    if (event.code === "Space" && !event.repeat) startCharge(event);
    if (event.key === "ArrowRight") addCurve(0.26);
    if (event.key === "ArrowLeft") addCurve(-0.26);
    return;
  }

  if (!app.classList.contains("is-archive") || menu.classList.contains("open")) return;
  if (event.key === "ArrowRight") changeBall(1);
  if (event.key === "ArrowLeft") changeBall(-1);
});

window.addEventListener("keyup", function (event) {
  if (event.code === "Space" && charging) releaseShot(event);
});

updateCarousel();
