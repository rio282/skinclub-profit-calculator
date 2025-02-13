if (typeof SkinClubProfitCalculator === "undefined") {
    // CRAZY hack fix...

    class SkinClubProfitCalculator {

        #data;

        constructor() {
            this.profitMarginElementId = "__PM-EL-SCPC";
            this.avgProfitRatioElementId = "__APR-EL-SCPC";

            this.caseTitleContainerQuery = ".case-title-wrapper";
            this.priceTagQuery = "span.price";
            this.dropsQuery = ".skins-list.items-list .case-skin";
            this.dropsPricesQuery = ".table-cell.price-and-quality span.price span";
            this.dropsOddsQuery = ".pf-table-row:not(.head) .table-cell.odds";

            this.init();
        }

        init() {
            this.onElementAppear(this.priceTagQuery).then(() => {
                const casePrice = document.querySelector(this.priceTagQuery).innerText;
                this.#data = this.calculateCaseData(casePrice);

                this.displayProfitAverages();
                this.displayAverageProfitRatio();
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

        addToCaseTitleContainer(childElement) {
            const caseTitleContainer = document.querySelector(this.caseTitleContainerQuery);
            caseTitleContainer.style.textAlign = "center";
            caseTitleContainer.style.gap = "14px";
            caseTitleContainer.appendChild(childElement);
            caseTitleContainer.appendChild(document.createElement("br"));
        }

        displayProfitAverages() {
            const elementAlreadyExists = document.getElementById(this.profitMarginElementId);
            if (elementAlreadyExists) {
                // do nothing.
                return;
            }

            const profitMarginElement = document.createElement("span");
            profitMarginElement.id = this.profitMarginElementId;
            profitMarginElement.style.textAlign = "center";
            profitMarginElement.style.textTransform = "uppercase";
            profitMarginElement.style.color = "#4f4b78";
            profitMarginElement.innerHTML = `<b>${this.#data.profitChance.toFixed(1)}%</b> chance of making a profit`;

            this.addToCaseTitleContainer(profitMarginElement);
        }

        displayAverageProfitRatio() {
            const elementAlreadyExists = document.getElementById(this.avgProfitRatioElementId);
            if (elementAlreadyExists) {
                // do nothing.
                return;
            }
            const avgProfitElement = document.createElement("span");
            avgProfitElement.id = this.avgProfitRatioElementId;
            avgProfitElement.style.textAlign = "center";
            avgProfitElement.style.textTransform = "uppercase";
            avgProfitElement.style.color = "#4f4b78";
            avgProfitElement.innerHTML = `averages @ <b>$${this.#data.averageProfit.toFixed(2)} profit / $${this.#data.averageLoss.toFixed(2)} loss</b>`;

            this.addToCaseTitleContainer(avgProfitElement);
        }

        calculateCaseData(casePrice) {
            casePrice = parseFloat(casePrice.replace("$", ""));

            const drops = document.querySelectorAll(this.dropsQuery);
            const pricesAndChances = [];

            drops.forEach(drop => {
                const dropPriceElement = drop.querySelector(this.dropsPricesQuery);
                const dropPrice = dropPriceElement.innerHTML.replace("$", "");

                const dropOddsElement = drop.querySelector(this.dropsOddsQuery);
                const dropChance = dropOddsElement.innerHTML.replace("%", "");

                console.log(dropPrice, dropChance)
                pricesAndChances.push({
                    dropPrice: parseFloat(dropPrice),
                    dropChance: parseFloat(dropChance)
                });
            });

            let avgProfit = 0.0;
            let avgLoss = 0.0;
            let profitChance = 0.0;

            let totalLossChance = 0.0;
            let totalProfitChance = 0.0;
            pricesAndChances.forEach(item => {
                if (item.dropPrice < casePrice) {
                    let loss = casePrice - item.dropPrice;
                    avgLoss += loss * item.dropChance;
                    totalLossChance += item.dropChance;
                } else if (item.dropPrice > casePrice) {
                    let profit = item.dropPrice - casePrice;
                    avgProfit += profit * item.dropChance;
                    totalProfitChance += item.dropChance;

                    profitChance += item.dropChance;
                }
            });

            if (totalLossChance > 0) {
                avgLoss /= totalLossChance;
            }
            if (totalProfitChance > 0) {
                avgProfit /= totalProfitChance;
            }

            return {
                averageProfit: avgProfit,
                averageLoss: avgLoss,
                profitChance: profitChance
            };
        }
    }

    new SkinClubProfitCalculator();
}
