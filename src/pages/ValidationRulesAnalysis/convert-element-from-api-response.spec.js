import { validationResults } from '../../helpers/__fixtures__/org-unit-hierarchy.js'
import convertElementFromApiResponse from './convert-element-from-api-response.js'

describe('convertElementFromApiResponse', () => {
    it('keeps the org unit name and adds its ancestors', () => {
        const element = convertElementFromApiResponse(
            validationResults.completeHierarchy
        )

        expect(element.organisation).toBe('Ngelehun CHC')
        expect(element.organisationUnitId).toBe('DiszpKrYNg8')
        expect(element.organisationUnitAncestors).toEqual([
            'Sierra Leone',
            'Bo',
            'Badjia',
        ])
    })

    it('marks the hierarchy as unavailable when it is incomplete', () => {
        const element = convertElementFromApiResponse(
            validationResults.incompletePath
        )

        expect(element.organisation).toBe('Ngelehun CHC')
        expect(element.organisationUnitAncestors).toBeNull()
    })
})
