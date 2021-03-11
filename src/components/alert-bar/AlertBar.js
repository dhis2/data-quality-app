import i18n from '@dhis2/d2-i18n'
import { Paper } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styles from './AlertBar.module.css'

class AlertBar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
    }

    render() {
        return (
            <Paper>
                <div
                    className={styles.alertBar}
                    style={{ display: this.props.show ? 'flex' : 'none' }}
                >
                    {i18n.t(
                        'More than 500 values found, please narrow the search to see all'
                    )}
                </div>
            </Paper>
        )
    }
}

export default AlertBar
