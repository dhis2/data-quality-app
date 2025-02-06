import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree, CircularLoader, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import styles from './AvailableOrganisationUnitsTree.module.css'

const allRootQuery = {
    allRoots: {
        resource: 'organisationUnits',
        params: {
            filter: 'level:eq:1',
            fields: 'id',
            paging: 'false',
        },
    },
}

const query = {
    data: {
        resource: 'me',
        params: {
            fields: 'organisationUnits, authorities',
        },
    },
}

const useUserOrganisationUnits = () => {
    const { loading, data, error } = useDataQuery(query)
    const {
        loading: loadingAll,
        data: dataAll,
        error: errorAll,
        refetch,
    } = useDataQuery(allRootQuery, { lazy: true })

    useEffect(() => {
        if (
            !data?.data.organisationUnits.length &&
            data?.data?.authorities.includes('ALL')
        ) {
            //fetch all orgs
            refetch()
        }
    }, [data])

    return {
        loading: loadingAll || loading,
        organisationUnits:
            dataAll?.allRoots.organisationUnits || data?.data.organisationUnits,
        error: errorAll || error,
    }
}

const AvailableOrganisationUnitsTree = ({ multiselect = false, onChange }) => {
    const [selected, setSelected] = useState(new Map())
    const { loading, organisationUnits, error } = useUserOrganisationUnits()

    if (loading) {
        return <CircularLoader />
    }

    if (error) {
        return (
            <Help error>
                {i18n.t(
                    'Something went wrong whilst loading your organisation units.'
                )}
            </Help>
        )
    }

    if (organisationUnits.length === 0) {
        return (
            <p>{i18n.t('You do not have access to any organisation units.')}</p>
        )
    }

    const handleOrgUnitClickSingle = ({ id, path }) => {
        let selectedId = id
        if (selected.has(path)) {
            //deselect
            selectedId = null
            setSelected(new Map())
        } else {
            setSelected(new Map().set(path, id))
        }
        if (onChange) {
            onChange(selectedId)
        }
    }

    const handleOrgUnitClickMulti = ({ id, path, selected: s }) => {
        const newSelected = new Map(selected)
        if (s.includes(path)) {
            newSelected.set(path, id)
        } else {
            newSelected.delete(path)
        }
        setSelected(newSelected)
        if (onChange) {
            onChange([...newSelected.values()])
        }
    }

    const handleChange = multiselect
        ? handleOrgUnitClickMulti
        : handleOrgUnitClickSingle

    return (
        <div className={styles.wrapper}>
            <OrganisationUnitTree
                selected={[...selected.keys()]}
                roots={organisationUnits.map((ou) => ou.id)}
                singleSelection={!multiselect}
                onChange={handleChange}
            />
        </div>
    )
}

AvailableOrganisationUnitsTree.propTypes = {
    multiselect: PropTypes.bool,
    onChange: PropTypes.func,
}

export default AvailableOrganisationUnitsTree
