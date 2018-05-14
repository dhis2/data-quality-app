const Page = require('./page');

class StdDevValueAnalysis extends Page {
  constructor() {
    super();
  }

  /**
   * ACTIONS
   */
  open() {
    super.open('#/std-dev-outlier-analysis');
  }
}

module.exports = new StdDevValueAnalysis();