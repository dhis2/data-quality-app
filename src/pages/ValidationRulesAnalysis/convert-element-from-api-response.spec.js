import convertElementFromApiResponse from './convert-element-from-api-response.js'

describe('convertElementFromApiResponse', () => {
    it('adds the org unit ancestors', () => {
        const element = convertElementFromApiResponse({
            organisationUnitDisplayName: 'Ngelehun CHC',
            organisationUnitAncestorNames: 'Sierra Leone / Bo / Badjia / ',
        })

        expect(element.organisation).toBe('Ngelehun CHC')
        expect(element.organisationUnitAncestors).toEqual([
            'Sierra Leone',
            'Bo',
            'Badjia',
        ])
    })
})
