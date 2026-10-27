import {
    outlierValues,
    resolveOrganisationUnits,
    validationResults,
} from './__fixtures__/org-unit-hierarchy.js'
import {
    chunk,
    fetchOrganisationUnitAncestors,
    formatHierarchy,
    ORG_UNIT_IDS_PER_REQUEST,
    parseAncestorNames,
} from './org-unit-hierarchy.js'

const parse = (result) =>
    parseAncestorNames({
        ancestorNames: result.organisationUnitAncestorNames,
        path: result.organisationUnitPath,
    })

const createEngine = () => ({
    query: jest.fn(async ({ orgUnits }) => ({
        orgUnits: resolveOrganisationUnits(orgUnits),
    })),
})

describe('parseAncestorNames', () => {
    it('returns the ancestors, root first, for a complete hierarchy', () => {
        expect(parse(validationResults.completeHierarchy)).toEqual([
            'Sierra Leone',
            'Bo',
            'Badjia',
        ])
    })

    it('returns an empty list for a root org unit', () => {
        expect(parse(validationResults.root)).toEqual([])
    })

    it('returns null when a parent is missing from the names', () => {
        expect(parse(validationResults.incompletePath)).toBeNull()
    })

    it('does not split names that contain the separator', () => {
        expect(parse(validationResults.nameContainsSeparator)).toEqual([
            'Sierra Leone / Western Area / Rural / Urban',
        ])
    })

    it('returns null when the hierarchy fields are missing', () => {
        expect(parse(validationResults.noHierarchyFields)).toBeNull()
    })
})

describe('formatHierarchy', () => {
    it('joins the ancestors and the org unit name', () => {
        expect(formatHierarchy('Ngelehun CHC', ['Sierra Leone', 'Bo'])).toBe(
            'Sierra Leone / Bo / Ngelehun CHC'
        )
    })

    it.each([[[]], [null], [undefined]])(
        'returns only the name when ancestors are %p',
        (ancestors) => {
            expect(formatHierarchy('Sierra Leone', ancestors)).toBe(
                'Sierra Leone'
            )
        }
    )
})

describe('chunk', () => {
    it('splits a list into chunks of the given size', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
        expect(chunk([], 2)).toEqual([])
    })
})

describe('fetchOrganisationUnitAncestors', () => {
    it('requests each org unit once and maps ancestors by id', async () => {
        const engine = createEngine()

        const result = await fetchOrganisationUnitAncestors(
            engine,
            outlierValues.map(({ ou }) => ou)
        )

        expect(engine.query).toHaveBeenCalledTimes(1)
        expect(engine.query.mock.calls[0][0].orgUnits.params).toEqual({
            filter: 'id:in:[DiszpKrYNg8,Jiyc4ekaMMh,ImspTQPwCqd,missingOrgU1]',
            fields: 'id,ancestors[id,displayName]',
            paging: false,
        })
        expect(result).toEqual({
            DiszpKrYNg8: ['Sierra Leone', 'Bo', 'Badjia'],
            Jiyc4ekaMMh: ['Sierra Leone', 'Kailahun', 'Luawa'],
            ImspTQPwCqd: [],
        })
    })

    it('batches large sets of org units', async () => {
        const engine = createEngine()
        const ids = Array.from({ length: 250 }, (_, i) => `ou${i}`)

        await fetchOrganisationUnitAncestors(engine, ids)

        expect(engine.query).toHaveBeenCalledTimes(
            Math.ceil(250 / ORG_UNIT_IDS_PER_REQUEST)
        )
    })

    it('rejects when a request fails', async () => {
        const engine = { query: jest.fn().mockRejectedValue(new Error('403')) }

        await expect(
            fetchOrganisationUnitAncestors(engine, ['DiszpKrYNg8'])
        ).rejects.toThrow('403')
    })
})
