const convertElementToUnFollowupRequest = e => ({
    dataElement: e.dataElementId,
    period: e.periodId,
    orgUnit: e.organisationUnitId,
    categoryOptionCombo: e.categoryOptionComboId || null,
    attributeOptionCombo: e.attributeOptionComboId || null,
    followup: false,
})

export default convertElementToUnFollowupRequest
