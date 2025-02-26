document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    let clickValue = 1; // Clicks stay the same
    let autoClickValue = 0; // Only for passive income
    let autoClickInterval;

    // Get HTML elements
    const pizza = document.getElementById('pizza');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const saveStatus = document.getElementById('saveStatus');
    const upgrade1 = document.getElementById('upgrade1');
    const upgrade2 = document.getElementById('upgrade2');

    let upgrade1Cost = 10;
    let upgrade2Cost = 50;

    // Clicking the pizza adds `clickValue` to score
    if (pizza && scoreDisplay) {
        pizza.addEventListener('click', () => {
            score += clickValue;
            scoreDisplay.textContent = score;
        });
    } else {
        console.error("Error: Missing elements 'pizza' or 'scoreDisplay'.");
    }

    // Function to save clicks to the server
    function saveClicks() {
        saveStatus.textContent = "Saving...";

        fetch('/save_pizza', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: score }),
        })
        .then(response => response.json())
        .then(data => {
            saveStatus.textContent = data.success ? "Saved the game!" : "Error saving score!";
            setTimeout(() => saveStatus.textContent = "", 1000);
        })
        .catch(error => {
            console.error('Error:', error);
            saveStatus.textContent = "Error saving score!";
        });
    }

    // Fetch and display the score on page load
    function displayScore() {
        fetch('/get_score')
        .then(response => response.json())
        .then(data => {
            if (data.score !== undefined) {
                score = parseInt(data.score, 10);
                scoreDisplay.textContent = score;
            }
        })
        .catch(error => console.error('Error fetching score:', error));
    }

    // Start auto-clicking (passive income)
    function startAutoClick() {
        if (!autoClickInterval) {
            autoClickInterval = setInterval(() => {
                score += autoClickValue; // Only passive income
                scoreDisplay.textContent = score;
            }, 1000); // Runs every second
        }
    }

    // Upgrade 1: Adds to auto-clicking, not manual clicking
    if (upgrade1) {
        upgrade1.addEventListener('click', () => {
            if (score >= upgrade1Cost) {
                score -= upgrade1Cost;
                autoClickValue += 1; // Only increases passive income
                upgrade1Cost *= 2;
                upgrade1.textContent = `Tomato sauce PPS (${autoClickValue}/sec) - Cost: ${upgrade1Cost}`;
                scoreDisplay.textContent = score;
                startAutoClick();
            }
        });
    }

    // Upgrade 2: Increases auto-click speed even more
    if (upgrade2) {
        upgrade2.addEventListener('click', () => {
            if (score >= upgrade2Cost) {
                score -= upgrade2Cost;
                autoClickValue += 5; // Again, only for passive income
                upgrade2Cost *= 2;
                upgrade2.textContent = `Cheese PPS(${autoClickValue}/sec) - Cost: ${upgrade2Cost}`;
                scoreDisplay.textContent = score;
                startAutoClick();
            }
        });
    }

    displayScore();

    // Automatic saving every 30 seconds
    setInterval(saveClicks, 30000);
});
