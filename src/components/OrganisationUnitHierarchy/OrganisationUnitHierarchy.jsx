import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { HIERARCHY_SEPARATOR } from '../../helpers/org-unit-hierarchy.js'
import styles from './OrganisationUnitHierarchy.module.css'

// `ancestors` is an empty array for a root org unit, null when the hierarchy
// is unavailable and undefined when it was not loaded
const OrganisationUnitHierarchy = ({ name, ancestors }) => (
    <div>
        <bdi>{name}</bdi>
        {ancestors?.length > 0 && (
            <div className={styles.ancestors}>
                <bdi>{ancestors.join(HIERARCHY_SEPARATOR)}</bdi>
            </div>
        )}
        {ancestors === null && (
            <div className={cx(styles.ancestors, styles.unavailable)}>
                {i18n.t('Hierarchy unavailable')}
            </div>
        )}
    </div>
)

OrganisationUnitHierarchy.propTypes = {
    ancestors: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
}

export default OrganisationUnitHierarchy
