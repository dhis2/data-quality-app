import { useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

export const ALL_VALIDATION_RULE_GROUPS_ID = -1
export const ALL_VALIDATION_RULE_GROUPS_OPTION = {
    id: ALL_VALIDATION_RULE_GROUPS_ID,
    displayName: i18n.t('[All Validation Rules]'),
}

const ValidationRuleGroupsSelect = ({ onChange, style }) => {
    const [validationRuleGroups, setValidationRuleGroups] = useState([
        ALL_VALIDATION_RULE_GROUPS_OPTION,
    ])
    const [selected, setSelected] = useState(ALL_VALIDATION_RULE_GROUPS_ID)
    const validationRuleGroupsLoadErrorAlert = useAlert(
        ({ error }) =>
            i18n.t('Error loading validation rule groups: {{error}}', {
                nsSeparator: null,
                error,
            }),
        {
            critical: true,
        }
    )
    const { d2 } = useD2()

    useEffect(() => {
        d2.models.validationRuleGroup
            .list({
                paging: false,
                fields: 'id,displayName',
            })
            .then(validationRuleGroupsResponse => {
                setValidationRuleGroups([
                    ALL_VALIDATION_RULE_GROUPS_OPTION,
                    ...validationRuleGroupsResponse.toArray(),
                ])
            })
            .catch(error => {
                validationRuleGroupsLoadErrorAlert.show({ error })
            })
    }, [])

    const handleChange = (event, index, value) => {
        setSelected(value)
        onChange(value)
    }

    return (
        <SelectField
            style={style}
            floatingLabelText={i18n.t('Validation Rule Group')}
            onChange={handleChange}
            value={selected}
        >
            {validationRuleGroups.map(item => (
                <MenuItem
                    key={item.id}
                    value={item.id}
                    primaryText={item.displayName}
                />
            ))}
        </SelectField>
    )
}

ValidationRuleGroupsSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
}

ValidationRuleGroupsSelect.defaultProps = {
    style: {},
}

export default ValidationRuleGroupsSelect
