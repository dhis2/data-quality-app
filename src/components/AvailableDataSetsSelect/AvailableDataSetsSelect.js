import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { MultiSelect, MultiSelectOption, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const query = {
    dataSets: {
        resource: 'dataSets',
        params: {
            fields: 'id,displayName',
            paging: false,
        },
    },
}

const AvailableDatasetsSelect = ({ selected, onChange }) => {
    const { loading, error, data } = useDataQuery(query)
    const dataSets = data?.dataSets.dataSets

    return (
        <>
            <MultiSelect
                error={error}
                loading={loading}
                filterable
                noMatchText={i18n.t('No match found')}
                onChange={onChange}
                selected={selected}
            >
                {dataSets?.map(item => (
                    <MultiSelectOption
                        key={item.id}
                        value={item.id}
                        label={item.displayName}
                    />
                ))}
            </MultiSelect>
            {error && <Help error>{i18n.t('Error loading datasets.')}</Help>}
        </>
    )
}

AvailableDatasetsSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.array,
}

export default AvailableDatasetsSelect
