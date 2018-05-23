const Page = require('./page');

class MinMaxValueAnalysis extends Page {
    open() {
        super.open('#/min-max-outlier-analysis');
    }
}

module.exports = new MinMaxValueAnalysis();
