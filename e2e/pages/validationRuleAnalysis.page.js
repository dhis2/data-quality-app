const Page = require('./page');

class ValidationRuleAnalysis extends Page {
  constructor() {
    super();
  }

  /**
   * ACTIONS
   */
  open() {
    super.open('#/validation-rules-analysis');
  }

  get validationRuleGroup() {
    return browser.element('#validation-rule-groups');
  }

  get sendNotificationsOption() {
    return browser.element('#send-notifications-option');
  }

  get persistResultsOption() {
    return browser.element('#persist-results-option');
  }

  openValidationRuleGroupDropdown() {
    this.validationRuleGroup.click();
  }

  getValidationRuleGroupOptionByIndex(index) {
    return browser.elements('body > div:nth-child(6) > div > div > div > div').value[index];
  }

  selectValidationGroupWithResults() {
    this.openValidationRuleGroupDropdown();
    browser.pause(1000);
    this.getValidationRuleGroupOptionByIndex(0).click();
    browser.pause(1000);
  }

  fillFormWithNoResults() {
    this.getOneOrgUnitTreeFromTreeByIndex(0).click();
  }
}

module.exports = new ValidationRuleAnalysis();