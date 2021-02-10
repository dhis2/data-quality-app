/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'
import { RaisedButton, IconButton } from 'material-ui'
import DatePicker from 'material-ui/DatePicker'
import SelectField from 'material-ui/SelectField'
import OutlierDetection, {
    DEFAULT_ALGORITHM,
    DEFAULT_STANDARD_DEVIATION,
    DEFAULT_THRESHOLD,
} from './OutlierDetection'
import OutlierAnalyisTable from '../../components/outlier-analysis-table/OutlierAnalysisTable'
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect'
import AvailableOrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree'
import { sections, OUTLIER_DETECTION_SECTION_KEY } from '../sections.conf'
import AlertBar from '../../components/alert-bar/AlertBar'
import PageHelper from '../../components/page-helper/PageHelper'

let pageInfo = {}
for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === OUTLIER_DETECTION_SECTION_KEY) {
        pageInfo = section.info
        break
    }
}

const ownShallow = () => {
    return shallow(
        <OutlierDetection
            sectionKey={OUTLIER_DETECTION_SECTION_KEY}
            pageInfo={pageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
            },
            disableLifecycleMethods: true,
        }
    )
}

/* Mocks */
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => 'OrgUnitTree')
jest.mock(
    'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes',
    () => 'FeedbackSnackbarTypes'
)

describe('Test <OutlierDetection /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Renders without crashing', () => {
        ownShallow()
    })

    it('Should show correct title.', () => {
        expect(wrapper.find('h1')).toHaveLength(1)
        expect(wrapper.find('h1').text()).toBe(
            `<IconButton />Outlier Detection<PageHelper />`
        )
    })

    it('Renders an IconButton', () => {
        expect(wrapper.find(IconButton)).toHaveLength(1)
    })

    it('Should have an "AlertBar" component.', () => {
        expect(wrapper.find(AlertBar)).toHaveLength(1)
    })

    it('Should have an "PageHelper" component.', () => {
        expect(wrapper.find(PageHelper)).toHaveLength(1)
    })

    it('Should render an "AvailableDatasetsSelect" component.', () => {
        expect(wrapper.find(AvailableDatasetsSelect)).toHaveLength(1)
    })

    it('Should render an "AvailableOrganisationUnitsTree" component.', () => {
        expect(wrapper.find(AvailableOrganisationUnitsTree)).toHaveLength(1)
    })

    it('Renders a "Start date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).length).toBe(2)
        expect(
            wrapper
                .find(DatePicker)
                .at(0)
                .props().floatingLabelText
        ).toBe('Start date')
    })

    it('Renders a "End date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).length).toBe(2)
        expect(
            wrapper
                .find(DatePicker)
                .at(1)
                .props().floatingLabelText
        ).toBe('End date')
    })

    it('Renders an input to choose Algorithm.', () => {
        expect(wrapper.find('#algorithm').length).toBe(1)
    })

    it('Renders an input to choose Threshold.', () => {
        expect(wrapper.find('#threshold').length).toBe(1)
    })

    it('Renders an input to choose Max Results.', () => {
        expect(wrapper.find('#max-results').length).toBe(1)
    })

    it('Should not render a OutlierAnalysisTable when has no elements.', () => {
        const elements = []
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        })
        expect(wrapper.find(OutlierAnalyisTable)).toHaveLength(0)
        expect(wrapper.state('showTable')).toBeFalsy()
    })

    it('Should show "OutlierAnalysisTable" component and back icon when has elements.', () => {
        const elements = ['one', 'two', 'three']
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
            csvQueryStr: 'test',
        })
        expect(wrapper.find(IconButton)).toHaveLength(1)
        expect(wrapper.find(IconButton).props().style.display).toBe('inline')

        expect(wrapper.find(OutlierAnalyisTable)).toHaveLength(1)
        // expect(
        //     wrapper
        //         .find(OutlierAnalyisTable)
        //         .parent()
        //         .props().style.display
        // ).toBe('block')
        // expect(wrapper.state('showTable')).toBeTruthy()
    })

    it('Renders a disabled "Start" RaisedButton when loading info.', () => {
        wrapper.setState({
            loading: true,
            endDate: new Date(),
            startDate: new Date(),
            organisationUnitId: 'TestOrganisationUnitId',
            dataSetIds: ['id1', 'id2', 'id3'],
            standardDeviation: DEFAULT_STANDARD_DEVIATION,
        })
        expect(wrapper.find(RaisedButton)).toHaveLength(1)
        expect(wrapper.find(RaisedButton).props().disabled).toBeTruthy()
        expect(wrapper.instance().isActionDisabled()).toBeTruthy()
    })

    it('Renders a disabled "Start" RaisedButton when no filter selected.', () => {
        wrapper.setState({
            endDate: null,
            startDate: null,
            organisationUnitId: null,
            dataSetIds: null,
            standardDeviation: DEFAULT_STANDARD_DEVIATION,
        })
        expect(wrapper.find(RaisedButton)).toHaveLength(1)
        expect(wrapper.find(RaisedButton).props().disabled).toBeTruthy()
        expect(wrapper.instance().isActionDisabled()).toBeTruthy()
    })

    it('Renders a enabled "Start" RaisedButton when filters selected.', () => {
        wrapper.setState({
            loading: false,
            endDate: new Date(),
            startDate: new Date(),
            organisationUnitIds: ['id1'],
            dataSetIds: ['id1', 'id2', 'id3'],
            alghortim: DEFAULT_ALGORITHM,
            threshold: DEFAULT_THRESHOLD,
        })
        expect(wrapper.find(RaisedButton)).toHaveLength(1)
        expect(wrapper.find(RaisedButton).props().disabled).toBeFalsy()
        expect(wrapper.instance().isActionDisabled()).toBeFalsy()
    })
})

