/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ValidationRuleGroupsSelect from './ValidationRuleGroupsSelect';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const ownShallow = () => {
  const onChange = jest.fn();
  return shallow(
      <ValidationRuleGroupsSelect onChange={onChange} />,
      {
        disableLifecycleMethods: true,
        context: {
          d2: {},
        }
      }
  );
};

it('ValidationRuleGroupsSelect renders without crashing', () => {
  ownShallow();
});

it('ValidationRuleGroupsSelect renders SelectField component', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(SelectField)).toHaveLength(1);
});

it('ValidationRuleGroupsSelect renders Select All option', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(MenuItem)).toHaveLength(1);
});

it('ValidationRuleGroupsSelect renders correct number of select options', () => {
  const wrapper = ownShallow();
  const fakeValidationRuleGroups = [
    { id: 'validation rule group 1', displayName: 'validation rule group 1' },
    { id: 'validation rule group 2', displayName: 'validation rule group 2' },
  ];
  wrapper.setState({validationRuleGroups: fakeValidationRuleGroups});
  expect(wrapper.find(MenuItem)).toHaveLength(fakeValidationRuleGroups.length);
});