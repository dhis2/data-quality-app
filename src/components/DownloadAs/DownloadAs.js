import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DownloadAs.module.css'
import useHrefs from './use-hrefs.js'

const DownloadAs = ({ endpoint, fileTypes, queryStr, skipExtension }) => {
    const hrefs = useHrefs({ endpoint, fileTypes, queryStr,skipExtension })

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
                <a href={hrefs.csv} download="validation_data.csv">
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
