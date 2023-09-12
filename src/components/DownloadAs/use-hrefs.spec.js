import useHrefs from './use-hrefs.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: () => ({
        baseUrl: 'https://debug.dhis2.org/dev',
        apiVersion: '41',
    }),
}))

describe('use-hrefs', () => {
    const mockDate = 1694516945008

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValueOnce(mockDate)
    })

    it('should generate correct urls', () => {
        const result = useHrefs({
            endpoint: '/dataAnalysis/validationRules/report',
            fileTypes: ['pdf', 'xls', 'csv'],
            queryStr: undefined,
        })
        expect(result.csv).toMatch(
            `https://debug.dhis2.org/dev/api/41/dataAnalysis/validationRules/report.csv?t=${mockDate}`
        )
        expect(result.pdf).toEqual(
            `https://debug.dhis2.org/dev/api/41/dataAnalysis/validationRules/report.pdf?t=${mockDate}`
        )
        expect(result.xls).toEqual(
            `https://debug.dhis2.org/dev/api/41/dataAnalysis/validationRules/report.xls?t=${mockDate}`
        )
    })
    it('should generate correct urls even if endpoint does not start with slash', () => {
        const result = useHrefs({
            endpoint: 'dataAnalysis/validationRules/report',
            fileTypes: ['pdf', 'xls', 'csv'],
            queryStr: undefined,
        })
        expect(result.csv).toMatch(
            `https://debug.dhis2.org/dev/api/41/dataAnalysis/validationRules/report.csv?t=${mockDate}`
        )
        expect(result.pdf).toEqual(
            `https://debug.dhis2.org/dev/api/41/dataAnalysis/validationRules/report.pdf?t=${mockDate}`
        )
        expect(result.xls).toEqual(
            `https://debug.dhis2.org/dev/api/41/dataAnalysis/validationRules/report.xls?t=${mockDate}`
        )
    })
    it('should generate correct urls even when passed query string', () => {
        const result = useHrefs({
            endpoint: 'dataAnalysis/validationRules/report',
            fileTypes: ['pdf', 'xls', 'csv'],
            queryStr: 'locale=fr',
        })
        expect(result.csv).toMatch(
            'https://debug.dhis2.org/dev/api/41/dataAnalysis/validationRules/report.csv?locale=fr'
        )
    })
})
