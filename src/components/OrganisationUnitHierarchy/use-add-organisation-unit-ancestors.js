import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useState } from 'react'
import { fetchOrganisationUnitAncestors } from '../../helpers/org-unit-hierarchy.js'

// Can be removed once the outlier and follow-up endpoints return the
// hierarchy, as dataAnalysis/validationRules does
const useAddOrganisationUnitAncestors = () => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const warningAlert = useAlert(
        i18n.t('The organisation unit hierarchy could not be loaded'),
        { warning: true }
    )

    const addAncestors = async (elements, getOrgUnitId) => {
        if (elements.length === 0) {
            return elements
        }

        setLoading(true)
        try {
            const ancestorsById = await fetchOrganisationUnitAncestors(
                engine,
                elements.map(getOrgUnitId)
            )
            return elements.map((element) => ({
                ...element,
                organisationUnitAncestors: ancestorsById[getOrgUnitId(element)],
            }))
        } catch {
            warningAlert.show()
            return elements
        } finally {
            setLoading(false)
        }
    }

    return { addAncestors, loading }
}

export default useAddOrganisationUnitAncestors
