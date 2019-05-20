import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';
import styles from './DownloadAs.css';

class DownloadAs extends PureComponent {
    static contextTypes = {
        d2: PropTypes.object,
    }

    static propTypes = {
        endpoint: PropTypes.string.isRequired,
    }

    render() {
        const api = this.context.d2.Api.getApi();
        const timestamp = new Date().getTime();       // To clear cache
        return (
            <div className={styles.downloadAs}>
                <a
                    className="export-pdf-action"
                    href={`${api.baseUrl}${this.props.endpoint}.pdf?t=${timestamp}`}
                    target="_blank"
                >
                    {i18n.t(i18nKeys.downloadAs.pdf)}
                </a>
                <a
                    className="export-xls-action"
                    href={`${api.baseUrl}${this.props.endpoint}.xls?t=${timestamp}`}
                    target="_blank"
                >
                    {i18n.t(i18nKeys.downloadAs.xls)}
                </a>
                <a
                    className="export-csv-action"
                    href={`${api.baseUrl}${this.props.endpoint}.csv?t=${timestamp}`}
                    target="_blank"
                >
                    {i18n.t(i18nKeys.downloadAs.csv)}
                </a>
            </div>
        );
    }
}

export default DownloadAs;

