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
    const PHS = document.getElementById('PHS');

    let upgrade1Cost = 10;
    let upgrade2Cost = 50;
    let upgrade3Cost = 100;
    let upgrade4Cost = 300;
    let upgrade5Cost = 3000;

    // Initially disable and gray out Cheese & Pepperoni upgrades
    upgrade2.disabled = true;
    upgrade2.style.opacity = "0.5";
    upgrade3.disabled = true;
    upgrade3.style.opacity = "0.5";

    // Clicking the pizza adds `clickValue` to score
    if (pizza && scoreDisplay) {
        pizza.addEventListener('click', () => {
            score += clickValue;
            scoreDisplay.textContent = score;
        });
    } else {
        console.error("Error: Missing elements 'pizza' or 'scoreDisplay'.");
    }

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

    function startAutoClick() {
        if (!autoClickInterval) {
            autoClickInterval = setInterval(() => {
                score += autoClickValue;
                scoreDisplay.textContent = score;
                PHS.textContent = `(+${autoClickValue}/sek)`;
                pizza.classList.add('autoclick');

                // Fjern animasjonen etter kort tid
                setTimeout(() => {
                    pizza.classList.remove('autoclick');
                }, 100);
            }, 1000);
        }
    }

    function updateTooltips() {
        document.getElementById('tooltip1').textContent = `Koster: ${upgrade1Cost} | Gir: +1 PHS`;
        document.getElementById('tooltip2').textContent = `Koster: ${upgrade2Cost} | Gir: +3 PHS`;
        document.getElementById('tooltip3').textContent = `Koster: ${upgrade3Cost} | Gir: +5 PHS`;
        document.getElementById('tooltip4').textContent = `Koster: ${upgrade4Cost} | Gir: +1 PHC`;
        document.getElementById('tooltip5').textContent = `Koster: ${upgrade5Cost} | Gir: +2 PHC`;
    }

    if (upgrade1) {
        upgrade1.addEventListener('click', () => {
            if (score >= upgrade1Cost) {
                score -= upgrade1Cost;
                autoClickValue += 1;
                upgrade1Cost = Math.floor(upgrade1Cost * 1.75);
                scoreDisplay.textContent = score;
                updateTooltips();
                startAutoClick();

                // Unlock Cheese upgrade
                upgrade2.disabled = false;
                upgrade2.style.opacity = "1";
            } else {
                showNoPizzaPopup();
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
                updateTooltips();
                startAutoClick();

                // Unlock Pepperoni upgrade
                upgrade3.disabled = false;
                upgrade3.style.opacity = "1";
            } else {
                showNoPizzaPopup();
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
                updateTooltips();
                startAutoClick();
            } else {
                showNoPizzaPopup();
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
                upgrade4.style.display = "none";
                upgrade4.disabled = true;
            } else {
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
                upgrade5.style.display = "none";
                upgrade5.disabled = true;
            } else {
                showNoPizzaPopup();
            }
        });
    }

    function showNoPizzaPopup() {
        const popup = document.getElementById('noPizzaPopup');
        popup.style.display = 'block';

        setTimeout(() => {
            popup.style.animation = 'fadeInOut 2s forwards';

            setTimeout(() => {
                popup.style.display = 'none';
                popup.style.animation = '';
            }, 3000);
        },);
    }

    updateTooltips();
    displayScore();
    setInterval(saveClicks, 10000);
});
