const caseTitleContainerQuery = ".case-title-wrapper";
const caseTitleQuery = ".case-title-wrapper";

const priceTagQuery = "span.price";

const dropsQuery = ".skins-list.items-list .case-skin";
const dropsPricesQuery = ".table-cell.price-and-quality span.price";
const dropsOddsQuery = ".pf-table-row-link .table-cell.odds";

function onElementAppear(query) {
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

function calculateProfitChance(casePrice) {
    casePrice = parseFloat(casePrice.replace("$", ""));

    const drops = document.querySelectorAll(dropsQuery);
    const pricesAndChances = [];

    drops.forEach(drop => {
        const dropPriceElement = drop.querySelector(dropsPricesQuery);
        const dropPrice = dropPriceElement.innerHTML.replace("$", "");

        const dropOddsElement = drop.querySelector(dropsOddsQuery);
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

function runCalculateProfitChance() {
    const price = document.querySelector(priceTagQuery).innerText;

    const profitMarginElement = document.createElement("span");
    profitMarginElement.style.textAlign = "center";
    profitMarginElement.style.textTransform = "uppercase";
    profitMarginElement.style.color = " #4f4b78";
    profitMarginElement.innerText = `${calculateProfitChance(price).toFixed(1)}% chance of making a profit`;

    const caseTitleContainer = document.querySelector(caseTitleContainerQuery);
    caseTitleContainer.style.textAlign = "center";
    caseTitleContainer.style.gap = "14px";
    caseTitleContainer.appendChild(profitMarginElement);
}

onElementAppear(priceTagQuery).then(() => runCalculateProfitChance());

