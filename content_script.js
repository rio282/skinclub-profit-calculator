if (typeof SkinClubProfitCalculator === "undefined") {
    // CRAZY hack fix...

    class SkinClubProfitCalculator {
        constructor() {
            this.profitMarginElementId = "__PM-EL-SCPC";
            this.avgLossElementId = "__AL-EL-SCPC";

            this.caseTitleContainerQuery = ".case-title-wrapper";
            this.priceTagQuery = "span.price";
            this.dropsQuery = ".skins-list.items-list .case-skin";
            this.dropsPricesQuery = ".table-cell.price-and-quality span.price";
            this.dropsOddsQuery = ".pf-table-row-link .table-cell.odds";

            this.init();
        }

        init() {
            this.onElementAppear(this.priceTagQuery).then(() => {
                this.runCalculateProfitChance();
                this.runCalculateAvgLoss();
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

        calculateProfitChance(casePrice) {
            casePrice = parseFloat(casePrice.replace("$", ""));

            const drops = document.querySelectorAll(this.dropsQuery);
            const pricesAndChances = [];

            drops.forEach(drop => {
                const dropPriceElement = drop.querySelector(this.dropsPricesQuery);
                const dropPrice = dropPriceElement.innerHTML.replace("$", "");

                const dropOddsElement = drop.querySelector(this.dropsOddsQuery);
                const dropChance = dropOddsElement.innerHTML.replace("%", "");

                pricesAndChances.push({
                    dropPrice: parseFloat(dropPrice),
                    dropChance: parseFloat(dropChance)
                });
            });

            let profitChance = 0.0;
            pricesAndChances.forEach(item => {
                if (item.dropPrice > casePrice) {
                    profitChance += item.dropChance;
                }
            });

            return profitChance;
        }

        runCalculateProfitChance() {
            const elementAlreadyExists = document.getElementById(this.profitMarginElementId);
            if (elementAlreadyExists) {
                // do nothing.
                return;
            }

            const price = document.querySelector(this.priceTagQuery).innerText;

            const profitMarginElement = document.createElement("span");
            profitMarginElement.id = this.profitMarginElementId;
            profitMarginElement.style.textAlign = "center";
            profitMarginElement.style.textTransform = "uppercase";
            profitMarginElement.style.color = "#4f4b78";
            profitMarginElement.innerText = `${this.calculateProfitChance(price).toFixed(1)}% chance of making a profit`;

            const caseTitleContainer = document.querySelector(this.caseTitleContainerQuery);
            caseTitleContainer.style.textAlign = "center";
            caseTitleContainer.style.gap = "14px";
            caseTitleContainer.appendChild(profitMarginElement);
        }

        calculateAvgLoss(casePrice) {
            casePrice = parseFloat(casePrice.replace("$", ""));

            const drops = document.querySelectorAll(this.dropsQuery);
            const pricesAndChances = [];

            drops.forEach(drop => {
                const dropPriceElement = drop.querySelector(this.dropsPricesQuery);
                const dropPrice = dropPriceElement.innerHTML.replace("$", "");

                const dropOddsElement = drop.querySelector(this.dropsOddsQuery);
                const dropChance = dropOddsElement.innerHTML.replace("%", "");

                pricesAndChances.push({
                    dropPrice: parseFloat(dropPrice),
                    dropChance: parseFloat(dropChance)
                });
            });

            let avgLoss = 0.0;
            let totalLossChance = 0.0;
            pricesAndChances.forEach(item => {
                if (item.dropPrice < casePrice) {
                    let loss = casePrice - item.dropPrice;
                    avgLoss += loss * item.dropChance;
                    totalLossChance += item.dropChance;
                }
            });

            if (totalLossChance > 0) {
                avgLoss /= totalLossChance;
            }
            return avgLoss;
        }

        runCalculateAvgLoss() {
            const elementAlreadyExists = document.getElementById(this.avgLossElementId);
            if (elementAlreadyExists) {
                // do nothing.
                return;
            }
            const price = document.querySelector(this.priceTagQuery).innerText;

            const avgLossElement = document.createElement("span");
            avgLossElement.id = this.avgLossElementId;
            avgLossElement.style.textAlign = "center";
            avgLossElement.style.textTransform = "uppercase";
            avgLossElement.style.color = "#4f4b78";
            avgLossElement.innerText = `$${this.calculateAvgLoss(price).toFixed(2)} loss on average`;

            const caseTitleContainer = document.querySelector(this.caseTitleContainerQuery);
            caseTitleContainer.appendChild(document.createElement("br"));
            caseTitleContainer.appendChild(avgLossElement);
        }
    }

    new SkinClubProfitCalculator();
}
