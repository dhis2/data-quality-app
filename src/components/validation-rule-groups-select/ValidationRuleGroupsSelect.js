import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { i18nKeys } from '../../i18n';

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
          validationRuleGroups: null,
      };
  }

  componentWillMount() {
      const d2 = this.context.d2;
      if (this.state.validationRuleGroups == null) {
          d2.models.validationRuleGroup.list({
              paging: false,
              fields: 'id,displayName',
          }).then((validationRuleGroupsResponse) => {
              this.setState({
                  validationRuleGroups: validationRuleGroupsResponse.toArray(),
              });
          }).catch(() => {
              // TODO
          });
      }
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
              <MenuItem
                  key={'-1'}
                  value={-1}
                  primaryText={translator(i18nKeys.validationRuleGroupsSelect.allValidationRulesOption)}
              />
              {this.state.validationRuleGroups &&
                this.state.validationRuleGroups.map(item => (
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
