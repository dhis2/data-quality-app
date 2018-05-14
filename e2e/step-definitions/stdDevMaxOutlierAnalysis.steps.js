const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const stdDevOutlierAnalysis = require('../pages/stdDevOutlierAnalysis.page');

defineSupportCode(( {Given, When, Then} ) => {
  // *********************************************************
  // Background:
  // *********************************************************
  When(/^I open Std Dev Outlier Analysis page$/, () => {
    this.page = stdDevOutlierAnalysis;
    this.page.open();
    browser.pause(1000);
  });
});