import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import OrganisationUnitHierarchy from './OrganisationUnitHierarchy.jsx'

const render = (props) =>
    renderToStaticMarkup(<OrganisationUnitHierarchy {...props} />)

describe('OrganisationUnitHierarchy', () => {
    it('shows the name with its ancestors as secondary text', () => {
        const html = render({
            name: 'Ngelehun CHC',
            ancestors: ['Sierra Leone', 'Bo', 'Badjia'],
        })

        expect(html).toContain('Ngelehun CHC')
        expect(html).toContain('Sierra Leone / Bo / Badjia')
    })

    it('shows only the name for a root org unit', () => {
        const html = render({ name: 'Sierra Leone', ancestors: [] })

        expect(html).toContain('Sierra Leone')
        expect(html).not.toContain(' / ')
        expect(html).not.toContain('Hierarchy unavailable')
    })

    it('shows only the name while the hierarchy is loading', () => {
        const html = render({ name: 'Ngelehun CHC', ancestors: undefined })

        expect(html).toContain('Ngelehun CHC')
        expect(html).not.toContain('Hierarchy unavailable')
    })

    it('says when the hierarchy is unavailable', () => {
        const html = render({ name: 'Ngelehun CHC', ancestors: null })

        expect(html).toContain('Ngelehun CHC')
        expect(html).toContain('Hierarchy unavailable')
    })
})
