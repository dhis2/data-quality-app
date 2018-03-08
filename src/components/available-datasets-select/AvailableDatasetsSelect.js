import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './AvailableDatasetsSelect.css';

class AvailableDatasetsSelect extends PureComponent {
  static contextTypes = {
      d2: PropTypes.object,
  }

  constructor() {
      super();

      this.state = {
          dataSets: null,
      };
  }

  componentWillMount() {
      const d2 = this.context.d2;
      if (this.state.dataSets == null) {
          d2.models.dataSet.list({
              paging: false,
              fields: 'id,displayName',
          }).then((dataSetsResponse) => {
              this.setState({
                  dataSets: dataSetsResponse.toArray(),
              });
          }).catch(() => {
              // TODO
          });
      }
  }

  render() {
      return (
          <select
              multiple
              className={styles.select}
          >
              {(this.state.dataSets || []).map(item => (
                  <option
                      key={item.id}
                      value={item.id}
                      className={styles.options}
                  >{item.displayName}</option>
              ))}
          </select>
      );
  }
}

export default AvailableDatasetsSelect;
