import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

// i18n
import { i18nKeys } from '../../i18n';

import styles from './AvailableOrganisationUnitsTree.css';

class AvailableOrganisationUnitsTree extends PureComponent {
  static contextTypes = {
      d2: PropTypes.object,
      translator: PropTypes.func,
  }

  static propTypes = {
      onChange: PropTypes.func,
  }

  static defaultProps = {
      onChange: null,
  }

  constructor() {
      super();

      this.state = {
          selected: [],
          rootWithMember: null,
      };

      this.handleOrgUnitClick = this.handleOrgUnitClick.bind(this);
  }

  componentDidMount() {
      const d2 = this.context.d2;
      if (this.state.rootWithMember == null) {
          d2.models.organisationUnits.list({
              paging: false,
              level: 1,
              fields: 'id,displayName,path,children::isNotEmpty,memberCount',
          }).then((organisationUnitsResponse) => {
              const organisationUnits = organisationUnitsResponse.toArray();
              this.setState({
                  rootWithMembers: organisationUnits[0],
              });
          }).catch(() => { this.manageError(); });
      }
  }

  handleOrgUnitClick(event, orgUnit) {
      if (!this.state.selected.includes(orgUnit.path)) {
          this.setState({ selected: [orgUnit.path] });
          if (this.props.onChange) {
              const selectedOrganisationUnitSplitted = orgUnit.path.split('/');
              const selectedOrganisationUnitId =
                selectedOrganisationUnitSplitted[selectedOrganisationUnitSplitted.length - 1];
              this.props.onChange(selectedOrganisationUnitId);
          }
      }
  }

  render() {
      const translator = this.context.translator;
      if (this.state.rootWithMembers) {
          return (
              <div className={styles.tree}>
                  <OrgUnitTree
                      hideMemberCount={Boolean(true)}
                      root={this.state.rootWithMembers}
                      selected={this.state.selected}
                      initiallyExpanded={[`/${this.state.rootWithMembers.id}`]}
                      onSelectClick={this.handleOrgUnitClick}
                  />
              </div>
          );
      }

      return <span>{translator(i18nKeys.availableOrganisationUnitsTree.updatingMessage)}</span>;
  }
}

export default AvailableOrganisationUnitsTree;
