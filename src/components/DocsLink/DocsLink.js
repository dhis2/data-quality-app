import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconButton } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { getDocsKeyForSection } from '../../pages/sections.conf'

const getDocsVersion = ({ major, minor, tag }) => {
    if (tag === 'SNAPSHOT') {
        return 'master'
    }
    return `${major}${minor}`
}

const DocsLink = ({ sectionKey }) => {
    const { serverVersion } = useConfig()
    const docsVersion = getDocsVersion(serverVersion)
    const docsKey = getDocsKeyForSection(sectionKey)

    return (
        <IconButton
            className="helper-icon"
            iconStyle={{ color: '#276696' }}
            href={`https://docs.dhis2.org/en/use/user-guides/dhis-core-version-${docsVersion}/collecting-data/data-quality.html#${docsKey}`}
            target="_blank"
            rel="noopener noreferrer"
            tooltip={i18n.t('Open user guide')}
            tooltipPosition="bottom-center"
            iconClassName="material-icons"
        >
            help
        </IconButton>
    )
}

DocsLink.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DocsLink
