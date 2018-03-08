import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { i18nKeys } from '../../i18n';

class DatasetsForOrganisationUnitSelect extends PureComponent {
  static contextTypes = {
      d2: PropTypes.object,
      translator: PropTypes.func,
  }

  static propTypes = {
      organisationUnitId: PropTypes.string,
  }

  static defaultProps = {
      organisationUnitId: null,
  }

  constructor() {
      super();

      this.state = {
          dataSets: null,
      };
  }

  // FIXME study the lifecycle to find a better place for this
  componentWillReceiveProps(nextProps) {
      const d2 = this.context.d2;
      if (this.props.organisationUnitId !== nextProps.organisationUnitId) {
          d2.models.organisationUnits.get(nextProps.organisationUnitId, {
              paging: false,
              fields: 'dataSets[id, displayName]',
          }).then((dataSetsResponse) => {
              this.setState({
                  dataSets: dataSetsResponse.dataSets.toArray(),
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
              floatingLabelText={
                  translator(i18nKeys.datasetsForOrganisationUnitSelect.dataSetLabel)
              }
              value={-1}
          >
              <MenuItem
                  value={-1}
                  primaryText={translator(i18nKeys.datasetsForOrganisationUnitSelect.allDataSetsOption)}
              />
              {this.state.dataSets &&
                this.state.dataSets.map(item => (
                    <MenuItem value={item.id} primaryText={item.displayName} />
                ))
              }
          </SelectField>
      );
  }
}

export default DatasetsForOrganisationUnitSelect;
