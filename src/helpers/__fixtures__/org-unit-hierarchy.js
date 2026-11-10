// Shaped like the DHIS2 API responses, using Sierra Leone demo database names

const SIERRA_LEONE = { name: 'Sierra Leone' }
const BO = { name: 'Bo' }
const BADJIA = { name: 'Badjia' }
const KAILAHUN = { name: 'Kailahun' }
const LUAWA = { name: 'Luawa' }

export const outlierValues = [
    { ou: 'DiszpKrYNg8', ouName: 'Ngelehun CHC', de: 'de1' },
    { ou: 'DiszpKrYNg8', ouName: 'Ngelehun CHC', de: 'de2' },
    { ou: 'Jiyc4ekaMMh', ouName: 'Kailahun Govt. Hosp.', de: 'de1' },
    { ou: 'ImspTQPwCqd', ouName: 'Sierra Leone', de: 'de1' },
    { ou: 'missingOrgU1', ouName: 'Removed facility', de: 'de1' },
]

const organisationUnitsById = {
    DiszpKrYNg8: { id: 'DiszpKrYNg8', ancestors: [SIERRA_LEONE, BO, BADJIA] },
    Jiyc4ekaMMh: {
        id: 'Jiyc4ekaMMh',
        ancestors: [SIERRA_LEONE, KAILAHUN, LUAWA],
    },
    ImspTQPwCqd: { id: 'ImspTQPwCqd', ancestors: [] },
}

export const resolveOrganisationUnits = ({ params }) => ({
    organisationUnits: params.filter
        .match(/^id:in:\[(.*)\]$/)[1]
        .split(',')
        .map((id) => organisationUnitsById[id])
        .filter(Boolean),
})
