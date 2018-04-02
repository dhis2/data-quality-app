/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { RaisedButton, IconButton } from 'material-ui';

import FollowUpAnalysis from './FollowUpAnalysis';
import FollowUpAnalysisTable from './follow-up-analysis-table/FollowUpAnalysisTable';

import {
  sections,
  FOLLOW_UP_ANALYSIS_SECTION_KEY,
} from '../sections.conf';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
  const section = sections[i];
  if (section.key === FOLLOW_UP_ANALYSIS_SECTION_KEY) {
    pageInfo = section.info;
    break;
  }
}

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const ownShallow = () => {
  return shallow(
      <FollowUpAnalysis
          sectionKey={FOLLOW_UP_ANALYSIS_SECTION_KEY}
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

it('Followup Analysis renders without crashing', () => {
  ownShallow();
});

it('Followup Analysis renders a FollowUpAnalysisTable', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(FollowUpAnalysisTable)).toHaveLength(1);
});

it('Followup Analysis renders a RaisedButton', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(RaisedButton)).toHaveLength(1);
});

it('Followup Analysis renders am IconButton', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(IconButton)).toHaveLength(1);
});

it('Followup Analysis calls back method when IconButton (back) is clicked', () => {
  const spy = spyOn(FollowUpAnalysis.prototype, 'back');
  const wrapper = ownShallow();
  wrapper.find(IconButton).simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('Followup Analysis calls start method when RaisedButton is clicked', () => {
  const spy = spyOn(FollowUpAnalysis.prototype, 'getFollowUpList');
  const wrapper = ownShallow();
  wrapper.find(RaisedButton).simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('Standard Dev Outlier Analysis update state when back button is clicked', () => {
  const wrapper = ownShallow();
  wrapper.setState({showTable: true});
  wrapper.find(IconButton).simulate('click');
  expect(wrapper.state('showTable')).toBe(false);
});