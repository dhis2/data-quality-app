import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useRef, useState } from 'react'
import { fetchOrganisationUnitAncestors } from '../../helpers/org-unit-hierarchy.js'

/**
 * Returns an object of org unit id -> ancestors, where the value is:
 * - undefined while loading
 * - null when the hierarchy could not be loaded
 * - an array of ancestor display names (root first) otherwise
 *
 * Ids are only requested once per mounted component, so removing rows
 * (e.g. after unfollowing) does not trigger new requests.
 */
const useOrganisationUnitAncestors = (orgUnitIds) => {
    const engine = useDataEngine()
    const [ancestorsById, setAncestorsById] = useState({})
    const requestedIds = useRef(new Set())
    const missingKey = [...new Set(orgUnitIds)]
        .filter((id) => !requestedIds.current.has(id))
        .join(',')

    useEffect(() => {
        const ids = missingKey
            .split(',')
            .filter((id) => id && !requestedIds.current.has(id))
        if (ids.length === 0) {
            return
        }
        ids.forEach((id) => requestedIds.current.add(id))

        const markMissingAsUnavailable = (found) =>
            ids.reduce((acc, id) => {
                acc[id] = found[id] ?? null
                return acc
            }, {})

        fetchOrganisationUnitAncestors(engine, ids)
            .then(markMissingAsUnavailable)
            .catch(() => markMissingAsUnavailable({}))
            .then((results) =>
                setAncestorsById((prev) => ({ ...prev, ...results }))
            )
    }, [engine, missingKey])

    return ancestorsById
}

export default useOrganisationUnitAncestors
