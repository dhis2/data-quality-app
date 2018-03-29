/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import AvaiableOrganisationUnitsTree from './AvailableOrganisationUnitsTree';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const ownShallow = () => {
  const onChange = jest.fn();
  return shallow(
      <AvaiableOrganisationUnitsTree onChange={onChange} />,
      {
        disableLifecycleMethods: true,
        context: {
          d2: {},
          translator: (key) => key,
        }
      }
  );
};

it('AvaiableOrganisationUnitsTree renders without crashing', () => {
  ownShallow();
});

it('AvaiableOrganisationUnitsTree does not render OrgUnitTree', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(OrgUnitTree)).toHaveLength(0);
});

it('AvaiableOrganisationUnitsTree does render OrgUnitTree', () => {
  const wrapper = ownShallow();
  wrapper.setState({rootWithMembers: {}});
  expect(wrapper.find(OrgUnitTree)).toHaveLength(1);
});
