/* eslint-disable */
/* React and Enzyme */
import React from 'react';
import {shallow} from 'enzyme';

/* Material UI */
import {RaisedButton, IconButton} from 'material-ui';
import DatePicker from 'material-ui/DatePicker';

/* Components */
import PageHelper from '../../components/page-helper/PageHelper';
import AlertBar from '../../components/alert-bar/AlertBar';
import FollowUpAnalysis from './FollowUpAnalysis';
import FollowUpAnalysisTable from './follow-up-analysis-table/FollowUpAnalysisTable';
import AvailableOrganisationUnitsTree from
        '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import DatasetsForOrganisationUnitSelect, {
    ALL_DATA_SETS_OPTION_ID
} from
        '../../components/datasets-for-organisation-unit-select/DatasetsForOrganisationUnitSelect';

/* helpers */
import {FOLLOW_UP_ANALYSIS_SECTION_KEY} from '../sections.conf';
import {i18nKeys} from '../../i18n';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const ownShallow = () => {
    return shallow(
        <FollowUpAnalysis
            sectionKey={FOLLOW_UP_ANALYSIS_SECTION_KEY}
            updateFeedbackState={jest.fn()}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <FollowUpAnalysis /> rendering:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Followup Analysis renders without crashing', () => {
        ownShallow();
    });

    it('Should show correct title.', () => {
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(wrapper.find('h1').text()).toBe(`<IconButton />${i18nKeys.followUpAnalysis.header}<PageHelper />`);
    });

    it('Followup Analysis renders an IconButton', () => {
        expect(wrapper.find(IconButton)).toHaveLength(1);
    });

    it('Should have an "AlertBar" component.', () => {
        expect(wrapper.find(AlertBar)).toHaveLength(1);
    });

    it('Should have an "PageHelper" component.', () => {
        expect(wrapper.find(PageHelper)).toHaveLength(1);
    });

    it('Should render an "AvailableOrganisationUnitsTree" component.', () => {
        expect(wrapper.find(AvailableOrganisationUnitsTree)).toHaveLength(1);
    });

    it('Should render an "DatasetsForOrganisationUnitSelect" component.', () => {
        expect(wrapper.find(DatasetsForOrganisationUnitSelect)).toHaveLength(1);
    });

    it('Renders a "Start Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).at(0).props().floatingLabelText).toBe(i18nKeys.followUpAnalysis.form.startDate);
    });

    it('Renders a "End Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).at(1).props().floatingLabelText).toBe(i18nKeys.followUpAnalysis.form.endDate);
    });

    it('Should not render a "FollowUpAnalysisTable" component when has no elements.', () => {
        const elements = [];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(IconButton).props().style.display).toBe('none');
        expect(wrapper.find(FollowUpAnalysisTable)).toHaveLength(1);
        expect(wrapper.find(FollowUpAnalysisTable).parent().props().style.display).toBe('none');
        expect(wrapper.state('showTable')).toBeFalsy();
    });

    it('Should show "FollowUpAnalysisTable" component and back icon when has elements.', () => {
        const elements = ['one', 'two', 'three'];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(IconButton).props().style.display).toBe('inline');
        expect(wrapper.find(FollowUpAnalysisTable)).toHaveLength(1);
        expect(wrapper.find(FollowUpAnalysisTable).parent().props().style.display).toBe('block');
        expect(wrapper.state('showTable')).toBeTruthy();
    });

    it('Followup Analysis renders a disabled "Follow Up" RaisedButton', () => {
        wrapper.setState({
            organisationUnitId: null,
            startDate: null,
            endDate: null,
            dataSetId: ALL_DATA_SETS_OPTION_ID,
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeTruthy();
        expect(wrapper.instance().isActionDisabled()).toBeTruthy();
    });

    it('Should render an active "Follow Up" RaisedButton when selected filters.', () => {
        wrapper.setState({
            organisationUnitId: 'TestOrganisationUnitId',
            startDate: new Date(),
            endDate: new Date(),
            dataSetId: ALL_DATA_SETS_OPTION_ID,
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeFalsy();
        expect(wrapper.instance().isActionDisabled()).toBeFalsy();
    });

});

describe('Test <FollowUpAnalysis /> actions:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should call organisationUnitChanged function when Available Organisation Units Tree changes.', () => {
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

    it('Should call dataSetOnChange function when DatasetsForOrganisationUnitSelect changes.', () => {
        wrapper.setState({
            dataSetId: null,
        });
        wrapper.find(DatasetsForOrganisationUnitSelect).at(0).simulate('change', null, null, 'TestDataSetId');
        expect(wrapper.state('dataSetId')).toBe('TestDataSetId');
    });

    it('Followup Analysis calls back method when IconButton (back) is clicked', () => {
        wrapper.instance().back = jest.fn();
        const elements = ['one', 'two', 'three'];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        wrapper.find(IconButton).simulate('click');
        expect(wrapper.instance().back).toHaveBeenCalled();
    });

    it('Followup Analysis calls getFollowUpList method when RaisedButton is clicked', () => {
        wrapper.instance().getFollowUpList = jest.fn();
        wrapper.setState({
            organisationUnitId: 'TestOrganisationUnitId',
            startDate: new Date(),
            endDate: new Date(),
            dataSetId: ALL_DATA_SETS_OPTION_ID,
        });
        wrapper.find("#start-analysis-button").simulate('click');
        expect(wrapper.instance().getFollowUpList).toHaveBeenCalled();
    });

    it('Followup Analysis update state when back button is clicked', () => {
        wrapper.setState({showTable: true});
        wrapper.find(IconButton).simulate('click');
        expect(wrapper.state('showTable')).toBeFalsy();
    });

    it('Should change element marked state when toggleCheckbox is called.', () => {
        wrapper.setState({
            elements: [
                {
                    key: 'key1',
                    marked: false,
                },
                {
                    key: 'key2',
                    marked: false,
                }
            ]
        });
        wrapper.instance().toggleCheckbox({key: 'key1'});
        expect(wrapper.state('elements')[0].marked).toBe(true);
    });

});
