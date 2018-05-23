const Page = require('./page');

class ValidationRuleAnalysis extends Page {
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

    get validationRulesDetailsDialog() {
        return browser.element('.validation-rules-details-dialog');
    }

    get resultsRowAtDetailsDialog() {
        return browser.element('.validation-rules-details-dialog .results-row');
    }

    get leftSideRowAtDetailsDialog() {
        return browser.element('.validation-rules-details-dialog .left-side-row');
    }

    get rightSideRowAtDetailsDialog() {
        return browser.element('.validation-rules-details-dialog .right-side-row');
    }

    get closeButtonAtDetailsDialog() {
        return browser.element('.validation-rules-details-dialog button.close-action');
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

    openValidationRuleDetailsByIndex(index) {
        browser.elements('.validation-rules-show-details-action').value[index].click();
    }
}

module.exports = new ValidationRuleAnalysis();
