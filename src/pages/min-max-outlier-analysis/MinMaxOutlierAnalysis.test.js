/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { RaisedButton, IconButton } from 'material-ui';

import MinMaxOutlierAnalysis from './MinMaxOutlierAnalysis';
import OutlierAnalyisTable from '../../components/outlier-analysis-table/OutlierAnalysisTable';

import {
  sections,
  MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY,
} from '../sections.conf';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
  const section = sections[i];
  if (section.key === MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY) {
    pageInfo = section.info;
    break;
  }
}

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));

const ownShallow = () => {
  return shallow(
      <MinMaxOutlierAnalysis
          sectionKey={MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY}
          pageInfo={pageInfo}
      />,
      {
        context: {
          updateAppState: jest.fn(),
          translator: (key) => key,
        },
        disableLifecycleMethods: true
      }
  );
};

it('Min Max Outlier Analysis renders without crashing', () => {
  ownShallow();
});

it('Min Max Outlier Analysis renders a OutlierAnalyisTable', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(OutlierAnalyisTable)).toHaveLength(1);
});

it('Min Max Outlier Analysis renders a RaisedButton', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(RaisedButton)).toHaveLength(1);
});

it('Min Max Outlier Analysis renders am IconButton', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(IconButton)).toHaveLength(1);
});

it('Min Max Outlier Analysis calls back method when IconButton (back) is clicked', () => {
  const spy = spyOn(MinMaxOutlierAnalysis.prototype, 'back');
  const wrapper = ownShallow();
  wrapper.find(IconButton).simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('Min Max Outlier Analysis calls start method when RaisedButton is clicked', () => {
  const spy = spyOn(MinMaxOutlierAnalysis.prototype, 'start');
  const wrapper = ownShallow();
  wrapper.find(RaisedButton).simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('Min Max Outlier Analysis update state when back button is clicked', () => {
  const wrapper = ownShallow();
  wrapper.setState({showTable: true});
  wrapper.find(IconButton).simulate('click');
  expect(wrapper.state('showTable')).toBe(false);
});
