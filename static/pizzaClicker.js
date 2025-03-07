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
    const upgrade3 = document.getElementById('upgrade3');
    const upgrade4 = document.getElementById('PHC1');
    const upgrade5 = document.getElementById('PHC2');
    const PHS = document.getElementById('PHS')

    let upgrade1Cost = 10;
    let upgrade2Cost = 50;
    let upgrade3Cost = 100;
    let upgrade4Cost = 300;
    let upgrade5Cost = 3000;

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
        saveStatus.textContent = "Lagrer...";

        fetch('/save_pizza', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: score }),
        })
            .then(response => response.json())
            .then(data => {
                saveStatus.textContent = data.success ? "Lagret dataen din!" : "Feilet med å lagre dataen din!";
                setTimeout(() => saveStatus.textContent = "", 1000);
            })
            .catch(error => {
                console.error('Error:', error);
                saveStatus.textContent = "Feilet med å lagre dataen din!";
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
            .catch(error => console.error('Error for å få lagret data:', error));
    }

    // Start auto-clicking (passive income)
    function startAutoClick() {
        if (!autoClickInterval) {
            autoClickInterval = setInterval(() => {
                score += autoClickValue; // Only passive income
                scoreDisplay.textContent = score;
                PHS.textContent = `(+${autoClickValue}/sek)`
            }, 1000)  // Runs every second
        }
    }

    // Upgrade 1: Adds to auto-clicking, not manual clicking
    function updateTooltips() {
        document.getElementById('tooltip1').textContent = `Koster: ${upgrade1Cost} | Gir: +1 PHS`;
        document.getElementById('tooltip2').textContent = `Koster: ${upgrade2Cost} | Gir: +2 PHS`;
        document.getElementById('tooltip3').textContent = `Koster: ${upgrade3Cost} | Gir: +5 PHS`;
        document.getElementById('tooltip4').textContent = `Koster: ${upgrade4Cost} | Gir: +1 PHC`;
        document.getElementById('tooltip5').textContent = `Koster: ${upgrade5Cost} | Gir: +2 PHC`;

    }
/* Har tenkt til å legge til slik at oppgraderingene blir bedre hvis man kjøper de 10 ganger osv.*/
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
            else {
                showNoPizzaPopup(); // Viser en popup-melding
            }
        });
    }

    if (upgrade2) {
        upgrade2.addEventListener('click', () => {
            if (score >= upgrade2Cost) {
                score -= upgrade2Cost;
                autoClickValue += 3;
                upgrade2Cost = Math.floor(upgrade2Cost * 1.75);
                scoreDisplay.textContent = score;
                updateTooltips(); // Update tooltip
                startAutoClick();
            }
            else {
                showNoPizzaPopup(); // Viser en popup-melding
            }
        });
    }

    if (upgrade3) {
        upgrade3.addEventListener('click', () => {
            if (score >= upgrade3Cost) {
                score -= upgrade3Cost;
                autoClickValue += 5;
                upgrade3Cost = Math.floor(upgrade3Cost * 2.5);
                scoreDisplay.textContent = score;
                updateTooltips(); // Update tooltip
                startAutoClick();
            } else { 
                showNoPizzaPopup(); // Viser en popup-melding
            }
        });
    }
    
    if (upgrade4) {
        upgrade4.addEventListener('click', () => {
            if (score >= upgrade4Cost) {
                score -= upgrade4Cost;
                clickValue += 1;
                scoreDisplay.textContent = score;
                updateTooltips();
                upgrade4.style.display = "none"; // Hides the button
                upgrade4.disabled = true;
                //oppdaterer pvs telling
            }
            else {
                showNoPizzaPopup();
            }
        });
    }
    if (upgrade5) {
        upgrade5.addEventListener('click', () => {
            if (score >= upgrade5Cost) {
                score -= upgrade5Cost;
                clickValue += 2;
                scoreDisplay.textContent = score;
                updateTooltips();
                upgrade5.style.display = "none"; // Hides the button
                upgrade5.disabled = true;
                //oppdaterer pps telling
            }
            else {
                showNoPizzaPopup();
            }
        });
    }

    function showNoPizzaPopup() {
        //popup er fra id som lager boksen til critical hit!
        const popup = document.getElementById('noPizzaPopup');
        //dette blokkerer cssen som fjerner popupen og gjør den synlig
        popup.style.display = 'block';
    
    
        setTimeout(() => {
            //legger til en animasjon som blir borte om 3 sekunder
            popup.style.animation = 'fadeInOut 2s forwards';
    
            setTimeout(() => {
                popup.style.display = 'none';
                popup.style.animation = '';
            }, 3000);
        }, );
    }
    // Initialize tooltips on page load
    updateTooltips();


    displayScore();

    // Automatic saving every 10 seconds
    setInterval(saveClicks, 10000);
});
