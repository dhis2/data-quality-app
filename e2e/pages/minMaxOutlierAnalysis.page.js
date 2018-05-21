class MinMaxValueAnalysis {
    open() {
        browser.url('/#/min-max-outlier-analysis');
    }

    get startButton() {
        return browser.element('button[id=start-analysis-button]');
    }
}

module.exports = new MinMaxValueAnalysis();
