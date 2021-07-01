import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, Tooltip } from '@dhis2/ui'
import { Dialog, FlatButton, FontIcon } from 'material-ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Result from './Result'
import Section from './Section'

const query = {
    rule: {
        resource: 'validationRules',
        id: ({ validationRuleId }) => validationRuleId,
    },
    expression: {
        resource: 'dataAnalysis/validationRulesExpression',
        params: params => params,
    },
}

const ValidationRulesDetails = ({
    attributeOptionComboId,
    organisationUnitId,
    periodId,
    validationRuleId,
}) => {
    const [detailsVisible, setDetailsVisible] = useState(false)
    const errorAlert = useAlert(({ error }) => error.message, {
        critical: true,
    })
    const { loading, data, refetch: fetchDetails } = useDataQuery(query, {
        lazy: true,
        variables: {
            validationRuleId,
            periodId,
            organisationUnitId,
            attributeOptionComboId,
        },
        onComplete: () => {
            handleModalOpen()
        },
        onError: error => {
            errorAlert.show({ error })
        },
    })

    const handleModalOpen = () => {
        setDetailsVisible(true)
    }
    const handleModalClose = () => {
        setDetailsVisible(false)
    }

    return (
        <>
            <Tooltip
                content={i18n.t('Show details')}
                openDelay={0}
                closeDelay={0}
            >
                <Button
                    small
                    icon={
                        loading ? (
                            <CircularLoader small />
                        ) : (
                            <FontIcon className="material-icons">info</FontIcon>
                        )
                    }
                    disabled={loading}
                    onClick={data ? handleModalOpen : fetchDetails}
                />
            </Tooltip>
            <Dialog
                className="validation-rules-details-dialog"
                autoScrollBodyContent={true}
                title={i18n.t('Validation Details')}
                actions={[
                    <FlatButton
                        className="close-action"
                        key="close"
                        label={i18n.t('Close')}
                        primary={true}
                        onClick={handleModalClose}
                    />,
                ]}
                modal={true}
                open={detailsVisible}
                onRequestClose={handleModalClose}
            >
                {data && (
                    <>
                        <Result rule={data.rule} />
                        <Section
                            side={i18n.t('LEFT SIDE')}
                            elements={data.expression.leftSide}
                            classNameRow="left-side-row"
                        />
                        <Section
                            side={i18n.t('RIGHT SIDE')}
                            elements={data.expression.rightSide}
                            classNameRow="right-side-row"
                        />
                    </>
                )}
            </Dialog>
        </>
    )
}

ValidationRulesDetails.propTypes = {
    attributeOptionComboId: PropTypes.string.isRequired,
    organisationUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    validationRuleId: PropTypes.string.isRequired,
}

export default ValidationRulesDetails
