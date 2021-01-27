/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'
import OutlierAnalysisTable from './OutlierAnalysisTable'
import { Checkbox, TableRow, TableRowColumn } from 'material-ui'
import DownloadAs from '../download-as/DownloadAs'

jest.mock(
    'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes',
    () => 'FeedbackSnackbarTypes'
)
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => 'OrgUnitTree')

const response = [
    {
        absDev: 7512.666666666667,
        aoc: 'HllvX50cXC0',
        aocName: 'default',
        coc: 'HllvX50cXC0',
        cocName: 'default',
        de: 'p1MDHOT6ENy',
        deName: 'Stock PHU dispensed  BCG',
        followUp: false,
        lowerBound: -6093.141742038514,
        mean: 702.3333333333334,
        ou: 'ApLCxUmnT6q',
        ouName: 'Maborie MCHP',
        pe: '202010',
        stdDev: 2265.1583584572822,
        upperBound: 7497.80840870518,
        value: 8215,
        zScore: 3.31661874262216,
    },
    {
        absDev: 5538.909090909091,
        aoc: 'HllvX50cXC0',
        aocName: 'default',
        coc: 'pq2XI5kz2BY',
        cocName: 'Fixed',
        de: 'rbkr8PL0rwM',
        deName: 'Iron Folate given at ANC 3rd',
        followUp: false,
        lowerBound: -4454.381991130682,
        mean: 887.0909090909091,
        ou: 'el8sgzyHuEe',
        ouName: 'Rosint Buya MCHP',
        pe: '202010',
        stdDev: 1780.4909667405302,
        upperBound: 6228.5638093125,
        value: 6426,
        zScore: 3.1108886225067116,
    },
]

const testElements = response.map(
    OutlierAnalysisTable.convertElementFromApiResponse
)

const expectedElementFormat = {
    absDev: 7512.666666666667,
    aoc: 'HllvX50cXC0',
    aocName: 'default',
    coc: 'HllvX50cXC0',
    cocName: 'default',
    de: 'p1MDHOT6ENy',
    deName: 'Stock PHU dispensed  BCG',
    displayName: 'Stock PHU dispensed  BCG',
    followUp: false,
    key: 'HllvX50cXC0-HllvX50cXC0-p1MDHOT6ENy-202010-ApLCxUmnT6q',
    lowerBound: -6093.141742038514,
    marked: false,
    mean: 702.3333333333334,
    ou: 'ApLCxUmnT6q',
    ouName: 'Maborie MCHP',
    pe: '202010',
    stdDev: 2265.1583584572822,
    upperBound: 7497.80840870518,
    value: 8215,
    zScore: 3.31661874262216,
}

const expectedToggleFollowupRequest = {
    attributeOptionComboId: 4,
    categoryOptionComboId: 4,
    dataElementId: 360075,
    followup: true,
    organisationUnitId: 642,
    periodId: 475192,
}

const ownShallow = () => {
    return shallow(
        <OutlierAnalysisTable
            elements={testElements}
            toggleCheckbox={jest.fn()}
            csvQueryStr="ds=1&ds=2&ou=1&ou=2"
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

describe('Test <OutlierAnalysisTable /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('OutlierAnalysisTable renders without crashing.', () => {
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
        ).toBe(7) // First row after header
    })

    // it('Should render a Mark "Checkbox" for each element.', () => {
    //     expect(wrapper.find(Checkbox).length).toBe(2)
    // })

    it('Render "DownloadAs" components.', () => {
        expect(wrapper.find(DownloadAs).length).toBe(2)
    })
})

describe('Test <OutlierAnalysisTable /> actions:', () => {
    it('Should correctly convert elements from API response.', () => {
        const element = OutlierAnalysisTable.convertElementFromApiResponse(
            response[0]
        )
        expect(element).toEqual(expectedElementFormat)
    })

    // it('Should correctly convert elements to Mark request.', () => {
    //     const element = OutlierAnalysisTable.convertElementToToggleFollowupRequest(
    //         testElements[0]
    //     )
    //     expect(element).toEqual(expectedToggleFollowupRequest)
    // })

    it('Should correctly generateElementKey.', () => {
        const element = OutlierAnalysisTable.generateElementKey(response[0])
        const responseElement = response[0]
        expect(element).toBe(
            `${responseElement.attributeOptionComboId}-` +
                `${responseElement.categoryOptionComboId}-` +
                `${responseElement.periodId}-` +
                `${responseElement.sourceId}-` +
                `${responseElement.dataElementId}`
        )
    })
})
