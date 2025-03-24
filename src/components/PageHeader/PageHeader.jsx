import { FontIcon, IconButton } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import DocsLink from '../DocsLink/DocsLink.jsx'
import styles from './PageHeader.module.css'

const PageHeader = ({ title, onBack, sectionKey }) => (
    <header className={styles.header}>
        {onBack && (
            <IconButton onClick={onBack}>
                <FontIcon className={'material-icons'}>arrow_back</FontIcon>
            </IconButton>
        )}
        <h1 className={styles.headerTitle}>{title}</h1>
        {sectionKey && <DocsLink sectionKey={sectionKey} />}
    </header>
)

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    sectionKey: PropTypes.string,
    onBack: PropTypes.func,
}

export default PageHeader
