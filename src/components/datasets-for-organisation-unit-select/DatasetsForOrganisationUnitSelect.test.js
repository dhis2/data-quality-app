/* eslint-disable */
import React from 'react';
import {shallow} from 'enzyme';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DatasetsForOrganisationUnitSelect from './DatasetsForOrganisationUnitSelect';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const ownShallow = () => {
    const onChange = jest.fn();
    return shallow(
        <DatasetsForOrganisationUnitSelect onChange={onChange}/>,
        {
            disableLifecycleMethods: true,
            context: {
                d2: {},
            }
        }
    );
};

it('DatasetsForOrganisationUnitSelect renders without crashing', () => {
    ownShallow();
});

it('DatasetsForOrganisationUnitSelect renders SelectField component', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(SelectField)).toHaveLength(1);
});

it('DatasetsForOrganisationUnitSelect renders all data sets options', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(MenuItem)).toHaveLength(1);
});

it('DatasetsForOrganisationUnitSelect renders correct number of select options', () => {
    const wrapper = ownShallow();
    const fakeDatasets = [
        {id: 'dataset1', displayName: 'dataset1'},
        {id: 'dataset2', displayName: 'dataset2'},
    ];
    wrapper.setState({dataSets: fakeDatasets});
    expect(wrapper.find(MenuItem)).toHaveLength(fakeDatasets.length);
});