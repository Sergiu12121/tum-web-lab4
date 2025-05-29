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
  const canvas = document.getElementById("crash-canvas");
  const ctx = canvas.getContext("2d");
  const betInput = document.getElementById("crash-bet");
  const startButton = document.getElementById("start-crash");
  const resultDiv = document.getElementById("crash-result");

  let rocketY = canvas.height - 50;
  let multiplier = 1.0;
  let crashMultiplier = 0;
  let animationFrame;
  let rocketSpeed = 2;
  let isCrashed = false;

  // Load the rocket image
  const rocketImage = new Image();
  rocketImage.src = "images/rocket.png";

  function drawBackground() {
    // Gradient background to simulate the sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB"); // Sky blue
    gradient.addColorStop(1, "#FFFFFF"); // White
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawRocket() {
    // Draw the rocket image
    const rocketWidth = 70;
    const rocketHeight = 90;
    ctx.drawImage(
      rocketImage,
      canvas.width / 2 - rocketWidth / 2,
      rocketY,
      rocketWidth,
      rocketHeight
    );

  }

  function drawMultiplier() {
    // Display the multiplier
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`x${multiplier.toFixed(2)}`, canvas.width / 2, 50);
  }

  function drawExplosion() {
    // Draw an explosion effect
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, rocketY, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, rocketY, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  function animateRocket(betAmount) {
    if (isCrashed) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawRocket();
    drawMultiplier();

    rocketY -= rocketSpeed;
    multiplier += 0.02;

    if (multiplier >= crashMultiplier) {
      isCrashed = true;
      endGame(betAmount);
    } else {
      animationFrame = requestAnimationFrame(() => animateRocket(betAmount));
    }
  }

  function startGame() {
    const betAmount = parseFloat(betInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
      resultDiv.textContent = "Please enter a valid bet amount.";
      return;
    }

    if (!window.deductBalance(betAmount)) {
      resultDiv.textContent = "Insufficient balance. Please add more funds.";
      return;
    }

    resetGame();
    crashMultiplier = determineCrashMultiplier();
    animateRocket(betAmount);
  }

  function resetGame() {
    rocketY = canvas.height - 50;
    multiplier = 1.0;
    isCrashed = false;
    resultDiv.textContent = "";
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
  }

  function determineCrashMultiplier() {
    // Higher chance of crashing at lower multipliers
    const random = Math.random();
    if (random < 0.5) return (Math.random() * 1.5 + 1).toFixed(2); // 1.0 - 2.5
    if (random < 0.8) return (Math.random() * 2 + 2.5).toFixed(2); // 2.5 - 4.5
    return (Math.random() * 5 + 4.5).toFixed(2); // 4.5 - 9.5
  }

  function endGame(betAmount) {
    cancelAnimationFrame(animationFrame);
    drawExplosion();

    let winnings = 0;
    if (multiplier >= crashMultiplier) {
      winnings = Math.floor(betAmount * crashMultiplier);
      window.addWinnings(winnings);
    }

    resultDiv.textContent = `CRASHED at x${crashMultiplier}! You ${
      winnings > 0 ? `won ${winnings} credits!` : "lost your bet."
    }`;
  }

  startButton.addEventListener("click", startGame);
  drawBackground(); // Initial background
}

