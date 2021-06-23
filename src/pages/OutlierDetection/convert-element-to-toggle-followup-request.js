const convertElementToToggleFollowupRequest = e => ({
    dataElement: e.de,
    period: e.pe,
    orgUnit: e.ou,
    categoryOptionCombo: e.coc || null,
    attributeOptionCombo: e.aoc || null,
    followup: !e.marked,
})

export default convertElementToToggleFollowupRequest
