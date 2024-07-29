if (typeof SkinClubCaseBattleCalculator === "undefined") {
    // CRAZY hack fix...

    class SkinClubCaseBattleCalculator {
        constructor() {
            this.init();
        }

        init() {
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

    }

    new SkinClubCaseBattleCalculator();
}
