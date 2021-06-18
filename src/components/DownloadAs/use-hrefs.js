import { useD2 } from '@dhis2/app-runtime-adapter-d2'

const useHrefs = ({ endpoint, fileTypes, queryStr }) => {
    const { d2 } = useD2()
    const { baseUrl } = d2.Api.getApi()
    const timestamp = Date.now()
    // The new outlierDetection endpoint produces the correct report
    // based on query params, but older endpoints only take a timestamp
    queryStr = queryStr || `t=${timestamp}`

    return fileTypes.reduce((acc, type) => {
        acc[type] = `${baseUrl}${endpoint}.${type}?${queryStr}`
        return acc
    }, {})
}

export default useHrefs
