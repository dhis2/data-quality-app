/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Page from './Page';
import ValidationRulesAnalysis from './validation-rules-analysis/ValidationRulesAnalysis';
import Home from './home/Home';

import {VALIDATION_RULES_ANALYSIS_SECTION_KEY} from './sections.conf';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('./Page'); // Page is now a mock constructor
jest.mock('material-ui/RaisedButton');

const notPageComponentShallow = () => {
  return shallow(
      <Home t={jest.fn()} />
  );
};

const pageComponentShallow = () => {
  return shallow(
      <ValidationRulesAnalysis sectionKey={VALIDATION_RULES_ANALYSIS_SECTION_KEY} />,
      {
        context: {
          updateAppState: jest.fn(),
          d2: {
            Api: {
              getApi: jest.fn(),
            },
          },
        }
      }
  );
};

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  Page.mockClear();
});

it('Page constructor is called', () => {
  const page = new Page();
  expect(Page).toHaveBeenCalled();
});

it('Not Page component does not call page constructor', () => {
  notPageComponentShallow();
  expect(Page).toHaveBeenCalledTimes(0);
});

it('Page component calls page constructor', () => {
  pageComponentShallow();
  expect(Page).toHaveBeenCalledTimes(1);
});

it('componentWillMount was called after render', () => {
  const spy = spyOn(Page.prototype, 'componentWillMount');
  pageComponentShallow();
  expect(spy).toHaveBeenCalled();
});

it('componentWillUnmount was called after unmount', () => {
  const spy = spyOn(Page.prototype, 'componentWillUnmount');
  const wrapper = pageComponentShallow();
  wrapper.unmount();
  expect(spy).toHaveBeenCalled();
});

