/* eslint-disable */
import React from 'react'
import { mount, shallow } from 'enzyme'
import ValidationRulesAnalysisTable from '../validation-rules-analysis-table/ValidationRulesAnalysisTable'
import { MuiThemeProvider, TableRow, TableRowColumn } from 'material-ui'
import ValidationRulesDetails from '../validation-rules-details/ValidationRulesDetails'
import DownloadAs from '../../../components/download-as/DownloadAs'

jest.mock(
    'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes',
    () => 'FeedbackSnackbarTypes'
)
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => 'OrgUnitTree')

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
        //attributeOptionCombo: 'default'
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
        organisationUnitId: 'OrgUnitkgh54Xb9LSS',
        //attributeOptionCombo: 'default'
    },
]

const rulesElementsWithAttrOptCombos = [
    {
        attributeOptionCombo: 'default',
        attributeOptionComboId: 'HllvX50cXC0',
        importance: 'MEDIUM',
        key: 'SxwKDzs5Rlb-202010-rZxk3S0qN63-HllvX50cXC0',
        leftValue: 11,
        operator: '==',
        organisation: 'Bo Govt. Hosp.',
        organisationUnitId: 'rZxk3S0qN63',
        period: 'October 2020',
        periodId: '202010',
        rightValue: 5,
        validationRule: 'ART stage 1 = stage 2',
        validationRuleId: 'SxwKDzs5Rlb',
    },
    {
        key: 'SxwKDzs5Rlb-202010-DiszpKrYNg8-vp1qSLVMSc3',
        validationRuleId: 'SxwKDzs5Rlb',
        attributeOptionCombo:
            'African Medical and Research Foundation, Provide access to basic education',
        attributeOptionComboId: 'vp1qSLVMSc3',
        organisation: 'Ngelehun CHC',
        organisationUnitId: 'DiszpKrYNg8',
        period: 'October 2020',
        periodId: '202010',
        importance: 'MEDIUM',
        validationRule: 'ART stage 1 = stage 2',
        leftValue: 23,
        operator: '==',
        rightValue: 0,
    },
]

const ownShallow = () => {
    return shallow(<ValidationRulesAnalysisTable elements={rulesElements} />, {
        disableLifecycleMethods: true,
    })
}

const withAttrOptCombos = () => {
    return shallow(
        <ValidationRulesAnalysisTable
            elements={rulesElementsWithAttrOptCombos}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}
describe('Test <ValidationRulesAnalysisTable /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('ValidationRulesAnalysisTable renders without crashing.', () => {
        ownShallow()
    })

    it('Should render correct number of rows.', () => {
        expect(wrapper.find(TableRow).length).toBe(3) // Two elements plus header row
    })

    it('Should render correct number of columns.', () => {
        expect(
            wrapper
                .find(TableRow)
                .at(1)
                .find(TableRowColumn).length
        ).toBe(8) // First row after header
    })

    it('Should render "ValidationRulesDetails" for each row.', () => {
        expect(wrapper.find(ValidationRulesDetails).length).toBe(2)
    })

    it('Render "DownloadAs" component.', () => {
        expect(wrapper.find(DownloadAs).length).toBe(2)
    })

    it('Should render attribute option combo column if not default', () => {
        expect(
            withAttrOptCombos()
                .find(TableRow)
                .at(1)
                .find(TableRowColumn).length
        ).toBe(9) // First row after header
    })
})
