// Theme & Bets
const themeButton = document.getElementById('toggle-theme');
const addBetButton = document.getElementById('add-bet');
const clearBetsButton = document.getElementById('clear-bets');
const betsList = document.getElementById('bets');

document.body.className = localStorage.getItem('theme') || 'light';

themeButton?.addEventListener('click', () => {
  const currentTheme = document.body.className;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
});

addBetButton?.addEventListener('click', () => {
  const bet = prompt('Enter your bet (e.g., $50 on Red):');
  if (bet) {
    const betItem = document.createElement('li');
    betItem.textContent = bet;
    betItem.addEventListener('click', () => betItem.remove());
    betsList?.appendChild(betItem);
  }
});

clearBetsButton?.addEventListener('click', () => {
  if (betsList) betsList.innerHTML = '';
});

// Crash Game Logic
if (document.title === "Crash Game") {
  const canvas = document.getElementById('crash-canvas');
  const ctx = canvas.getContext('2d');
  const betInput = document.getElementById('crash-bet');
  const startButton = document.getElementById('start-crash');
  const resultDiv = document.getElementById('crash-result');

  let rocketY = canvas.height - 50;
  let multiplier = 1.0;
  let crashMultiplier = 0;
  let animationFrame;

  function startGame() {
    const betAmount = parseFloat(betInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
      resultDiv.textContent = 'Please enter a valid bet amount.';
      return;
    }

    resetGame();
    crashMultiplier = determineCrashMultiplier();
    animateRocket(betAmount);
  }

  function resetGame() {
    rocketY = canvas.height - 50;
    multiplier = 1.0;
    resultDiv.textContent = '';
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function determineCrashMultiplier() {
    const random = Math.random();
    if (random < 0.5) return (Math.random() * 1.5 + 1).toFixed(2);
    if (random < 0.8) return (Math.random() * 2 + 2.5).toFixed(2);
    return (Math.random() * 5 + 4.5).toFixed(2);
  }

  function animateRocket(betAmount) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2 - 10, rocketY, 20, 50);

    rocketY -= 2;
    multiplier += 0.01;

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`x${multiplier.toFixed(2)}`, 10, 30);

    if (multiplier >= crashMultiplier) {
      endGame(betAmount);
    } else {
      animationFrame = requestAnimationFrame(() => animateRocket(betAmount));
    }
  }

  function endGame(betAmount) {
    cancelAnimationFrame(animationFrame);
    resultDiv.textContent = `Crashed at x${crashMultiplier}! You ${
      multiplier >= crashMultiplier ? 'won' : 'lost'
    } ${betAmount * crashMultiplier} credits.`;
  }

  startButton.addEventListener('click', startGame);
}

// Roulette Game Logic
if (document.title === "Roulette Game") {
  const betInput = document.getElementById("roulette-bet");
  const choiceSelect = document.getElementById("roulette-choice");
  const spinBtn = document.getElementById("spin-roulette");
  const resultDiv = document.getElementById("roulette-result");
  const canvas = document.getElementById("roulette-canvas");
  const ctx = canvas.getContext("2d");

  const colors = ["red", "black", "red", "black", "red", "black", "green"]; // More red/black segments
  const segmentAngle = (2 * Math.PI) / colors.length;
  let rotation = 0;
  let spinning = false;

  function drawWheel(angleOffset = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < colors.length; i++) {
      const startAngle = i * segmentAngle + angleOffset;
      const endAngle = startAngle + segmentAngle;
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.arc(200, 200, 100, startAngle, endAngle);
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
    // Draw pointer
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(200, 80);
    ctx.lineTo(195, 90);
    ctx.lineTo(205, 90);
    ctx.closePath();
    ctx.fill();
  }

  function spinWheel() {
    if (spinning) return;
    const bet = parseInt(betInput.value);
    const choice = choiceSelect.value;
    if (isNaN(bet) || bet <= 0) {
      resultDiv.textContent = "Please enter a valid bet.";
      return;
    }

    spinning = true;
    resultDiv.textContent = "Spinning...";

    let angle = 0;
    let speed = Math.random() * 0.2 + 0.3; // Initial speed
    const deceleration = 0.995;

    function animate() {
      angle += speed;
      speed *= deceleration;

      drawWheel(angle);
      if (speed > 0.002) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        const normalizedAngle = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);   
        const finalIndex = Math.floor(normalizedAngle / segmentAngle);
        const result = colors[finalIndex];


        resultDiv.textContent = `Result: ${result.toUpperCase()} — You ${
          result === choice ? "Win!" : "Lose!"
        }`;
      }
    }

    animate();
  }

  spinBtn.addEventListener("click", spinWheel);
  drawWheel(); // Initial static wheel

  canvas.style.border = "2px solid white";
  canvas.style.background = "#222";
}


// Canvas styling for crash (if not in CSS)
const style = document.createElement('style');
style.textContent = `
  #crash-result, #roulette-result {
    font-size: 18px;
    margin-top: 20px;
  }

  #crash-canvas, #roulette-canvas {
    background-color: #333;
    border: 2px solid white;
    margin-top: 20px;
  }
`;
document.head.appendChild(style);
