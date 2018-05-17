const Page = require('./page');

class FollowUpAnalysis extends Page {
  constructor() {
    super();
  }

  /**
   * ACTIONS
   */
  open() {
    super.open('#/follow-up-analysis');
  }

  getDataSetOptionByIndex( index ) {
    return browser.elements('body > div:nth-child(7) > div > div > div > div').value[index];
  }

  selectDataSetWithResults() {
    this.openDataSetDropdown();
    browser.pause(1000);
    this.getDataSetOptionByIndex(0).click();
    browser.pause(1000);
  }

  fillFormWithNoResults() {
    this.getOneOrgUnitTreeFromTreeByIndex(0).click();
    browser.pause(5000);                                              // time for data sets to refresh
    this.openDataSetDropdown();
    browser.pause(1000);
    this.getDataSetOptionByIndex(1).click();
    browser.pause(1000);
  }

  get unfollowButton() {
    return browser.element('button[id=unfollow-action]');
  }
}

module.exports = new FollowUpAnalysis();