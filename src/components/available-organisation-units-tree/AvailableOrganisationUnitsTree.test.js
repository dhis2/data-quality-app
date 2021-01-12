/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component'
import AvailableOrganisationUnitsTree from './AvailableOrganisationUnitsTree'

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => 'OrgUnitTree')

const ownShallow = () => {
    const onChange = jest.fn()
    return shallow(<AvailableOrganisationUnitsTree onChange={onChange} />, {
        disableLifecycleMethods: true,
        context: {
            d2: {},
        },
    })
}

it('AvailableOrganisationUnitsTree renders without crashing', () => {
    ownShallow()
})

it('AvailableOrganisationUnitsTree does not render OrgUnitTree', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(OrgUnitTree)).toHaveLength(0)
})

it('AvailableOrganisationUnitsTree render no access message when no user-org units', () => {
    const wrapper = ownShallow()
    wrapper.setState({ rootsWithMembers: [] })
    expect(
        wrapper
            .children()
            .contains('You do not have access to any organisation units.')
    ).toBe(true)
})

it('AvailableOrganisationUnitsTree does render OrgUnitTree', () => {
    const wrapper = ownShallow()
    wrapper.setState({ rootsWithMembers: [{ id: 'someId' }] })
    expect(wrapper.find(OrgUnitTree)).toHaveLength(1)
})
