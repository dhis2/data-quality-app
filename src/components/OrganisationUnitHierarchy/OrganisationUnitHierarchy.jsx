import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { HIERARCHY_SEPARATOR } from '../../helpers/org-unit-hierarchy.js'
import styles from './OrganisationUnitHierarchy.module.css'

/**
 * Shows the org unit name with its ancestors as secondary text.
 * `ancestors` is undefined while loading, null when unavailable and an
 * empty array for a root org unit.
 */
const OrganisationUnitHierarchy = ({ name, ancestors }) => (
    <span className={styles.container}>
        <span className={styles.name}>{name}</span>
        {ancestors?.length > 0 && (
            <span className={styles.ancestors}>
                {ancestors.join(HIERARCHY_SEPARATOR)}
            </span>
        )}
        {ancestors === null && (
            <span className={cx(styles.ancestors, styles.unavailable)}>
                {i18n.t('Hierarchy unavailable')}
            </span>
        )}
    </span>
)

OrganisationUnitHierarchy.propTypes = {
    ancestors: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
}

export default OrganisationUnitHierarchy
