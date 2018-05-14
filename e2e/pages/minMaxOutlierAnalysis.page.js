const Page = require('./page');

class MinMaxValueAnalysis extends Page {
  constructor() {
    super();
  }

  /**
   * ACTIONS
   */
  open() {
    super.open('#/min-max-outlier-analysis');
  }
}

module.exports = new MinMaxValueAnalysis();