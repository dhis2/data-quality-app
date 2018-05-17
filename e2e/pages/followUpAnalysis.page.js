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

  getUnfollowCheckboxeByIndex( index ) {
    const checkboxes = browser.elements('span[class^=Page__checkboxWrapper').value;
    return checkboxes[index];
  }

  getDataSetOptionByIndex( index ) {
      return browser.element('div[role=presentation]').elements('span[role=menuitem]').value[index];
  }

  get totalElements() {
    browser.waitForVisible('#results-table');
    const rows = browser.element('#results-table').elements('<tr>').value;
    return parseInt(rows.length, 10);
  }

  get unfollowButton() {
    return browser.element('button[id=unfollow-action]');
  }

  get existingComments() {
    return browser.elements('button=speaker_notes').value;
  }

  get existsCommentHeader() {
    return browser.element('h3=Comment').value ? true : false;
  }

  get existsCommentInfo() {
    return browser.element('#comment-content').value ? true : false;
  }

  get dataSetText() {
    return browser.element('div[id*=DataSet]').getText();
  }

  get dataSetElement() {
    return browser.element('div[id*=DataSet]');
  }

  get dataSetSize() {
      return parseInt(browser.element('div[role=presentation]').elements('span[role=menuitem]').value.length, 10);
  }
}

module.exports = new FollowUpAnalysis();
