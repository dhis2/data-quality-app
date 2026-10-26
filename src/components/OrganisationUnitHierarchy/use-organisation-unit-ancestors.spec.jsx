import { CustomDataProvider } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import {
    outlierValues,
    resolveOrganisationUnits,
} from '../../helpers/__fixtures__/org-unit-hierarchy.js'
import useOrganisationUnitAncestors from './use-organisation-unit-ancestors.js'

global.IS_REACT_ACT_ENVIRONMENT = true

const setup = (organisationUnits) => {
    const container = document.createElement('div')
    const root = createRoot(container)
    const result = { current: undefined }
    const TestComponent = ({ ids }) => {
        result.current = useOrganisationUnitAncestors(ids)
        return null
    }
    TestComponent.propTypes = { ids: PropTypes.array }

    const render = (ids) =>
        act(async () => {
            root.render(
                <CustomDataProvider data={{ organisationUnits }}>
                    <TestComponent ids={ids} />
                </CustomDataProvider>
            )
        })

    return { render, result, unmount: () => act(() => root.unmount()) }
}

describe('useOrganisationUnitAncestors', () => {
    const ids = outlierValues.map(({ ou }) => ou)

    it('resolves ancestors and marks missing org units as unavailable', async () => {
        const resolver = jest.fn((type, query) =>
            resolveOrganisationUnits(query)
        )
        const { render, result, unmount } = setup(resolver)

        await render(ids)

        expect(resolver).toHaveBeenCalledTimes(1)
        expect(result.current).toEqual({
            DiszpKrYNg8: ['Sierra Leone', 'Bo', 'Badjia'],
            Jiyc4ekaMMh: ['Sierra Leone', 'Kailahun', 'Luawa'],
            ImspTQPwCqd: [],
            missingOrgU1: null,
        })
        unmount()
    })

    it('does not request again when rows are removed', async () => {
        const resolver = jest.fn((type, query) =>
            resolveOrganisationUnits(query)
        )
        const { render, unmount } = setup(resolver)

        await render(ids)
        await render(ids.slice(0, 2))

        expect(resolver).toHaveBeenCalledTimes(1)
        unmount()
    })

    it('marks all org units as unavailable when the request fails', async () => {
        const resolver = jest.fn(() => Promise.reject(new Error('403')))
        const { render, result, unmount } = setup(resolver)

        await render(['DiszpKrYNg8', 'ImspTQPwCqd'])

        expect(result.current).toEqual({
            DiszpKrYNg8: null,
            ImspTQPwCqd: null,
        })
        unmount()
    })
})
