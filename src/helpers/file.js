import i18n from '@dhis2/d2-i18n';
import { writeFile, utils } from 'xlsx';
/**
 * Get XLSX data
 */
export const downloadXlsxFile =(rows) =>{
    const mappedRows = rows?.map((row)=>({
        MKAAward: row.aocName,
        MKAAwardUid: row.aoc,
        OrgUnitName: row.ouName,
        OrgUnitNameUid: row.ou,
        DataElementDisplayName: row.displayName,
        DataElementName: row.deName,
        DataElementUid: row.de,
        DisaggregationName: row.cocName,
        DisaggregationUid: row.coc,
        Period: row.pe,
        Value: row.value,
        Deviation: new Intl.NumberFormat(i18n.language, {
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        }).format(row.absDev),
        Mean: new Intl.NumberFormat(i18n.language, {
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        }).format(row.mean),
        StdDev: new Intl.NumberFormat(i18n.language, {
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        }).format(row.stdDev),
        ZScore: new Intl.NumberFormat(i18n.language, {
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        }).format(row.zScore),
        Min: new Intl.NumberFormat(i18n.language, {
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        }).format(row.lowerBound),
        Max: new Intl.NumberFormat(i18n.language, {
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        }).format(row.upperBound),
        FollowUp: row.marked
    }));
    /* generate worksheet and workbook */
    const worksheet = utils.json_to_sheet(mappedRows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(workbook, "validationData.xlsx");
}
