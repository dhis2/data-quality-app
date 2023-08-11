import { useConfig } from '@dhis2/app-runtime'

const useHrefs = ({ endpoint, fileTypes, queryStr, skipExtension }) => {
    const { baseUrl, apiVersion } = useConfig()
    const timestamp = Date.now()
    // The new outlierDetection endpoint produces the correct report
    // based on query params, but older endpoints only take a timestamp
    queryStr = queryStr || `t=${timestamp}`

    return fileTypes.reduce((acc, type) => {
        const downloadUrl = `${baseUrl}/api/${apiVersion}/${endpoint}${skipExtension?``:`.${type}`}?${queryStr}`
        acc[type] = downloadUrl
        return acc
    }, {})
}

export default useHrefs
