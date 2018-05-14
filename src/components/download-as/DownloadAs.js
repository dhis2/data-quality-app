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
        const timestamp = new Date().getTime();       // To clear cache
        return (
            <div className={styles.downloadAs}>
                <a
                    className="print-action-link"
                    href={`${api.baseUrl}${this.props.endpoint}.pdf?t=${timestamp}`}
                    target="_blank"
                >
                    {translator(i18nKeys.downloadAs.pdf)}
                </a>
                <a
                    className="print-action-link"
                    href={`${api.baseUrl}${this.props.endpoint}.xls?t=${timestamp}`}
                    target="_blank"
                >
                    {translator(i18nKeys.downloadAs.xls)}
                </a>
                <a
                    className="print-action-link"
                    href={`${api.baseUrl}${this.props.endpoint}.csv?t=${timestamp}`}
                    target="_blank"
                >
                    {translator(i18nKeys.downloadAs.csv)}
                </a>
            </div>
        );
    }
}

export default DownloadAs;

