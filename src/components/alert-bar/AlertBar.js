import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';

import styles from './AlertBar.css';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

class AlertBar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
    }

    render() {
        return (
            <Paper>
                <div className={styles.alertBar} style={{ display: this.props.show ? 'flex' : 'none' }}>
                    {i18n.t(i18nKeys.moreThan500)}
                </div>
            </Paper>
        );
    }
}

export default AlertBar;

