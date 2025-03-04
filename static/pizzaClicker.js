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
    const PPS = document.getElementById('PPS')

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
                PPS.textContent = `(+${autoClickValue}/sec)`

            }, 1000); // Runs every second
        }
    }

    // Upgrade 1: Adds to auto-clicking, not manual clicking
    function updateTooltips() {
        document.getElementById('tooltip1').textContent = `Cost: ${upgrade1Cost} | Gives: +1 PPS`;
        document.getElementById('tooltip2').textContent = `Cost: ${upgrade2Cost} | Gives: +5 PPS`;
    }
    
    if (upgrade1) {
        upgrade1.addEventListener('click', () => {
            if (score >= upgrade1Cost) {
                score -= upgrade1Cost;
                autoClickValue += 1;
                upgrade1Cost = Math.floor(upgrade1Cost * 1.75);
                scoreDisplay.textContent = score;
                updateTooltips(); // Update tooltip
                startAutoClick();
            }
        });
    }
    
    if (upgrade2) {
        upgrade2.addEventListener('click', () => {
            if (score >= upgrade2Cost) {
                score -= upgrade2Cost;
                autoClickValue += 5;
                upgrade2Cost = Math.floor(upgrade2Cost * 2);
                scoreDisplay.textContent = score;
                updateTooltips(); // Update tooltip
                startAutoClick();
            }
        });
    }
    
    // Initialize tooltips on page load
    updateTooltips();
    

    displayScore();

    // Automatic saving every 10 seconds
    setInterval(saveClicks, 10000);
});
