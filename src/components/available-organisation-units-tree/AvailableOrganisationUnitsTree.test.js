/* eslint-disable */
import React from 'react';
import {shallow} from 'enzyme';

/* d2-ui components */
import {OrgUnitTree} from '@dhis2/d2-ui-org-unit-tree';

/* App components */
import AvailableOrganisationUnitsTree from './AvailableOrganisationUnitsTree';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const ownShallow = () => {
    const onChange = jest.fn();
    return shallow(
        <AvailableOrganisationUnitsTree onChange={onChange}/>,
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
