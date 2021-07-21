const convertElementFromApiResponse = e => ({
    key: `${e.aoc}-${e.coc}-${e.pe}-${e.ou}-${e.de}`,
    attributeOptionComboId: e.aoc,
    categoryOptionComboId: e.coc,
    periodId: e.pe,
    period: e.peName,
    organisationUnitId: e.ou,
    organisation: e.ouName,
    dataElementId: e.de,
    dataElement: e.deName,
    min: e.min,
    max: e.max,
    value: Number.parseFloat(e.value, 10),
    comment: e.comment,
    marked: false,
})

export default convertElementFromApiResponse
