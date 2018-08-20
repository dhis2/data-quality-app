import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

export const ALL_VALIDATION_RULE_GROUPS_ID = -1;
export const ALL_VALIDATION_RULE_GROUPS_OPTION = {
    id: ALL_VALIDATION_RULE_GROUPS_ID,
    displayName: i18nKeys.validationRuleGroupsSelect.allValidationRulesOption,
};

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
        super();

        this.state = {
            validationRuleGroups: [ALL_VALIDATION_RULE_GROUPS_OPTION],
            selected: ALL_VALIDATION_RULE_GROUPS_ID,
        };
    }

    componentDidMount() {
        const d2 = this.context.d2;
        const translatedAllValidationRulesOption = ALL_VALIDATION_RULE_GROUPS_OPTION;
        translatedAllValidationRulesOption.displayName = i18n.t(ALL_VALIDATION_RULE_GROUPS_OPTION.displayName);
        d2.models.validationRuleGroup.list({
            paging: false,
            fields: 'id,displayName',
        }).then((validationRuleGroupsResponse) => {
            this.setState({
                validationRuleGroups: [translatedAllValidationRulesOption, ...validationRuleGroupsResponse.toArray()],
            });
        }).catch(() => {
            // TODO
        });
    }

    onChange = (event, index, value) => {
        this.setState({
            selected: value,
            selectedName: value === ALL_VALIDATION_RULE_GROUPS_ID ?
                i18nKeys.validationRuleGroupsSelect.allValidationRulesOption :
                this.state.validationRuleGroups[index].displayName,
        });

        this.props.onChange(event, index, value);
    };

    render() {
        return (
            <SelectField
                style={this.props.style}
                floatingLabelText={
                    i18n.t(i18nKeys.validationRuleGroupsSelect.validationRuleGroupLabel)
                }
                onChange={this.onChange}
                value={this.state.selected}
            >
                {this.state.validationRuleGroups.map(item => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                        primaryText={item.displayName}
                    />
                ))
                }
            </SelectField>
        );
    }
}

export default ValidationRuleGroupsSelect;
