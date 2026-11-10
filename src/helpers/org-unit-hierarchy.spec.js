import {
    outlierValues,
    resolveOrganisationUnits,
} from './__fixtures__/org-unit-hierarchy.js'
import {
    fetchOrganisationUnitAncestors,
    formatHierarchy,
    ORG_UNIT_IDS_PER_REQUEST,
    parseAncestorNames,
} from './org-unit-hierarchy.js'

const createEngine = () => ({
    query: jest.fn(async ({ orgUnits }) => ({
        orgUnits: resolveOrganisationUnits(orgUnits),
    })),
})

describe('parseAncestorNames', () => {
    it('returns the ancestors, root first', () => {
        expect(parseAncestorNames('Sierra Leone / Bo / Badjia / ')).toEqual([
            'Sierra Leone',
            'Bo',
            'Badjia',
        ])
    })

    it('returns an empty list for a root org unit', () => {
        expect(parseAncestorNames('')).toEqual([])
    })

    it('returns null when the ancestor names are missing', () => {
        expect(parseAncestorNames(undefined)).toBeNull()
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
            fields: 'id,ancestors[name]',
            paging: false,
        })
        expect(result).toEqual({
            DiszpKrYNg8: ['Sierra Leone', 'Bo', 'Badjia'],
            Jiyc4ekaMMh: ['Sierra Leone', 'Kailahun', 'Luawa'],
            ImspTQPwCqd: [],
            missingOrgU1: null,
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
})
