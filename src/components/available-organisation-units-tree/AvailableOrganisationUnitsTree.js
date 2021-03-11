import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree } from '@dhis2/ui'
import { CircularLoader, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './AvailableOrganisationUnitsTree.module.css'

const query = {
    roots: {
        resource: 'organisationUnits',
        params: {
            filter: 'level:eq:1',
            fields: 'id',
            paging: 'false',
        },
    },
}

const AvailableOrganisationUnitsTree = ({ multiselect = false, onChange }) => {
    const { loading, data, error } = useDataQuery(query)
    const [selected, setSelected] = useState(new Map())

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

    if (data.roots.organisationUnits.length === 0) {
        return (
            <p>{i18n.t('You do not have access to any organisation units.')}</p>
        )
    }

    const handleOrgUnitClickSingle = ({ id, path }) => {
        if (selected.has(path)) {
            return
        }
        setSelected(new Map(selected).set(path, id))
        if (onChange) {
            onChange(id)
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
                roots={data.roots.organisationUnits.map(ou => ou.id)}
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
