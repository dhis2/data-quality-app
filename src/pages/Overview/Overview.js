import classNames from 'classnames'
import React from 'react'
import { sections } from '../sections.conf'
import GridSection from './grid-section/GridSection'
import styles from './Overview.module.css'

const Overview = () => (
    <div className="row">
        {sections.map(section => (
            <div
                key={section.key}
                className={classNames(
                    'col-sm-12 col-md-6 col-lg-4',
                    styles.gridContainer
                )}
            >
                <GridSection section={section} />
            </div>
        ))}
    </div>
)

export default Overview
