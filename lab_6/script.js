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
  const explosionGif = document.getElementById("explosion-gif");

  let rocketY = canvas.height - 50;
  let multiplier = 1.0;
  let crashMultiplier = 0;
  let animationFrame;
  let rocketSpeed = 2;
  let isCrashed = false;
  let isStopped = false;

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#FFFFFF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawRocket() {
    const rocketImage = new Image();
    rocketImage.src = "images/rocket.png";
    const rocketWidth = 40;
    const rocketHeight = 60;

    ctx.drawImage(
      rocketImage,
      canvas.width / 2 - rocketWidth / 2,
      rocketY,
      rocketWidth,
      rocketHeight
    );

    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 5, rocketY + rocketHeight);
    ctx.lineTo(canvas.width / 2 + 5, rocketY + rocketHeight);
    ctx.lineTo(canvas.width / 2, rocketY + rocketHeight + 20);
    ctx.closePath();
    ctx.fill();
  }

  function drawMultiplier() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`x${multiplier.toFixed(2)}`, canvas.width / 2, 50);
  }

  function showExplosion() {
    const explosionWidth = 80;
    const explosionHeight = 80;

    explosionGif.style.left = `${canvas.offsetLeft + canvas.width / 2 - explosionWidth / 2}px`;
    explosionGif.style.top = `${canvas.offsetTop + rocketY - explosionHeight / 2}px`;
    explosionGif.style.display = "block";

    setTimeout(() => {
      explosionGif.style.display = "none";
    }, 1500);
  }

  function animateRocket(betAmount) {
    if (isCrashed || isStopped) return; // Stop animation if the game is over or stopped
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawRocket();
    drawMultiplier();
  
    rocketY -= rocketSpeed;
    multiplier += 0.01; // Increment multiplier
  
    if (multiplier >= crashMultiplier) {
      isCrashed = true;
      endGame(betAmount, isStopped); // Pass whether the user stopped the game
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

    // Change the button to "Stop"
    startButton.textContent = "Stop";
    startButton.onclick = () => stopGame(betAmount);
  }

  function stopGame(betAmount) {
    if (isStopped || isCrashed) return; // Prevent multiple stops

    isStopped = true;
    cancelAnimationFrame(animationFrame); // Stop the rocket animation immediately

    // Lock in the current multiplier as winnings
    const winningsMultiplier = multiplier;
    const winnings = (betAmount * winningsMultiplier).toFixed(2);

    // Add winnings to the user's balance
    window.addWinnings(parseFloat(winnings));

    // Display the result
    resultDiv.textContent = `You cashed out at x${winningsMultiplier.toFixed(2)} and won ${winnings} credits!`;

    // Prevent further animation or crashes
    isCrashed = true;

    // Reset the button to "Start Game"
    startButton.textContent = "Start Game";
    startButton.onclick = startGame;
  }

  function resetGame() {
    rocketY = canvas.height - 50;
    multiplier = 1.0; // Reset multiplier only when starting a new game
    isCrashed = false;
    isStopped = false;
    resultDiv.textContent = "";
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
  }

  function determineCrashMultiplier() {
    const random = Math.random();
    if (random < 0.5) return (Math.random() * 1.5 + 1).toFixed(2);
    if (random < 0.8) return (Math.random() * 2 + 2.5).toFixed(2);
    return (Math.random() * 5 + 4.5).toFixed(2);
  }

  function endGame(betAmount, userStopped) {
    cancelAnimationFrame(animationFrame);
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    showExplosion();
  
    if (!userStopped) {
      resultDiv.textContent = `CRASHED at x${crashMultiplier}! You lost your bet.`;
    }
  
    // Reset the button to "Start Game"
    startButton.textContent = "Start Game";
    startButton.onclick = startGame;
  }

  startButton.addEventListener("click", startGame);
  drawBackground();
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
    ctx.fillStyle = "white";
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
    const winningSegment = Math.floor(Math.random() * segments);
    const resultColor =
      winningSegment === 0
        ? "green"
        : winningSegment % 2 === 0
        ? "black"
        : "red";

    // Start spinning animation
    spinSpeed = Math.random() * 0.1 + 0.3; // Random initial speed
    animateSpin(bet, choice, winningSegment, resultColor);
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

document.addEventListener("DOMContentLoaded", () => {
  const balanceDisplay = document.getElementById("balance");
  const addBalanceInput = document.getElementById("add-balance");
  const addBalanceBtn = document.getElementById("add-balance-btn");
  const withdrawBalanceInput = document.getElementById("withdraw-balance");
  const withdrawBalanceBtn = document.getElementById("withdraw-balance-btn");

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

  // Withdraw balance
  if (withdrawBalanceBtn) {
    withdrawBalanceBtn.addEventListener("click", () => {
      const amount = parseFloat(withdrawBalanceInput.value);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount to withdraw.");
        return;
      }
      if (amount > balance) {
        alert("Insufficient balance.");
        return;
      }
      balance -= amount;
      localStorage.setItem("balance", balance); // Save balance to localStorage
      updateBalanceDisplay();
      withdrawBalanceInput.value = "";
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
  
  // Bets mechanism
  const betsList = document.getElementById("bets");
  const placeBetBtn = document.getElementById("place-bet-btn");
  const betAmountInput = document.getElementById("bet-amount");
  const betCoefInput = document.getElementById("bet-coef");
  let betHistory = [];

  if (placeBetBtn) {
    placeBetBtn.addEventListener("click", () => {
      const amount = parseFloat(betAmountInput.value);
      const coef = parseFloat(betCoefInput.value);

      if (isNaN(amount) || amount <= 0 || isNaN(coef) || coef < 1) {
        alert("Enter a valid bet amount and coefficient (≥1).");
        return;
      }

      // Deduct balance
      if (!window.deductBalance(amount)) {
        alert("Insufficient balance.");
        return;
      }

      const betObj = {
        amount,
        coef,
        status: "Pending",
        result: null
      };

      // Add to history and keep only last 5
      betHistory.unshift(betObj);
      if (betHistory.length > 5) betHistory.pop();

      updateBetsList();

      // Simulate result after 5 seconds
      setTimeout(() => {
        // Win chance: 1/coef (like crash game)
        const win = Math.random() < (1 / coef);
        betObj.status = win ? "Won" : "Lost";
        betObj.result = win ? (amount * coef).toFixed(2) : 0;
        if (win) window.addWinnings(parseFloat(betObj.result));
        updateBetsList();
      }, 5000);
    });
  }

  function updateBetsList() {
    betsList.innerHTML = "";
    betHistory.forEach((bet, idx) => {
      const li = document.createElement("li");
      li.textContent = `Bet $${bet.amount} @ x${bet.coef} — ${bet.status}` +
        (bet.status !== "Pending" ? (bet.status === "Won" ? ` (+$${bet.result})` : " (Lost)") : "");

      // Add delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = () => {
        betHistory.splice(idx, 1);
        updateBetsList();
      };
      li.appendChild(delBtn);

      betsList.appendChild(li);
    });
  }
});
