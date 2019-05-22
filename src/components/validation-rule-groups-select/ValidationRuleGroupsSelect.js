import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import i18n from '../../locales'

export const ALL_VALIDATION_RULE_GROUPS_ID = -1
export const ALL_VALIDATION_RULE_GROUPS_OPTION = {
    id: ALL_VALIDATION_RULE_GROUPS_ID,
    displayName: '[All Validation Rules]',
}

class ValidationRuleGroupsSelect extends PureComponent {
    static propTypes = {
        style: PropTypes.object,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        style: {},
    }

    static contextTypes = {
        d2: PropTypes.object,
    }

    constructor() {
        super()

        this.state = {
            validationRuleGroups: [ALL_VALIDATION_RULE_GROUPS_OPTION],
            selected: ALL_VALIDATION_RULE_GROUPS_ID,
        }

        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        const d2 = this.context.d2
        const translatedAllValidationRulesOption = ALL_VALIDATION_RULE_GROUPS_OPTION
        translatedAllValidationRulesOption.displayName = i18n.t(
            ALL_VALIDATION_RULE_GROUPS_OPTION.displayName
        )
        d2.models.validationRuleGroup
            .list({
                paging: false,
                fields: 'id,displayName',
            })
            .then(validationRuleGroupsResponse => {
                this.setState({
                    validationRuleGroups: [
                        translatedAllValidationRulesOption,
                        ...validationRuleGroupsResponse.toArray(),
                    ],
                })
            })
            .catch(() => {
                this.manageError()
            })
    }

    onChange(event, index, value) {
        this.setState({
            selected: value,
            selectedName:
                value === ALL_VALIDATION_RULE_GROUPS_ID
                    ? '[All Validation Rules]'
                    : this.state.validationRuleGroups[index].displayName,
        })

        this.props.onChange(event, index, value)
    }

    render() {
        return (
            <SelectField
                style={this.props.style}
                floatingLabelText={i18n.t('Validation Rule Group')}
                onChange={this.onChange}
                value={this.state.selected}
            >
                {this.state.validationRuleGroups.map(item => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                        primaryText={item.displayName}
                    />
                ))}
            </SelectField>
        )
    }
}

export default ValidationRuleGroupsSelect
