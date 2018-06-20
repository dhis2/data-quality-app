/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import AvailableDatasetsSelect from './AvailableDatasetsSelect';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const ownShallow = () => {
  const onChange = jest.fn();
  return shallow(
      <AvailableDatasetsSelect onChange={onChange} />,
      {
        disableLifecycleMethods: true,
        context: {
          d2: {},
        }
      }
  );
};

it('AvailableDatasetsSelect renders without crashing', () => {
  ownShallow();
});

it('AvailableDatasetsSelect renders one html select', () => {
  const wrapper = ownShallow();
  expect(wrapper.find('select')).toHaveLength(1);
});

it('AvailableDatasetsSelect renders no select options', () => {
  const wrapper = ownShallow();
  expect(wrapper.find('option')).toHaveLength(0);
});

it('AvailableDatasetsSelect renders correct number of select options', () => {
  const wrapper = ownShallow();
  const fakeDataSets = [
    { id: 'dataset1', displayName: 'dataset1' },
    { id: 'dataset2', displayName: 'dataset2' },
  ];
  wrapper.setState({dataSets: fakeDataSets});
  expect(wrapper.find('option')).toHaveLength(fakeDataSets.length);
});