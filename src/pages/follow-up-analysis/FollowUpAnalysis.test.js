/* eslint-disable */
/* React and Enzyme */
import React from 'react';
import { shallow } from 'enzyme';

/* Material UI */
import { RaisedButton, IconButton } from 'material-ui';
import DatePicker from 'material-ui/DatePicker';

/* React components */
import PageHelper from '../../components/page-helper/PageHelper';
import AlertBar from '../../components/alert-bar/AlertBar';
import FollowUpAnalysis from './FollowUpAnalysis';
import FollowUpAnalysisTable from './follow-up-analysis-table/FollowUpAnalysisTable';
import AvailableOrganisationUnitsTree from
        '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect';

import {
    sections,
    FOLLOW_UP_ANALYSIS_SECTION_KEY,
} from '../sections.conf';

/* helpers */
import { i18nKeys } from '../../i18n';
import MinMaxOutlierAnalysis from '../min-max-outlier-analysis/MinMaxOutlierAnalysis';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === FOLLOW_UP_ANALYSIS_SECTION_KEY) {
        pageInfo = section.info;
        break;
    }
}

const ownShallow = () => {
    return shallow(
        <FollowUpAnalysis
            sectionKey={FOLLOW_UP_ANALYSIS_SECTION_KEY}
            pageInfo={pageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
            },
            disableLifecycleMethods: true
        }
    );
};

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

describe('Test <FollowUpAnalysis /> rendering:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Followup Analysis renders without crashing', () => {
        ownShallow();
    });

    it('Should show correct title.', () =>{
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

    it('Should render an "AvailableDatasetsSelect" component.', () => {
        expect(wrapper.find(AvailableDatasetsSelect)).toHaveLength(1);
    });

    it('Should render an "AvailableOrganisationUnitsTree" component.', () => {
        expect(wrapper.find(AvailableOrganisationUnitsTree)).toHaveLength(1);
    });

    it('Renders a "Start Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).length).toBe(2);
        expect(wrapper.find(DatePicker).at(0).props().floatingLabelText).toBe(i18nKeys.followUpAnalysis.form.startDate);
    });

    it('Renders a "End Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).length).toBe(2);
        expect(wrapper.find(DatePicker).at(1).props().floatingLabelText).toBe(i18nKeys.followUpAnalysis.form.endDate);
    });

    it('Should not render a "FollowUpAnalysisTable" component when has no elements.' , () => {
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

    it('Followup Analysis renders a disabled "Follow Up" RaisedButton', () => {
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

    it('Should render an active "Follow Up" RaisedButton when selected filters.', () => {
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

describe('Test <FollowUpAnalysis /> actions:', () => {

    it('Should call dataSetsOnChange function when Available Datasets Select changes.', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'dataSetsOnChange').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            dataSetIds: [],
        });
        wrapper.find(AvailableDatasetsSelect)
            .simulate('change',{
                target: {
                    selectedOptions: [{ value:'id1' }, { value:'id2' }],
                }
            });
        expect(spy).toHaveBeenCalledWith({
            target: {
                selectedOptions: [{ value:'id1' }, { value:'id2' }],
            }
        });
        expect(wrapper.state('dataSetIds')).toMatchObject(['id1', 'id2']);
    });

    it('Should call organisationUnitOnChange function when Available Organisation Units Tree changes.', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'organisationUnitOnChange').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            organisationUnitId: null,
        });
        wrapper.find(AvailableOrganisationUnitsTree).simulate('change', 'TestOrganisationUnitId');
        expect(spy).toHaveBeenCalledWith('TestOrganisationUnitId');
        expect(wrapper.state('organisationUnitId')).toBe('TestOrganisationUnitId');
    });

    it('Should call startDateOnChange function when Start Date DatePicker changes.', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'startDateOnChange').and.callThrough();
        const wrapper = ownShallow();
        const testStartDate  = new Date();
        wrapper.setState({
            startDate: null,
        });
        wrapper.find(DatePicker).at(0).simulate('change', null, testStartDate);
        expect(spy).toHaveBeenCalledWith(null, testStartDate);
        expect(wrapper.state('startDate')).toMatchObject(testStartDate);
    });

    it('Should call endDateOnChange function when End Date DatePicker changes.', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'endDateOnChange').and.callThrough();
        const wrapper = ownShallow();
        const testEndDate  = new Date();
        wrapper.setState({
            endDate: null,
        });
        wrapper.find(DatePicker).at(1).simulate('change', null, testEndDate);
        expect(spy).toHaveBeenCalledWith(null, testEndDate);
        expect(wrapper.state('endDate')).toMatchObject(testEndDate);
    });

    it('Followup Analysis calls back method when IconButton (back) is clicked', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'back');
        const wrapper = ownShallow();
        wrapper.find(IconButton).simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Followup Analysis calls getFollowUpList method when RaisedButton is clicked', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'getFollowUpList');
        const wrapper = ownShallow();
        wrapper.find(RaisedButton).simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Followup Analysis update state when back button is clicked', () => {
        const wrapper = ownShallow();
        wrapper.setState({ showTable: true });
        wrapper.find(IconButton).simulate('click');
        expect(wrapper.state('showTable')).toBe(false);
    });

    it('Should change element marked state when toggleCheckbox is called.', () => {
        const wrapper = ownShallow();
        wrapper.setState({
            elements: [
                {
                    key: 'key1',
                    marked: false,
                },
                {
                    key: 'key2',
                    marked: false ,
                }
            ]
        });
        wrapper.instance().toggleCheckbox({ key: 'key1' });
        expect(wrapper.state('elements')[0].marked).toBe(true);
    });

});
