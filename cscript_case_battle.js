if (typeof SkinClubCaseBattleCalculator === "undefined") {
    // CRAZY hack fix...

    class SkinClubCaseBattleCalculator {
        constructor() {
            this.moneyCounterClass = "CLASS__MC-EL-SCPC";

            this.battleProgressQuery = ".battle-progress";
            this.battleSlotQuery = ".battle-slot";
            this.battleInventoryQuery = "aside.battle-slot__aside .battle-slot-inventory";
            this.battleDropQuery = ".battle-inventory-drop";

            this.itemPriceQuery = ".drop-main-info__price";
            this.itemEventPointsQuery = ".battle-slot-inventory-event-points__text";

            this.playerInfoContainerQuery = ".battle-slot-player__player-info.player-info";
            this.playerInfoQuery = ".player-info__main";
            this.playerUsernameContainerQuery = ".player-info__username";

            this.init();
        }

        init() {
            this.onElementAppear(this.battleProgressQuery).then(() => {
                const observer = new MutationObserver((mutations, observer) => this._observerCallback(mutations, observer));
                const options = {
                    childList: true,
                    subtree: false
                };

                const caseInventories = document.querySelectorAll(this.battleInventoryQuery);
                caseInventories.forEach(caseInventory => observer.observe(caseInventory, options));

                this.updateMoneyCounters();
            });
        }

        onElementAppear(query) {
            return new Promise((resolve, reject) => {
                const observer = new MutationObserver((mutations, obs) => {
                    const element = document.querySelector(query);
                    if (element) {
                        obs.disconnect(); // stop observing if the element is found
                        resolve(element);
                    }
                });

                observer.observe(document, {
                    childList: true,
                    subtree: true
                });

                // check if the element already exists when the function is called
                const initialElement = document.querySelector(query);
                if (initialElement) {
                    observer.disconnect();
                    resolve(initialElement);
                }
            });
        }

        updateMoneyCounters() {
            // calculate player scores
            let playerScores = [];

            const players = document.querySelectorAll(this.battleSlotQuery);
            players.forEach(player => {
                let worth = 0.0;

                const inventory = player.querySelectorAll(this.battleDropQuery);
                inventory.forEach(item => {
                    const isEventPointsItem = item.querySelector(this.itemEventPointsQuery) !== null;
                    if (isEventPointsItem) {
                        return;
                    }

                    const price = parseFloat(item.querySelector(this.itemPriceQuery).innerText.replace("$", ""));
                    worth += price;
                });

                const name = player.querySelector(this.playerInfoQuery).textContent;
                playerScores.push({
                    name: name,
                    value: worth
                });
            });

            playerScores.sort((a, b) => b.value - a.value);
            const leader = playerScores[0];
            const lossLeader = playerScores[playerScores.length - 1];

            // user feedback
            players.forEach(player => {
                const playerInfoContainer = player.querySelector(this.playerInfoContainerQuery)
                const playerInfo = playerInfoContainer.querySelector(this.playerInfoQuery)
                const usernameContainer = playerInfoContainer.querySelector(this.playerUsernameContainerQuery);
                const name = playerInfo.textContent;
                const inventoryValue = playerScores.find(player => player.name === name).value;

                // highlight player
                if (name === leader.name) {
                    usernameContainer.style.color = "yellow";
                } else if (name === lossLeader.name) {
                    usernameContainer.style.color = "red";
                } else {
                    usernameContainer.style = "";
                }

                // money counter
                let moneyCounter = playerInfoContainer.querySelector(`.${this.moneyCounterClass}`);
                if (!moneyCounter) {
                    moneyCounter = document.createElement("div");
                    moneyCounter.classList.add(this.moneyCounterClass);
                    playerInfoContainer.appendChild(moneyCounter);
                }
                moneyCounter.innerHTML = `$${inventoryValue.toFixed(2)}`;
            });
        }

        _observerCallback(mutations, observer = null) {
            for (const mutation of mutations) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // make sure at least some items were added before updating
                    this.updateMoneyCounters();
                    break;
                }
            }
        }
    }

    new SkinClubCaseBattleCalculator();
}
