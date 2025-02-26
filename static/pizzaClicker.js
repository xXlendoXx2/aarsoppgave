let score = 0;
let clickValue = 1; // Base click value

const pizza = document.getElementById('pizza');
const scoreDisplay = document.getElementById('scoreDisplay');
const saveStatus = document.getElementById('saveStatus');
const upgrade1 = document.getElementById('upgrade1');
const upgrade2 = document.getElementById('upgrade2');
let upgrade1Cost = 10;
let upgrade2Cost = 50;

// Increment score on pizza click
pizza.addEventListener('click', () => {
    score += clickValue;
    scoreDisplay.textContent = score;
});

// Function to save clicks to the server
function saveClicks() {
    saveStatus.textContent = "Saving...";

    fetch('/save_pizza', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: score }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            saveStatus.textContent = "Saved the game!";
        } else {
            saveStatus.textContent = "Error saving score!";
        }
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

displayScore();


// Upgrade click power
upgrade1.addEventListener('click', () => {
    if (score >= upgrade1Cost) {
        score -= upgrade1Cost;
        clickValue += 1;
        upgrade1Cost *= 2; // Increase cost for next upgrade
        upgrade1.textContent = `Upgrade Click (+1) - Cost: ${upgrade1Cost}`;
        scoreDisplay.textContent = score;
    }
});

upgrade2.addEventListener('click', () => {
    if (score >= upgrade2Cost) {
        score -= upgrade2Cost;
        clickValue += 5;
        upgrade2Cost *= 2; // Increase cost for next upgrade
        upgrade2.textContent = `Upgrade Click (+5) - Cost: ${upgrade2Cost}`;
        scoreDisplay.textContent = score;
    }
});


// Legger til en klikk-hendelse for å øke scoren
pizza.addEventListener('click', () => {
    score++; // Øker score med 1
    scoreDisplay.textContent = score; // Oppdaterer score på skjermen
});


// Automatisk lagring av scoren hvert 30. sekund
setInterval(() => {
    saveClicks();
}, 30000);



