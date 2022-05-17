import i18n from '@dhis2/d2-i18n'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../../components/FormattedNumber/FormattedNumber.js'
import cssPageStyles from '../../Page.module.css'
import styles from './ValidationRulesDetails.module.css'

const Section = ({ side, elements, classNameRow }) => {
    if (!elements || elements.length === 0) {
        return (
            <div className={classNames('row', styles.sectionBox)}>
                <div className={classNames('col-xs-12', styles.sectionTitle)}>
                    {side}
                </div>
                <div className={classNames('col-xs-12', cssPageStyles.center)}>
                    <div className={styles.noData}>
                        {i18n.t('no data available')}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={classNames('row', classNameRow, styles.sectionBox)}>
            <div className={classNames('col-xs-12', styles.sectionTitle)}>
                {side}
            </div>
            <div className={classNames('col-xs-10', styles.sectionSubTitle)}>
                {i18n.t('DATA ELEMENT')}
            </div>
            <div
                className={classNames(
                    'col-xs-2',
                    styles.sectionSubTitle,
                    cssPageStyles.right
                )}
            >
                {i18n.t('VALUE')}
            </div>
            {elements.map((element) => (
                <div key={element.name} className={'col-xs-12'}>
                    <div className={'row'}>
                        <div className={'col-xs-10'}>{element.name}</div>
                        <div
                            className={classNames(
                                'col-xs-2',
                                cssPageStyles.right
                            )}
                        >
                            {element.value ? (
                                <FormattedNumber
                                    value={Number(element.value)}
                                />
                            ) : (
                                '-'
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

Section.propTypes = {
    classNameRow: PropTypes.string.isRequired,
    side: PropTypes.string.isRequired,
    elements: PropTypes.array,
}

export default Section
