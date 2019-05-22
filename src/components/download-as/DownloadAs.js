import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import i18n from '../../locales'
import styles from './DownloadAs.module.css'

class DownloadAs extends PureComponent {
    static contextTypes = {
        d2: PropTypes.object,
    }

    static propTypes = {
        endpoint: PropTypes.string.isRequired,
    }

    render() {
        const api = this.context.d2.Api.getApi()
        const timestamp = Date.now()
        return (
            <div className={styles.downloadAs}>
                <a
                    className="export-pdf-action"
                    href={`${api.baseUrl}${
                        this.props.endpoint
                    }.pdf?t=${timestamp}`}
                    download
                >
                    {i18n.t('DOWNLOAD AS PDF')}
                </a>
                <a
                    className="export-xls-action"
                    href={`${api.baseUrl}${
                        this.props.endpoint
                    }.xls?t=${timestamp}`}
                    download
                >
                    {i18n.t('DOWNLOAD AS XLS')}
                </a>
                <a
                    className="export-csv-action"
                    href={`${api.baseUrl}${
                        this.props.endpoint
                    }.csv?t=${timestamp}`}
                    download
                >
                    {i18n.t('DOWNLOAD AS CSV')}
                </a>
            </div>
        )
    }
}

export default DownloadAs
