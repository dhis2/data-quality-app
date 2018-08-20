/* eslint-disable */
/* React and Enzyme */
import React from 'react';
import {shallow} from 'enzyme';

/* Material UI */
import {RaisedButton, IconButton} from 'material-ui';
import DatePicker from 'material-ui/DatePicker';

/* Components */
import MinMaxOutlierAnalysis from './MinMaxOutlierAnalysis';
import OutlierAnalyisTable from '../../components/outlier-analysis-table/OutlierAnalysisTable';
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect';
import AvailableOrganisationUnitsTree from "../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree";
import AlertBar from '../../components/alert-bar/AlertBar';
import PageHelper from '../../components/page-helper/PageHelper';

/* helpers */
import {MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY} from '../sections.conf';
import {i18nKeys} from '../../i18n';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const ownShallow = () => {
    return shallow(
        <MinMaxOutlierAnalysis
            sectionKey={MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY}
            updateFeedbackState={jest.fn()}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <MinMaxOutlierAnalysis /> rendering:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Min Max Outlier Analysis renders without crashing', () => {
        ownShallow();
    });

    it('Should show correct title.', () => {
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(wrapper.find('h1').text()).toBe(`<IconButton />${i18nKeys.minMaxOutlierAnalysis.header}<PageHelper />`);
    });

    it('Min Max Outlier Analysis renders an IconButton', () => {
        expect(wrapper.find(IconButton)).toHaveLength(1);
    });

    it('Should have an "AlertBar" component.', () => {
        expect(wrapper.find(AlertBar)).toHaveLength(1);
    });

    it('Should have an "PageHelper" component.', () => {
        expect(wrapper.find(PageHelper)).toHaveLength(1);
    });

    it('Should render an "AvailableDatasetsSelect" component.', () => {
        expect(wrapper.find(AvailableDatasetsSelect)).toHaveLength(1);
    });

    it('Should render an "AvailableOrganisationUnitsTree" component.', () => {
        expect(wrapper.find(AvailableOrganisationUnitsTree)).toHaveLength(1);
    });

    it('Renders a "Start Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).length).toBe(2);
        expect(wrapper.find(DatePicker).at(0).props().floatingLabelText).toBe(i18nKeys.minMaxOutlierAnalysis.form.startDate);
    });

    it('Renders a "End Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).length).toBe(2);
        expect(wrapper.find(DatePicker).at(1).props().floatingLabelText).toBe(i18nKeys.minMaxOutlierAnalysis.form.endDate);
    });

    it('Should not render a OutlierAnalyisTable when has no elements.', () => {
        const elements = [];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(IconButton).props().style.display).toBe('none');
        expect(wrapper.find(OutlierAnalyisTable)).toHaveLength(1);
        expect(wrapper.find(OutlierAnalyisTable).parent().props().style.display).toBe('none');
        expect(wrapper.state('showTable')).toBeFalsy();
    });

    it('Should show "OutlierAnalyisTable" component and back icon when has elements.', () => {
        const elements = ['one', 'two', 'three'];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(IconButton).props().style.display).toBe('inline');
        expect(wrapper.find(OutlierAnalyisTable)).toHaveLength(1);
        expect(wrapper.find(OutlierAnalyisTable).parent().props().style.display).toBe('block');
        expect(wrapper.state('showTable')).toBeTruthy();
    });

    it('Renders a disabled "Start" RaisedButton when loading info.', () => {
        wrapper.setState({
            loading: true,
            endDate: new Date(),
            startDate: new Date(),
            organisationUnitId: 'TestOrganisationUnitId',
            dataSetIds: ['id1', 'id2', 'id3'],
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeTruthy();
        expect(wrapper.instance().isActionDisabled()).toBeTruthy();
    });

    it('Renders a disabled "Start" RaisedButton when no filter selected.', () => {
        wrapper.setState({
            endDate: null,
            startDate: null,
            organisationUnitId: null,
            dataSetIds: null,
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeTruthy();
        expect(wrapper.instance().isActionDisabled()).toBeTruthy();
    });

    it('Renders a enabled "Start" RaisedButton when filters selected.', () => {
        wrapper.setState({
            loading: false,
            endDate: new Date(),
            startDate: new Date(),
            organisationUnitId: 'TestOrganisationUnitId',
            dataSetIds: ['id1', 'id2', 'id3'],
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeFalsy();
        expect(wrapper.instance().isActionDisabled()).toBeFalsy();
    });

});

describe('Test <MinMaxOutlierAnalysis /> actions:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should call dataSetsOnChange function when Available Datasets Select changes.', () => {
        wrapper.setState({
            dataSetIds: [],
        });
        wrapper.find(AvailableDatasetsSelect)
            .simulate('change', {
                target: {
                    selectedOptions: [{value: 'id1'}, {value: 'id2'}],
                }
            });
        expect(wrapper.state('dataSetIds')).toMatchObject(['id1', 'id2']);
    });

    it('Should call organisationUnitOnChange function when Available Organisation Units Tree changes.', () => {
        wrapper.setState({
            organisationUnitId: null,
        });
        wrapper.find(AvailableOrganisationUnitsTree).simulate('change', 'TestOrganisationUnitId');
        expect(wrapper.state('organisationUnitId')).toBe('TestOrganisationUnitId');
    });

    it('Should call startDateOnChange function when Start Date DatePicker changes.', () => {
        const testStartDate = new Date();
        wrapper.setState({
            startDate: null,
        });
        wrapper.find(DatePicker).at(0).simulate('change', null, testStartDate);
        expect(wrapper.state('startDate')).toMatchObject(testStartDate);
    });

    it('Should call endDateOnChange function when End Date DatePicker changes.', () => {
        const testEndDate = new Date();
        wrapper.setState({
            endDate: null,
        });
        wrapper.find(DatePicker).at(1).simulate('change', null, testEndDate);
        expect(wrapper.state('endDate')).toMatchObject(testEndDate);
    });

    it('Min Max Outlier Analysis calls back method when IconButton (back) is clicked', () => {
        wrapper.instance().back = jest.fn();
        const elements = ['one', 'two', 'three'];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        wrapper.find(IconButton).simulate('click');
        expect(wrapper.instance().back).toHaveBeenCalled();
    });

    it('Min Max Outlier Analysis calls start method when RaisedButton is clicked', () => {
        wrapper.instance().start = jest.fn();
        wrapper.setState({
            loading: false,
            endDate: new Date(),
            startDate: new Date(),
            organisationUnitId: 'TestOrganisationUnitId',
            dataSetIds: ['id1', 'id2', 'id3'],
        });
        wrapper.find("#start-analysis-button").simulate('click');
        expect(wrapper.instance().start).toHaveBeenCalled();
    });

    it('Min Max Outlier Analysis update state when back button is clicked', () => {
        const wrapper = ownShallow();
        wrapper.setState({showTable: true});
        wrapper.find(IconButton).simulate('click');
        expect(wrapper.state('showTable')).toBe(false);
    });
});
