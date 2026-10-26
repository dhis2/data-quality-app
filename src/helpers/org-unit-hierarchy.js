// Same separator the API uses for OrganisationUnit#getAncestorNames
export const HIERARCHY_SEPARATOR = ' / '

// Keeps the `id:in:[...]` filter well below common URL length limits (~8KB)
export const ORG_UNIT_IDS_PER_REQUEST = 100

const getPathDepth = (path) => path.split('/').filter(Boolean).length

/**
 * Converts the `organisationUnitAncestorNames` and `organisationUnitPath`
 * returned by dataAnalysis/validationRules into a list of ancestor names,
 * root first. Returns:
 * - an empty array for a root org unit
 * - null when the hierarchy is missing or incomplete
 * - a single, unsplit segment when an org unit name contains the separator
 */
export const parseAncestorNames = ({ ancestorNames, path }) => {
    if (typeof ancestorNames !== 'string' || typeof path !== 'string') {
        return null
    }

    const expectedCount = getPathDepth(path) - 1
    const trimmed = ancestorNames.endsWith(HIERARCHY_SEPARATOR)
        ? ancestorNames.slice(0, -HIERARCHY_SEPARATOR.length)
        : ancestorNames

    if (expectedCount < 0) {
        return null
    }
    if (expectedCount === 0) {
        return trimmed === '' ? [] : null
    }
    if (trimmed === '') {
        return null
    }

    const names = trimmed.split(HIERARCHY_SEPARATOR)
    if (names.length < expectedCount) {
        return null
    }
    return names.length === expectedCount ? names : [trimmed]
}

export const chunk = (items, size) => {
    const chunks = []
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size))
    }
    return chunks
}

const createAncestorsQuery = (ids) => ({
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            filter: `id:in:[${ids.join(',')}]`,
            fields: 'id,ancestors[id,displayName]',
            paging: false,
        },
    },
})

/**
 * Fetches the ancestors of the given org units in batched requests.
 * Resolves to an object of org unit id -> ancestor display names (root
 * first). Org units missing from the response are left out.
 */
export const fetchOrganisationUnitAncestors = async (engine, orgUnitIds) => {
    const uniqueIds = [...new Set(orgUnitIds)]
    const responses = await Promise.all(
        chunk(uniqueIds, ORG_UNIT_IDS_PER_REQUEST).map((ids) =>
            engine.query(createAncestorsQuery(ids))
        )
    )

    return responses
        .flatMap(({ orgUnits }) => orgUnits.organisationUnits)
        .reduce((ancestorsById, { id, ancestors }) => {
            ancestorsById[id] = ancestors.map(({ displayName }) => displayName)
            return ancestorsById
        }, {})
}

export const formatHierarchy = (name, ancestors) =>
    ancestors?.length ? [...ancestors, name].join(HIERARCHY_SEPARATOR) : name
