const generateElementKey = e =>
    `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${e.sourceId}-${e.dataElementId}`

const convertElementFromApiResponse = e => ({
    key: generateElementKey(e),
    attributeOptionComboId: e.attributeOptionComboId,
    categoryOptionComboId: e.categoryOptionComboId,
    periodId: e.periodId,
    organisationUnitId: e.sourceId,
    dataElementId: e.dataElementId,
    dataElement: e.dataElementName,
    organisation: e.sourceName,
    period: e.period.name,
    min: e.min,
    max: e.max,
    value: Number.parseFloat(e.value, 10),
    marked: !e.followup,
    comment: e.comment,
})

export default convertElementFromApiResponse
