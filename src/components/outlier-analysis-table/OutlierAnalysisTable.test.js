/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import OutlierAnalysisTable from './OutlierAnalysisTable';
import { Checkbox, TableRow, TableRowColumn } from 'material-ui';
import DownloadAs from '../download-as/DownloadAs';

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const response = [
    {
        dataElementId: 360075,
        periodId: 475192,
        sourceId: 642,
        categoryOptionComboId: 4,
        attributeOptionComboId: 4,
        value: '499',
        followup: false,
        min: -300,
        max: 460,
        dataElementName: 'Stock PHU dispensed OPV',
        period: {
            code: '201801',
            name: 'January 2018',
            externalAccess: false,
            displayName: 'January 2018',
            shortName: '201801',
            displayShortName: '201801',
            dimensionItemType: 'PERIOD',
            periodType: 'Monthly',
            startDate: '2018-01-01T00:00:00.000',
            endDate: '2018-01-31T00:00:00.000',
            dimensionItem: '201801',
            favorite: false,
            id: '201801',
        },
        sourceName: 'Kaniya MCHP',
        categoryOptionComboName: 'default'
    }, {
        dataElementId: 360075,
        periodId: 1149704,
        sourceId: 642,
        categoryOptionComboId: 4,
        attributeOptionComboId: 4,
        value: '499',
        comment: '',
        followup: false,
        min: -300,
        max: 460,
        dataElementName: 'Stock PHU dispensed OPV',
        period: {
            code: '201701',
            name: 'January 2017',
            externalAccess: false,
            displayName: 'January 2017',
            shortName: '201701',
            displayShortName: '201701',
            dimensionItemType: 'PERIOD',
            periodType: 'Monthly',
            startDate: '2017-01-01T00:00:00.000',
            endDate: '2017-01-31T00:00:00.000',
            dimensionItem: '201701',
            favorite: false,
            id: '201701'
        },
        sourceName: 'Kaniya MCHP',
        categoryOptionComboName: 'default'
    },
];

const testElements = response.map(OutlierAnalysisTable.convertElementFromApiResponse);

const expectedElementFormat = {
    attributeOptionComboId: 4,
    categoryOptionComboId: 4,
    dataElement: 'Stock PHU dispensed OPV',
    dataElementId: 360075,
    key: '4-4-475192-642-360075',
    marked: false,
    max: 460,
    min: -300,
    organisation: 'Kaniya MCHP',
    organisationUnitId: 642,
    period: 'January 2018',
    periodId: 475192,
    value: 499,
};

const expectedToggleFollowupRequest = {
    attributeOptionComboId: 4,
    categoryOptionComboId: 4,
    dataElementId: 360075,
    followup: true,
    organisationUnitId: 642,
    periodId: 475192,
};

const ownShallow = () => {
    return shallow(
        <OutlierAnalysisTable
            elements={testElements}
            toggleCheckbox={jest.fn()}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <OutlierAnalysisTable /> rendering:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('OutlierAnalysisTable renders without crashing.', () => {
        ownShallow();
    });

    it('Should render correct number of rows.', () => {
        expect(wrapper.find(TableRow).length).toBe(3); // Two elements plus header row
    });

    it('Should render correct number of columns.', () => {
        expect(wrapper.find(TableRow).at(1).find(TableRowColumn).length).toBe(7); // First row after header
    });

    it('Should render a Mark "Checkbox" for each element.', () => {
        expect(wrapper.find(Checkbox).length).toBe(2);
    });

    it('Render "DownloadAs" components.', () => {
        expect(wrapper.find(DownloadAs).length).toBe(2);
    });

});

describe('Test <OutlierAnalysisTable /> actions:', () => {

    it('Should correctly convert elements from API response.', () => {
        const element = OutlierAnalysisTable.convertElementFromApiResponse(response[0]);
        expect(element).toEqual(expectedElementFormat);
    });

    it('Should correctly convert elements to Mark request.', () => {
        const element = OutlierAnalysisTable.convertElementToToggleFollowupRequest(testElements[0]);
        expect(element).toEqual(expectedToggleFollowupRequest);
    });

    it('Should correctly generateElementKey.', () => {
        const element = OutlierAnalysisTable.generateElementKey(response[0]);
        const responseElement = response[0];
        expect(element).toBe(`${responseElement.attributeOptionComboId}-`+
            `${responseElement.categoryOptionComboId}-`+
            `${responseElement.periodId}-`+
            `${responseElement.sourceId}-`+
            `${responseElement.dataElementId}`);
    });

});
