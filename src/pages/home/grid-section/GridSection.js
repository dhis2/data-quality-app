import { Card } from '@dhis2/ui'
import classNames from 'classnames'
import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import styles from './GridSection.module.css'

class GridSection extends PureComponent {
    static propTypes = {
        section: PropTypes.shape({
            info: PropTypes.shape({
                actionText: PropTypes.func,
                description: PropTypes.func,
                icon: PropTypes.string,
                label: PropTypes.func,
            }),
            key: PropTypes.string,
            path: PropTypes.string,
        }).isRequired,
    }

    render() {
        return (
            <Link className={styles.link} to={this.props.section.path}>
                <Card className={classNames('section', styles.gridElement)}>
                    <div>
                        <div className={classNames('row', styles.gridTitleBar)}>
                            <h2
                                className={classNames(
                                    'section-title',
                                    styles.gridTitleDescription
                                )}
                            >
                                {this.props.section.info.label()}
                            </h2>
                            <FontIcon
                                className={classNames(
                                    'material-icons',
                                    'icon',
                                    styles.gridIcon
                                )}
                            >
                                {this.props.section.info.icon}
                            </FontIcon>
                        </div>
                        <p
                            className={classNames(
                                'section-description',
                                'row',
                                styles.gridDescription
                            )}
                        >
                            {this.props.section.info.description()}
                        </p>
                    </div>
                    <span
                        className={classNames(
                            'section-action-text',
                            'row',
                            styles.gridActionText
                        )}
                    >
                        {this.props.section.info.actionText()}
                    </span>
                </Card>
            </Link>
        )
    }
}

export default GridSection
