const getElementDisplayName = (e) => {
    let str = e.deName

    // In the context of a dataElement, the default COC or AOC means "none".
    // The "default" string is not localised, and probably won't ever be.
    // That is why the conditions below should work in the foreseeable future.
    if (e.cocName !== 'default') {
        str += ` (${e.cocName})`
    }

    if (e.aocName !== 'default') {
        str += ` (${e.aocName})`
    }

    return str
}

const convertElementFromApiResponse = (e) => ({
    displayName: getElementDisplayName(e),
    key: `${e.aoc}-${e.coc}-${e.de}-${e.pe}-${e.ou}`,
    marked: e.followup,
    ...e,
})

export default convertElementFromApiResponse
