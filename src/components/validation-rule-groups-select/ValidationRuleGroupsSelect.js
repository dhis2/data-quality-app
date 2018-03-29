import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { i18nKeys } from '../../i18n';

export const ALL_VALIDATION_RULES_OPTION_ID = -1;
export const ALL_VALIDATION_RULES_OPTION = {
    id: ALL_VALIDATION_RULES_OPTION_ID,
    displayName: i18nKeys.validationRuleGroupsSelect.allValidationRulesOption,
};

class ValidationRuleGroupsSelect extends PureComponent {
  static propTypes = {
      style: PropTypes.object,
  }

  static defaultProps = {
      style: {},
  }

  static contextTypes = {
      d2: PropTypes.object,
      translator: PropTypes.func,
  }

  constructor() {
      super();

      this.state = {
          validationRuleGroups: [ALL_VALIDATION_RULES_OPTION],
      };
  }

  componentDidMount() {
      const d2 = this.context.d2;
      const translator = this.context.translator;
      const translatedAllValidationRulesOption = ALL_VALIDATION_RULES_OPTION;
      translatedAllValidationRulesOption.displayName = translator(ALL_VALIDATION_RULES_OPTION.displayName);
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

  render() {
      const translator = this.context.translator;
      return (
          <SelectField
              style={this.props.style}
              floatingLabelText={
                  translator(i18nKeys.validationRuleGroupsSelect.validationRuleGroupLabel)
              }
              value={-1}
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
