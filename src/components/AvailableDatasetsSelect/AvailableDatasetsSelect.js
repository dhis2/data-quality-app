import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { MultiSelect, MultiSelectOption, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

const AvailableDatasetsSelect = ({ selected, onChange }) => {
    const [dataSets, setDataSets] = useState(null)
    const [error, setError] = useState(false)
    const { d2 } = useD2()

    const fetchDataSets = async () => {
        try {
            const dataSetsResponse = await d2.models.dataSet.list({
                paging: false,
                fields: 'id,displayName',
            })
            setDataSets(dataSetsResponse.toArray())
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        fetchDataSets()
    }, [])

    return (
        <>
            <MultiSelect
                error={error}
                loading={!dataSets}
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
