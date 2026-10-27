// Hand-written fixtures shaped like the DHIS2 API responses (see
// ValidationResultView, OutlierValue and OrganisationUnit in dhis2-core).
// Names and ids follow the Sierra Leone demo database for readability.

export const SIERRA_LEONE = { id: 'ImspTQPwCqd', displayName: 'Sierra Leone' }
export const BO = { id: 'O6uvpzGd5pu', displayName: 'Bo' }
export const BADJIA = { id: 'YuQRtpLP10I', displayName: 'Badjia' }
export const KAILAHUN = { id: 'jUb8gELQApl', displayName: 'Kailahun' }
export const LUAWA = { id: 'cM2BKSrj9F9', displayName: 'Luawa' }

// Validation rule results (dataAnalysis/validationRules)
export const validationResults = {
    completeHierarchy: {
        organisationUnitId: 'DiszpKrYNg8',
        organisationUnitDisplayName: 'Ngelehun CHC',
        organisationUnitPath:
            '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I/DiszpKrYNg8',
        organisationUnitAncestorNames: 'Sierra Leone / Bo / Badjia / ',
    },
    root: {
        organisationUnitId: 'ImspTQPwCqd',
        organisationUnitDisplayName: 'Sierra Leone',
        organisationUnitPath: '/ImspTQPwCqd',
        organisationUnitAncestorNames: '',
    },
    incompletePath: {
        organisationUnitId: 'DiszpKrYNg8',
        organisationUnitDisplayName: 'Ngelehun CHC',
        organisationUnitPath:
            '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I/DiszpKrYNg8',
        // A missing parent: fewer names than the path depth implies
        organisationUnitAncestorNames: 'Sierra Leone / Bo / ',
    },
    nameContainsSeparator: {
        organisationUnitId: 'Rp268JB6Ne4',
        organisationUnitDisplayName: 'Adonkia CHP',
        organisationUnitPath:
            '/ImspTQPwCqd/at6UHUQatSo/qtr8GGlm4gg/Rp268JB6Ne4',
        organisationUnitAncestorNames:
            'Sierra Leone / Western Area / Rural / Urban / ',
    },
    noHierarchyFields: {
        organisationUnitId: 'DiszpKrYNg8',
        organisationUnitDisplayName: 'Ngelehun CHC',
    },
}

// Outlier values (outlierDetection): only `ou` and `ouName`, no path.
// Two findings share an org unit, the others are in different branches.
export const outlierValues = [
    { ou: 'DiszpKrYNg8', ouName: 'Ngelehun CHC', de: 'de1', pe: '202401' },
    { ou: 'DiszpKrYNg8', ouName: 'Ngelehun CHC', de: 'de2', pe: '202401' },
    {
        ou: 'Jiyc4ekaMMh',
        ouName: 'Kailahun Govt. Hosp.',
        de: 'de1',
        pe: '202401',
    },
    { ou: 'ImspTQPwCqd', ouName: 'Sierra Leone', de: 'de1', pe: '202401' },
    // Not returned by the metadata request (e.g. deleted or inaccessible)
    { ou: 'missingOrgU1', ouName: 'Removed facility', de: 'de1', pe: '202401' },
]

// organisationUnits?filter=id:in:[...]&fields=id,ancestors[id,displayName]
export const organisationUnitsById = {
    DiszpKrYNg8: { id: 'DiszpKrYNg8', ancestors: [SIERRA_LEONE, BO, BADJIA] },
    Jiyc4ekaMMh: {
        id: 'Jiyc4ekaMMh',
        ancestors: [SIERRA_LEONE, KAILAHUN, LUAWA],
    },
    ImspTQPwCqd: { id: 'ImspTQPwCqd', ancestors: [] },
}

const parseIdsFromFilter = (filter) =>
    filter.match(/^id:in:\[(.*)\]$/)[1].split(',')

// Resolver for CustomDataProvider / a fake data engine
export const resolveOrganisationUnits = ({ params }) => ({
    organisationUnits: parseIdsFromFilter(params.filter)
        .map((id) => organisationUnitsById[id])
        .filter(Boolean),
})
