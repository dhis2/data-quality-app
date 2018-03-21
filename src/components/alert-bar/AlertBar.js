import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';

import styles from './AlertBar.css';
import { i18nKeys } from '../../i18n';

class AlertBar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
    }

    render() {
        const translator = this.context.translator;
        return (
            <Paper>
                <div className={styles.alertBar} style={{ display: this.props.show ? 'flex' : 'none' }}>
                    {translator(i18nKeys.moreThan500)}
                </div>
            </Paper>
        );
    }
}

export default AlertBar;

