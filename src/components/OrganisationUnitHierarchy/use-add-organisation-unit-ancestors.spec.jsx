import { CustomDataProvider } from '@dhis2/app-runtime'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import {
    outlierValues,
    resolveOrganisationUnits,
} from '../../helpers/__fixtures__/org-unit-hierarchy.js'
import useAddOrganisationUnitAncestors from './use-add-organisation-unit-ancestors.js'

global.IS_REACT_ACT_ENVIRONMENT = true

const mockShowAlert = jest.fn()
jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useAlert: () => ({ show: mockShowAlert, hide: jest.fn() }),
}))

const setup = (organisationUnits) => {
    const container = document.createElement('div')
    const root = createRoot(container)
    const result = { current: undefined }
    const TestComponent = () => {
        result.current = useAddOrganisationUnitAncestors()
        return null
    }

    act(() => {
        root.render(
            <CustomDataProvider data={{ organisationUnits }}>
                <TestComponent />
            </CustomDataProvider>
        )
    })

    const addAncestors = async (elements) => {
        let added
        await act(async () => {
            added = await result.current.addAncestors(elements, ({ ou }) => ou)
        })
        return added
    }

    return { addAncestors, result, unmount: () => act(() => root.unmount()) }
}

describe('useAddOrganisationUnitAncestors', () => {
    beforeEach(() => {
        mockShowAlert.mockClear()
    })

    it('adds the ancestors to each element in one request', async () => {
        const resolver = jest.fn((type, query) =>
            resolveOrganisationUnits(query)
        )
        const { addAncestors, result, unmount } = setup(resolver)

        const elements = await addAncestors(outlierValues)

        expect(resolver).toHaveBeenCalledTimes(1)
        expect(elements.map((e) => e.organisationUnitAncestors)).toEqual([
            ['Sierra Leone', 'Bo', 'Badjia'],
            ['Sierra Leone', 'Bo', 'Badjia'],
            ['Sierra Leone', 'Kailahun', 'Luawa'],
            [],
            null,
        ])
        expect(result.current.loading).toBe(false)
        expect(mockShowAlert).not.toHaveBeenCalled()
        unmount()
    })

    it('shows a warning and returns the elements unchanged when the request fails', async () => {
        const resolver = jest.fn(() => Promise.reject(new Error('403')))
        const { addAncestors, unmount } = setup(resolver)

        const elements = await addAncestors(outlierValues.slice(0, 1))

        expect(elements).toEqual(outlierValues.slice(0, 1))
        expect(mockShowAlert).toHaveBeenCalledTimes(1)
        unmount()
    })

    it('does not make a request when there are no elements', async () => {
        const resolver = jest.fn()
        const { addAncestors, unmount } = setup(resolver)

        expect(await addAncestors([])).toEqual([])
        expect(resolver).not.toHaveBeenCalled()
        unmount()
    })
})