describe('Test <OutlierDetection /> actions:', () => {
    it('Should call dataSetsOnChange function when Available Datasets Select changes.', () => {
        const spy = spyOn(
            OutlierDetection.prototype,
            'dataSetsOnChange'
        ).and.callThrough()
        const wrapper = ownShallow()
        wrapper.setState({
            dataSetIds: [],
        })
        wrapper.find(AvailableDatasetsSelect).simulate('change', {
            target: {
                selectedOptions: [{ value: 'id1' }, { value: 'id2' }],
            },
        })
        expect(spy).toHaveBeenCalledWith({
            target: {
                selectedOptions: [{ value: 'id1' }, { value: 'id2' }],
            },
        })
        expect(wrapper.state('dataSetIds')).toMatchObject(['id1', 'id2'])
    })

    it('Should call organisationUnitOnChange function when Available Organisation Units Tree changes.', () => {
        const spy = spyOn(
            OutlierDetection.prototype,
            'organisationUnitOnChange'
        ).and.callThrough()
        const wrapper = ownShallow()
        wrapper.setState({
            organisationUnitIds: [],
        })
        const testOrganisationUnitIds = ['ID_TEST']
        wrapper
            .find(AvailableOrganisationUnitsTree)
            .simulate('change', testOrganisationUnitIds)
        expect(spy).toHaveBeenCalledWith(testOrganisationUnitIds)
        expect(wrapper.state('organisationUnitIds')).toBe(
            testOrganisationUnitIds
        )
    })

    it('Should call startDateOnChange function when Start date DatePicker changes.', () => {
        const spy = spyOn(
            OutlierDetection.prototype,
            'startDateOnChange'
        ).and.callThrough()
        const wrapper = ownShallow()
        const testStartDate = new Date()
        wrapper.setState({
            startDate: null,
        })
        wrapper
            .find(DatePicker)
            .at(0)
            .simulate('change', null, testStartDate)
        expect(spy).toHaveBeenCalledWith(null, testStartDate)
        expect(wrapper.state('startDate')).toMatchObject(testStartDate)
    })

    it('Should call endDateOnChange function when End date DatePicker changes.', () => {
        const spy = spyOn(
            OutlierDetection.prototype,
            'endDateOnChange'
        ).and.callThrough()
        const wrapper = ownShallow()
        const testEndDate = new Date()
        wrapper.setState({
            endDate: null,
        })
        wrapper
            .find(DatePicker)
            .at(1)
            .simulate('change', null, testEndDate)
        expect(spy).toHaveBeenCalledWith(null, testEndDate)
        expect(wrapper.state('endDate')).toMatchObject(testEndDate)
    })

    it('Should call thresholdOnChange function when Threshold SelectField changes.', () => {
        const spy = spyOn(
            OutlierDetection.prototype,
            'thresholdOnChange'
        ).and.callThrough()
        const wrapper = ownShallow()
        const testThreshold = 4.0
        wrapper.setState({
            threshold: DEFAULT_THRESHOLD,
        })
        wrapper.find('#threshold').simulate('change', null, null, testThreshold)
        expect(spy).toHaveBeenCalledWith(null, null, testThreshold)
        expect(wrapper.state('threshold')).toBe(testThreshold)
    })

    it('Should call back method when IconButton (back) is clicked', () => {
        const spy = spyOn(OutlierDetection.prototype, 'back')
        const wrapper = ownShallow()
        wrapper.find(IconButton).simulate('click')
        expect(spy).toHaveBeenCalled()
    })

    it('Standard Dev Outlier Analysis calls start method when RaisedButton is clicked', () => {
        const spy = spyOn(OutlierDetection.prototype, 'start')
        const wrapper = ownShallow()
        wrapper.find(RaisedButton).simulate('click')
        expect(spy).toHaveBeenCalled()
    })

    it('Should update state when back button is clicked', () => {
        const wrapper = ownShallow()
        wrapper.setState({ showTable: true })
        wrapper.find(IconButton).simulate('click')
        expect(wrapper.state('showTable')).toBe(false)
    })
})
