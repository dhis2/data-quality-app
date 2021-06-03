import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DownloadAs.module.css'

const useHrefs = ({ endpoint, fileTypes, queryStr }) => {
    const { d2 } = useD2()
    const { baseUrl } = d2.Api.getApi()
    const timestamp = Date.now()
    // The new outlierDetection endpoint produces the correct report
    // based on query params, but older endpoints only take a timestamp
    queryStr = queryStr || `t=${timestamp}`

    return fileTypes.reduce((acc, type) => {
        acc[type] = `${baseUrl}${endpoint}.${type}?${queryStr}`
        return acc
    }, {})
}

const DownloadAs = ({ endpoint, fileTypes, queryStr }) => {
    const hrefs = useHrefs({ endpoint, fileTypes, queryStr })

    return (
        <div className={styles.downloadAs}>
            {fileTypes.includes('pdf') && (
                <a href={hrefs.pdf} download>
                    {i18n.t('Download as PDF')}
                </a>
            )}
            {fileTypes.includes('xls') && (
                <a href={hrefs.xls} download>
                    {i18n.t('Download as XLS')}
                </a>
            )}
            {fileTypes.includes('csv') && (
                <a href={hrefs.csv} download>
                    {i18n.t('Download as CSV')}
                </a>
            )}
        </div>
    )
}

DownloadAs.propTypes = {
    endpoint: PropTypes.string.isRequired,
    fileTypes: PropTypes.arrayOf(PropTypes.oneOf(['pdf', 'xls', 'csv'])),
    queryStr: PropTypes.string,
}

DownloadAs.defaultProps = {
    fileTypes: ['pdf', 'xls', 'csv'],
}

export default DownloadAs
