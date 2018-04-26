import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { i18nKeys } from '../../i18n';

export const ALL_DATA_SETS_OPTION_ID = -1;
export const ALL_DATA_SETS_OPTION = {
    id: ALL_DATA_SETS_OPTION_ID,
    displayName: i18nKeys.datasetsForOrganisationUnitSelect.allDataSetsOption,
};

class DatasetsForOrganisationUnitSelect extends PureComponent {
  static contextTypes = {
      d2: PropTypes.object,
      translator: PropTypes.func,
  }

  static propTypes = {
      organisationUnitId: PropTypes.string,
      onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
      organisationUnitId: null,
  }

  constructor() {
      super();

      this.state = {
          dataSets: [ALL_DATA_SETS_OPTION],
          selected: ALL_DATA_SETS_OPTION.id,
      };

      this.onChange = this.onChange.bind(this);
  }

  // FIXME study the lifecycle and https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
  componentWillReceiveProps(nextProps) {
      const d2 = this.context.d2;
      const translator = this.context.translator;
      const translatedAllDataSetsOption = ALL_DATA_SETS_OPTION;
      translatedAllDataSetsOption.displayName = translator(ALL_DATA_SETS_OPTION.displayName);
      if (this.props.organisationUnitId !== nextProps.organisationUnitId) {
          this.setState({
              dataSets: [ALL_DATA_SETS_OPTION],
              selected: ALL_DATA_SETS_OPTION.id,
          });
          d2.models.organisationUnits.get(nextProps.organisationUnitId, {
              paging: false,
              fields: 'dataSets[id, displayName]',
          }).then((dataSetsResponse) => {
              this.setState({
                  dataSets: [translatedAllDataSetsOption, ...dataSetsResponse.dataSets.toArray()],
              });
          }).catch(() => { this.manageError(); });
      }
  }

  onChange(event, index, value) {
      this.setState({
          selected: value,
          selectedName: value === ALL_DATA_SETS_OPTION_ID ?
              i18nKeys.datasetsForOrganisationUnitSelect.allDataSetsOption :
              this.state.dataSets[index].displayName,
      });

      this.props.onChange(event, index, value);
  }

  render() {
      const translator = this.context.translator;
      return (
          <SelectField
              floatingLabelText={
                  translator(i18nKeys.datasetsForOrganisationUnitSelect.dataSetLabel)
              }
              onChange={this.onChange}
              value={this.state.selected}
          >
              {this.state.dataSets.map(item => (
                  <MenuItem
                      key={item.id}
                      value={item.id}
                      primaryText={item.displayName}
                  />
              ))}
          </SelectField>
      );
  }
}

export default DatasetsForOrganisationUnitSelect;
