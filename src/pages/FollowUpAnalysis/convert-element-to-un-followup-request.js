const convertElementToUnFollowupRequest = e => ({
    dataElementId: e.dataElementId,
    periodId: e.periodId,
    organisationUnitId: e.organisationUnitId,
    categoryOptionComboId: e.categoryOptionComboId,
    attributeOptionComboId: e.attributeOptionComboId,
    followup: false,
})

export default convertElementToUnFollowupRequest
