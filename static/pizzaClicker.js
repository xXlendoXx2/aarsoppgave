document.addEventListener("DOMContentLoaded", () => {
    // variabler som definerer poeng, økning av poeng med trykk eller automatisk
    let score = 9300;
    let clickValue = 1;
    let autoClickValue = 0;
    let autoClickInterval;
    let stamina = 100;
    let canClick = true;
    const maxStamina = 100;
    const staminaLossPerClick = 7.5;
    const staminaRegenRate = 1.5; // hvor mye stamina fylles hvert intervall
    const staminaRegenInterval = 100; // millisekunder

    // "Hente divs" fra html siden 
    const pizza = document.getElementById('pizza');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const saveStatus = document.getElementById('saveStatus');
    const upgrade1 = document.getElementById('upgrade1');
    const upgrade2 = document.getElementById('upgrade2');
    const upgrade3 = document.getElementById('upgrade3');
    const upgrade4 = document.getElementById('PHC1');
    const upgrade5 = document.getElementById('PHC2');
    const PHS = document.getElementById('PHS');
    const PHC = document.getElementById("PHC")
    const tooltip4 = document.getElementById("tooltip4")
    const flex_phc = document.getElementById("flex_phc")
    // variabler for hver knapp oppgradering og hvor mye poeng de koster
    let upgrade1Cost = 10;
    let upgrade2Cost = 50;
    let upgrade3Cost = 100;
    let upgrade4Cost = 300;
    let upgrade5Cost = 3000;
    let upgrade1Count = 0;
    let upgrade2Count = 0;
    let upgrade3Count = 0;
    let upgrade5Count = 0;


    // Initially disable and gray out Cheese & Pepperoni upgrades
    upgrade2.disabled = true;
    upgrade2.style.opacity = "0.5";
    upgrade3.disabled = true;
    upgrade3.style.opacity = "0.5";
    upgrade5.disabled = true;
    upgrade5.style.opacity = "0.5";


    function saveClicks() {
        saveStatus.textContent = "Lagrer...";
        setTimeout(() => saveStatus.textContent = "", 3000);
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
                    scoreDisplay.textContent = `Pizzaer:${score}`;
                }
            })
            .catch(error => console.error('Error for å få lagret data:', error));
    }

    function startAutoClick() {
        if (!autoClickInterval) {
            autoClickInterval = setInterval(() => {
                score += autoClickValue;
                scoreDisplay.textContent = `Pizzaer:${score}`;
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
        document.getElementById('tooltip5').textContent = `Koster: ${upgrade5Cost} | Gir: +3 PHC`;
        document.getElementById("level1").textContent = `level: ${upgrade1Count}`
        document.getElementById("level2").textContent = `level: ${upgrade2Count}`
        document.getElementById("level3").textContent = `level: ${upgrade3Count}`
        document.getElementById("level5").textContent = `level: ${upgrade5Count}`


    }

    if (upgrade1) {
        upgrade1.addEventListener('click', () => {
            if (score >= upgrade1Cost) {
                score -= upgrade1Cost;
                autoClickValue += 1;
                upgrade1Count ++;
                upgrade1Cost = Math.floor(upgrade1Cost * 1.75);
                scoreDisplay.textContent = `Pizzaer:${score}`;
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
                upgrade2Count ++;
                upgrade2Cost = Math.floor(upgrade2Cost * 1.75);
                scoreDisplay.textContent = `Pizzaer:${score}`;
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
                upgrade3Count ++;
                upgrade3Cost = Math.floor(upgrade3Cost * 2.5);
                scoreDisplay.textContent = `Pizzaer:${score}`;
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
                scoreDisplay.textContent = `Pizzaer:${score}`;
                PHC.textContent = `(+${clickValue}/click)`
                tooltip4.style.display = "none"
                upgrade4.style.display = "none";
                upgrade4.disabled = true;
                upgrade5.disabled = false;
                upgrade5.style.opacity = "1";
                updateTooltips();
            } else {
                showNoPizzaPopup();
            }
        });
    }
        if (upgrade5) {
            upgrade5.addEventListener('click', () => {
                if (score >= upgrade5Cost) {
                    score -= upgrade5Cost;
                    clickValue += 3;
                    upgrade5Count ++;
                    upgrade5Cost = Math.floor(upgrade5Cost * 1.5);
                    scoreDisplay.textContent = `Pizzaer:${score}`;
                    PHC.textContent = `(+${clickValue}/click)`
                    updateTooltips();
                } else {
                    showNoPizzaPopup();
                }
            });
        }
    function showNoPizzaPopup() {
        const popup = document.getElementById('noPizzaPopup');
        popup.style.display = 'block';

        setTimeout(() => {
            popup.style.animation = 'fadeInOut 4s forwards';

            setTimeout(() => {
                popup.style.display = 'none';
                popup.style.animation = '';
            }, 6000);
        },);
    }

    
function updateStaminaBar() {
    staminaBar.style.width = `${stamina}%`;
    if (stamina < 10) {
        staminaBar.style.backgroundColor = "red";
        canClick = false;
    } else if (stamina < 70) {
        staminaBar.style.backgroundColor = "orange";
        canClick = true;
    } else {
        staminaBar.style.backgroundColor = "green";
        canClick = true;

    }
}

pizza.addEventListener('click', () => {
    if (canClick && stamina >= staminaLossPerClick) {
        score += clickValue;
        scoreDisplay.textContent = `Pizzaer:${score}`;
        stamina -= staminaLossPerClick;
        updateStaminaBar();
    }
});

// Regenerer stamina over tid
setInterval(() => {
    if (stamina < maxStamina) {
        stamina = Math.min(stamina + staminaRegenRate, maxStamina);
        updateStaminaBar();
    }
}, staminaRegenInterval);

    updateStaminaBar(); // kjør én gang ved oppstart
    updateTooltips();
    displayScore();
    setInterval(saveClicks, 30000);
});
