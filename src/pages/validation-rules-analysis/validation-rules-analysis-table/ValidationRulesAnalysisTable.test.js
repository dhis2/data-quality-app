/* eslint-disable */
import React from 'react';
import { mount, shallow } from 'enzyme';

import ValidationRulesAnalysisTable from '../validation-rules-analysis-table/ValidationRulesAnalysisTable';
import { MuiThemeProvider, TableRow, TableRowColumn } from 'material-ui';
import ValidationRulesDetails from '../validation-rules-details/ValidationRulesDetails';
import DownloadAs from '../../../components/download-as/DownloadAs';

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const rulesElements = [
    {
        key: 'kone',
        organisation: 'Ngieyehun MCHP',
        importance: 'MEDIUM',
        leftValue: 10,
        operator: '>',
        rightValue: 10,
        period: 'January 2017',
        periodId: '201701',
        validationRule: 'Malaria outbrek',
        validationRuleId: 'kgh54Xb9LSE',
        organisationUnitId: 'OrgUnitkgh54Xb9LSE',
    },
    {
        key: 'ktwo',
        organisation: 'Mattru on the Rail MCHP',
        importance: 'MEDIUM',
        leftValue: 14,
        operator: '>',
        rightValue: 9,
        period: 'February 2017',
        periodId: '201702',
        validationRule: 'Malaria outbrek',
        validationRuleId: 'kgh54Xb9LSS',
        organisationUnitId: 'OrgUnitkgh54Xb9LSS'
    },
]


const ownShallow = () => {
    return shallow(
        <ValidationRulesAnalysisTable
            elements={rulesElements}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <ValidationRulesAnalysisTable /> rendering:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('ValidationRulesAnalysisTable renders without crashing.', () => {
        ownShallow();
    });

    it('Should render correct number of rows.', () => {
        expect(wrapper.find(TableRow).length).toBe(3); // Two elements plus header row
    });

    it('Should render correct number of columns.', () => {
        expect(wrapper.find(TableRow).at(1).find(TableRowColumn).length).toBe(8); // First row after header
    });

    it('Should render "ValidationRulesDetails" for each row.', () => {
        expect(wrapper.find(ValidationRulesDetails).length).toBe(2);
    });

    it('Render "DownloadAs" component.', () => {
        expect(wrapper.find(DownloadAs).length).toBe(2);
    });

});
