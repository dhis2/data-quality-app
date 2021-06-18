const generateElementKey = e =>
    `${e.validationRuleId}-${e.periodId}-${e.organisationUnitId}-${e.attributeOptionComboId}`

const convertElementFromApiResponse = e => ({
    key: generateElementKey(e),
    validationRuleId: e.validationRuleId,
    attributeOptionCombo: e.attributeOptionComboDisplayName,
    attributeOptionComboId: e.attributeOptionComboId,
    organisation: e.organisationUnitDisplayName,
    organisationUnitId: e.organisationUnitId,
    period: e.periodDisplayName,
    periodId: e.periodId,
    importance: e.importance,
    validationRule: e.validationRuleDescription,
    leftValue: e.leftSideValue,
    operator: e.operator,
    rightValue: e.rightSideValue,
})

export default convertElementFromApiResponse
