class StdDevValueAnalysis {
    open() {
        browser.url('#/std-dev-outlier-analysis');
    }

    get startButton() {
        return browser.element('button[id=start-analysis-button]');
    }

    get standardDevDropdown() {
        return browser.element('#standard-deviation button');
    }

    openStandardDevDropdown() {
        return this.standardDevDropdown.click();
    }

    getStandardDevOptionByText(standardDevText) {
        const menuOptions = browser.elements('body > div:nth-child(6) > div > div > div > div').value;
        for (let option of menuOptions) {
            const optionText = option.element('span > div > div > div').getText();
            if (optionText == standardDevText) {
                return option;
            }
        }
        return null;
    }
}

module.exports = new StdDevValueAnalysis();
