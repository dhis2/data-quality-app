module.exports = class Page {
    open(path = '') {
        browser.url(`/${path}`);
    }

    get dataSetSelect() {
        return browser.element('#data-sets-container select');
    }

    get dataSetDropdown() {
        return browser.element('#data-sets-container');
    }

    get organisationUnitTreeView() {
        return browser.element('.tree-view');
    }

    get startDateInput() {
        return browser.element('input[id=start-date]');
    }

    get startDate() {
        return new Date(this.startDateInput.getValue());
    }

    get endDateInput() {
        return browser.element('input[id=end-date]');
    }

    get endDate() {
        return new Date(this.endDateInput.getValue());
    }

    get startButton() {
        return browser.element('button[id=start-analysis-button]');
    }

    get resultsTable() {
        return browser.element('#results-table');
    }

    get resultsTableRows() {
        return browser.elements('#results-table > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr').value;
    }

    get snackBarMessageElement() {
        return browser.element('#feedback-snackbar > div > div > div > span > div > div');
    }

    get downloadAsPdfButton() {
        return browser.element('a.export-pdf-action');
    }

    get downloadAsXlsButton() {
        return browser.element('a.export-xls-action');
    }

    get downloadAsCsvButton() {
        return browser.element('a.export-csv-action');
    }

    openDataSetDropdown() {
        this.dataSetDropdown.click();
    }

    isOrganisationUnitSelected() {
        const checkboxes = this.organisationUnitTreeView.elements('.tree-view input[type=checkbox]').value;
        for (let currentCheckbox of checkboxes) {
            if (currentCheckbox.isSelected()) {
                return true;
            }
        }
        return false;
    }

    /* Start Date auxiliar methods */
    openStartDate() {
        this.startDateInput.click();
    }

    confirmStartDatePicker() {
        browser.element('body > div:nth-child(4) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();
    }

    closeStartDatePicker() {
        browser.element('body > div:nth-child(4) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)').click();
    }

    openStartDateYearsPicker() {
        browser.element('body > div:nth-child(4) > div > div:nth-child(1) > div > div > div > div > div:nth-child(1) > div:nth-child(1) > div > div').click();
    }

    getStartDateYearButton(year) {
        const yearButtons = browser.elements('body > div:nth-child(4) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > button').value;
        for (let currentYear of yearButtons) {
            const yearText = currentYear.element('<span>').getText();
            if (yearText == year) {
                return currentYear;
            }
        }
        return null;
    }

    getStartDateDayButton(day) {
        const dayButtons = browser.elements('body > div:nth-child(4) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div > div > div > button').value;
        for (let currenDay of dayButtons) {
            const dayText = currenDay.element('<span>').getText();
            if (dayText == day) {
                return currenDay;
            }
        }
        return null;
    }

    moveStartDateMonthTo(to) {
        // current end date month
        const currentDate = this.endDateInput.getValue();
        const from = parseInt(currentDate.split('-')[1]);

        const monthsToMove = to - from;
        if (monthsToMove < 0) {
            const previousButton = browser.element('body > div:nth-child(4) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)');
            for (let i = monthsToMove; i > 0; i--) {
                previousButton.click();
            }
        } else if (monthsToMove > 0) {
            const nextButton = browser.element('body > div:nth-child(4) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(3)');
            for (let i = 0; i < monthsToMove; i++) {
                nextButton.click();
            }
        }
    }

    getStartDatePickerDayButtonOfDate(date) {
        this.openStartDateYearsPicker();
        browser.pause(1000);
        this.getStartDateYearButton(date.getFullYear()).click();
        browser.pause(1000);
        this.moveStartDateMonthTo(date.getMonth() /* it return index value */ + 1);
        browser.pause(1000);

        return this.getStartDateDayButton(date.getDate());
    }

    selectDateForStartDatePicker(date) {
        this.openStartDateYearsPicker();
        browser.pause(1000);
        this.getStartDateYearButton(date.getFullYear()).click();
        browser.pause(1000);
        this.moveStartDateMonthTo(date.getMonth() /* it return index value */ + 1);
        browser.pause(1000);
        this.getStartDateDayButton(date.getDate()).click();
        browser.pause(1000);
        this.confirmStartDatePicker();
        browser.pause(1000);
    }

    /* End Date auxiliar methods */
    openEndDate() {
        this.endDateInput.click();
    }

    confirmEndDatePicker() {
        browser.element('body > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > button:nth-child(2)').click();
    }

    closeEndDatePicker() {
        browser.element('body > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)').click();
    }

    openEndDateYearsPicker() {
        browser.element('body > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div > div:nth-child(1) > div:nth-child(1) > div > div').click();
    }

    getEndDateYearButton(year) {
        const yearButtons = browser.elements('body > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > button').value;
        for (let currentYear of yearButtons) {
            const yearText = currentYear.element('<span>').getText();
            if (yearText == year) {
                return currentYear;
            }
        }
        return null;
    }

    getEndDateDayButton(day) {
        const dayButtons = browser.elements('body > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div > div > div > button').value;
        for (let currenDay of dayButtons) {
            const dayText = currenDay.element('<span>').getText();
            if (dayText == day) {
                return currenDay;
            }
        }
        return null;
    }

    moveEndDateMonthTo(to) {
        // current start date month
        const currentDate = this.endDateInput.getValue();
        const from = parseInt(currentDate.split('-')[1]);

        const monthsToMove = to - from;
        if (monthsToMove < 0) {
            const previousButton = browser.element('body > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)');
            for (let i = monthsToMove; i > 0; i--) {
                previousButton.click();
            }
        } else if (monthsToMove > 0) {
            const nextButton = browser.element('body > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(3)');
            for (let i = 0; i < monthsToMove; i++) {
                nextButton.click();
            }
        }
    }

    getEndDatePickerDayButtonOfDate(date) {
        this.openEndDateYearsPicker();
        browser.pause(1000);
        this.getEndDateYearButton(date.getFullYear()).click();
        browser.pause(1000);
        this.moveEndDateMonthTo(date.getMonth() /* it return index value */ + 1);
        browser.pause(1000);

        return this.getEndDateDayButton(date.getDate());
    }

    selectDateForEndDatePicker(date) {
        this.openEndDateYearsPicker();
        browser.pause(1000);
        this.getEndDateYearButton(date.getFullYear()).click();
        browser.pause(1000);
        this.moveEndDateMonthTo(date.getMonth() /* it return index value */ + 1);
        browser.pause(1000);
        this.getEndDateDayButton(date.getDate()).click();
        browser.pause(1000);
        this.confirmEndDatePicker();
        browser.pause(1000);
    }

    getDataSetOptionByIndex(index) {
        return this.dataSetSelect.elements('<option>').value[index];
    }

    getOneOrgUnitTreeFromTreeByIndex(index) {
        return this.organisationUnitTreeView.elements('div[role=button]').value[index].element('<input>');
    }

    getResultsTableHeaderByText(text) {
        const columnHeaders = browser.elements('th').value;
        for (let currentColumnHeader of columnHeaders) {
            if (currentColumnHeader.getText().toLowerCase() === text.toLowerCase()) {
                return currentColumnHeader;
            }
        }
        return null;
    }

    selectDataSetWithResults() {
        this.getDataSetOptionByIndex(1).click();
    }

    fillFormWithNoResults() {
        this.getOneOrgUnitTreeFromTreeByIndex(0).click();
        this.getDataSetOptionByIndex(0).click();
        // rest of the form at default values
    }
};
