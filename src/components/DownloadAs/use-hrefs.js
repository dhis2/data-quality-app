import { useConfig } from '@dhis2/app-runtime'

const useHrefs = ({ endpoint, fileTypes, queryStr }) => {
    const { baseUrl, apiVersion } = useConfig()
    const timestamp = Date.now()
    // The new outlierDetection endpoint produces the correct report
    // based on query params, but older endpoints only take a timestamp
    queryStr = queryStr || `t=${timestamp}`

    // removing leading slash for endpoint to make sure it works whether it's configured with slash or not
    const sanitisedEndpoint = endpoint?.replace(/^\//, '')
    const endpointUrl = `${baseUrl}/api/${apiVersion}/${sanitisedEndpoint}`

    return fileTypes.reduce((acc, type) => {
        const downloadUrl = `${endpointUrl}.${type}?${queryStr}`
        acc[type] = downloadUrl
        return acc
    }, {})
}

export default useHrefs
