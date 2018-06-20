/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import AvailableOrganisationUnitsTree from './AvailableOrganisationUnitsTree';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const ownShallow = () => {
  const onChange = jest.fn();
  return shallow(
      <AvailableOrganisationUnitsTree onChange={onChange} />,
      {
        disableLifecycleMethods: true,
        context: {
          d2: {},
        }
      }
  );
};

it('AvailableOrganisationUnitsTree renders without crashing', () => {
  ownShallow();
});

it('AvailableOrganisationUnitsTree does not render OrgUnitTree', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(OrgUnitTree)).toHaveLength(0);
});

it('AvailableOrganisationUnitsTree does render OrgUnitTree', () => {
  const wrapper = ownShallow();
  wrapper.setState({rootWithMembers: {}});
  expect(wrapper.find(OrgUnitTree)).toHaveLength(1);
});
