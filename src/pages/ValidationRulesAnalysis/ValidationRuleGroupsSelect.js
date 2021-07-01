import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export const ALL_VALIDATION_RULE_GROUPS_ID = '-1'
const ALL_VALIDATION_RULE_GROUPS_OPTION = {
    id: ALL_VALIDATION_RULE_GROUPS_ID,
    displayName: i18n.t('[All Validation Rules]'),
}

const query = {
    validationRuleGroups: {
        resource: 'validationRuleGroups',
        params: {
            fields: 'id,displayName',
            paging: false,
        },
    },
}

const ValidationRuleGroupsSelect = ({ onChange }) => {
    const [validationRuleGroups, setValidationRuleGroups] = useState([
        ALL_VALIDATION_RULE_GROUPS_OPTION,
    ])
    const [selected, setSelected] = useState(ALL_VALIDATION_RULE_GROUPS_ID)
    const { loading, error } = useDataQuery(query, {
        onComplete: data => {
            setValidationRuleGroups([
                ALL_VALIDATION_RULE_GROUPS_OPTION,
                ...data.validationRuleGroups.validationRuleGroups,
            ])
        },
    })

    const handleChange = ({ selected }) => {
        setSelected(selected)
        onChange(selected)
    }

    return (
        <>
            <SingleSelectField
                label={i18n.t('Validation Rule Group')}
                selected={selected}
                loading={loading}
                error={error}
                filterable
                onChange={handleChange}
            >
                {validationRuleGroups.map(item => (
                    <SingleSelectOption
                        key={item.id}
                        label={item.displayName}
                        value={item.id}
                    />
                ))}
            </SingleSelectField>
            {error && (
                <Help error>
                    {i18n.t(
                        'Error loading validation rule groups: {{- error}}',
                        {
                            nsSeparator: null,
                            error,
                        }
                    )}
                </Help>
            )}
        </>
    )
}

ValidationRuleGroupsSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
}

export default ValidationRuleGroupsSelect
