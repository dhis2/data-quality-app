import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { i18nKeys } from '../../i18n';

import styles from './DownloadAs.css';

class DownloadAs extends PureComponent {
    static contextTypes = {
        translator: PropTypes.func,
        d2: PropTypes.object,
    }

    static propTypes = {
        endpoint: PropTypes.string.isRequired,
    }

    render() {
        const api = this.context.d2.Api.getApi();
        const translator = this.context.translator;
        return (
            <div className={styles.downloadAs}>
                <a href={`${api.baseUrl}${this.props.endpoint}.pdf`} target="_blank" >{translator(i18nKeys.downloadAs.pdf)}</a>
                <a href={`${api.baseUrl}${this.props.endpoint}.xls`} target="_blank" >{translator(i18nKeys.downloadAs.xls)}</a>
                <a href={`${api.baseUrl}${this.props.endpoint}.csv`} target="_blank" >{translator(i18nKeys.downloadAs.csv)}</a>
            </div>
        );
    }
}

export default DownloadAs;

