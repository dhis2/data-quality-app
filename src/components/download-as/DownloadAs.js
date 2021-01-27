import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import styles from './DownloadAs.module.css'

class DownloadAs extends PureComponent {
    static contextTypes = {
        d2: PropTypes.object,
    }

    static propTypes = {
        endpoint: PropTypes.string.isRequired,
        fileTypes: PropTypes.arrayOf(PropTypes.oneOf(['pdf', 'xls', 'csv'])),
        queryStr: PropTypes.string,
    }

    static defaultProps = {
        fileTypes: ['pdf', 'xls', 'csv'],
    }

    getHrefs() {
        const { baseUrl } = this.context.d2.Api.getApi()
        const { endpoint, fileTypes } = this.props
        const timestamp = Date.now()
        // The new outlierDetection endpoint produces the correct report
        // based on query params, but older endpoints only take a timestamp
        const queryStr = this.props.queryStr || `t=${timestamp}`

        return fileTypes.reduce((acc, type) => {
            acc[type] = `${baseUrl}${endpoint}.${type}?${queryStr}`
            return acc
        }, {})
    }

    render() {
        const { fileTypes } = this.props
        const hrefs = this.getHrefs()
        return (
            <div className={styles.downloadAs}>
                {fileTypes.includes('pdf') && (
                    <a className="export-pdf-action" href={hrefs.pdf} download>
                        {i18n.t('DOWNLOAD AS PDF')}
                    </a>
                )}
                {fileTypes.includes('xls') && (
                    <a className="export-xls-action" href={hrefs.xls} download>
                        {i18n.t('DOWNLOAD AS XLS')}
                    </a>
                )}
                {fileTypes.includes('csv') && (
                    <a className="export-csv-action" href={hrefs.csv} download>
                        {i18n.t('DOWNLOAD AS CSV')}
                    </a>
                )}
            </div>
        )
    }
}

export default DownloadAs