// Roulette Game Logic
if (document.title === "Roulette Game") {
  const betInput = document.getElementById("roulette-bet");
  const choiceSelect = document.getElementById("roulette-choice");
  const spinBtn = document.getElementById("spin-roulette");
  const resultDiv = document.getElementById("roulette-result");
  const canvas = document.getElementById("roulette-canvas");
  const ctx = canvas?.getContext("2d");

  const colors = ["red", "black", "green"];
  const segments = 37; // 37 segments for numbers 0-36
  const segmentAngle = (2 * Math.PI) / segments;
  let currentAngle = 0;
  let spinSpeed = 0;
  let resultIndex = 0;

  function drawRouletteWheel() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the wheel
    for (let i = 0; i < segments; i++) {
      const angle = currentAngle + i * segmentAngle;

      // Alternate colors for segments
      ctx.fillStyle = i === 0 ? "green" : i % 2 === 0 ? "black" : "red";

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        150,
        angle,
        angle + segmentAngle
      );
      ctx.closePath();
      ctx.fill();

      // Draw numbers
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle + segmentAngle / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(
        i.toString(),
        100 * Math.cos(segmentAngle / 2),
        100 * Math.sin(segmentAngle / 2)
      );
      ctx.restore();
    }

    // Draw the pointer
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2 - 160);
    ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 - 160);
    ctx.lineTo(canvas.width / 2, canvas.height / 2 - 140);
    ctx.closePath();
    ctx.fill();
  }

  function spinRoulette() {
    const bet = parseFloat(betInput.value);
    const choice = choiceSelect.value;

    if (isNaN(bet) || bet <= 0) {
      resultDiv.textContent = "Please enter a valid bet.";
      return;
    }

    if (!window.deductBalance(bet)) {
      resultDiv.textContent = "Insufficient balance. Please add more funds.";
      return;
    }

    // Determine the result
    resultIndex = Math.floor(Math.random() * segments);

    // Start spinning
    spinSpeed = Math.random() * 0.1 + 0.3; // Random initial speed
    animateSpin(bet, choice);
  }

  function animateSpin(bet, choice) {
    if (spinSpeed > 0) {
      currentAngle += spinSpeed;
      spinSpeed *= 0.98; // Gradually slow down
      drawRouletteWheel();
      requestAnimationFrame(() => animateSpin(bet, choice));
    } else {
      // Stop spinning and determine the result
      const finalAngle = (currentAngle % (2 * Math.PI)) + Math.PI / 2;
      const winningSegment = Math.floor(
        (segments - Math.floor(finalAngle / segmentAngle)) % segments
      );

      const resultColor =
        winningSegment === 0
          ? "green"
          : winningSegment % 2 === 0
          ? "black"
          : "red";

      let winnings = 0;
      if (resultColor === choice) {
        winnings = choice === "green" ? bet * 14 : bet * 2; // Green pays 14x, others pay 2x
        window.addWinnings(winnings);
      }

      resultDiv.textContent = `Result: ${resultColor.toUpperCase()} (${
        winningSegment
      }) — You ${
        winnings > 0 ? `Win $${winnings.toFixed(2)}!` : "Lose!"
      }`;
    }
  }

  spinBtn.addEventListener("click", spinRoulette);
  drawRouletteWheel(); // Initial draw
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

document.addEventListener("DOMContentLoaded", () => {
  const balanceDisplay = document.getElementById("balance");
  const addBalanceInput = document.getElementById("add-balance");
  const addBalanceBtn = document.getElementById("add-balance-btn");

  // Retrieve balance from localStorage or initialize it
  let balance = parseFloat(localStorage.getItem("balance")) || 0;

  // Update balance display
  function updateBalanceDisplay() {
    if (balanceDisplay) {
      balanceDisplay.textContent = balance.toFixed(2);
    }
  }

  // Add balance
  if (addBalanceBtn) {
    addBalanceBtn.addEventListener("click", () => {
      const amount = parseFloat(addBalanceInput.value);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount to add.");
        return;
      }
      balance += amount;
      localStorage.setItem("balance", balance); // Save balance to localStorage
      updateBalanceDisplay();
      addBalanceInput.value = "";
    });
  }

  // Deduct balance (used in games)
  function deductBalance(amount) {
    if (amount > balance) {
      return false; // Insufficient balance
    }
    balance -= amount;
    localStorage.setItem("balance", balance); // Save updated balance
    updateBalanceDisplay();
    return true;
  }

  // Add winnings to balance
  function addWinnings(amount) {
    balance += amount;
    localStorage.setItem("balance", balance); // Save updated balance
    updateBalanceDisplay();
  }

  // Expose balance functions globally for other pages
  window.getBalance = () => balance;
  window.deductBalance = deductBalance;
  window.addWinnings = addWinnings;

  updateBalanceDisplay(); // Initialize balance display
});
