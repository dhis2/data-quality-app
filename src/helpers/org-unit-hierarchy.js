export const HIERARCHY_SEPARATOR = ' / '

// Keeps the `id:in:[...]` filter well below common URL length limits
export const ORG_UNIT_IDS_PER_REQUEST = 100

// `organisationUnitAncestorNames` from dataAnalysis/validationRules, e.g.
// "Sierra Leone / Bo / Badjia / "
export const parseAncestorNames = (ancestorNames) =>
    typeof ancestorNames === 'string'
        ? ancestorNames.split(HIERARCHY_SEPARATOR).filter(Boolean)
        : null

const chunk = (items, size) => {
    const chunks = []
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size))
    }
    return chunks
}

// Uses `name` to match the org unit names returned by the analysis endpoints
const createAncestorsQuery = (ids) => ({
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            filter: `id:in:[${ids.join(',')}]`,
            fields: 'id,ancestors[name]',
            paging: false,
        },
    },
})

// Resolves to org unit id -> ancestor names (root first), or null when the
// org unit was not returned (e.g. deleted or not accessible)
export const fetchOrganisationUnitAncestors = async (engine, orgUnitIds) => {
    const ids = [...new Set(orgUnitIds)]
    const responses = await Promise.all(
        chunk(ids, ORG_UNIT_IDS_PER_REQUEST).map((idsChunk) =>
            engine.query(createAncestorsQuery(idsChunk))
        )
    )
    const found = Object.fromEntries(
        responses
            .flatMap(({ orgUnits }) => orgUnits.organisationUnits)
            .map(({ id, ancestors }) => [id, ancestors.map(({ name }) => name)])
    )

    return Object.fromEntries(ids.map((id) => [id, found[id] ?? null]))
}

export const formatHierarchy = (name, ancestors) =>
    ancestors?.length ? [...ancestors, name].join(HIERARCHY_SEPARATOR) : name
