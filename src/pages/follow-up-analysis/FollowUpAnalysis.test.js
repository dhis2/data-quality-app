/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { RaisedButton, IconButton, DatePicker } from 'material-ui';

import FollowUpAnalysis from './FollowUpAnalysis';
import FollowUpAnalysisTable from './follow-up-analysis-table/FollowUpAnalysisTable';

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));

import {
  sections,
  FOLLOW_UP_ANALYSIS_SECTION_KEY,
} from '../sections.conf';
import PageHelper from '../../components/page-helper/PageHelper';
import AlertBar from '../../components/alert-bar/AlertBar';
import AvailableOrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import DatasetsForOrganisationUnitSelect from '../../components/datasets-for-organisation-unit-select/DatasetsForOrganisationUnitSelect';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
  const section = sections[i];
  if (section.key === FOLLOW_UP_ANALYSIS_SECTION_KEY) {
    pageInfo = section.info;
    break;
  }
}

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const ownShallow = () => {
  return shallow(
      <FollowUpAnalysis
          sectionKey={FOLLOW_UP_ANALYSIS_SECTION_KEY}
          pageInfo={pageInfo}
      />,
      {
        context: {
          updateAppState: jest.fn(),
          translator: (key) => key,
        },
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

    it('Should show correct title.', () =>{
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(wrapper.find('h1').text()).toBe('<IconButton />Follow-Up Analysis<PageHelper />');
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
        expect(wrapper.find(DatePicker).at(0).props().floatingLabelText).toBe('Start Date');
    });

    it('Renders a "End Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).at(1).props().floatingLabelText).toBe('End Date');
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

    it('Followup Analysis renders a disabled "Follow Up" RaisedButton', () => {
        wrapper.setState({
            organisationUnitId: null,
            startDate: null,
            endDate: null,
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
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeFalsy();
        expect(wrapper.instance().isActionDisabled()).toBeFalsy();
    });

});

describe('Test <FollowUpAnalysis /> actions:', () => {

    it('Should call organisationUnitChanged function when Available Organisation Units Tree changes.', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'organisationUnitChanged').and.callThrough();
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

    it('Should call dataSetOnChange function when DatasetsForOrganisationUnitSelect changes.', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'dataSetOnChange').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            dataSetId: null,
        });
        wrapper.find(DatasetsForOrganisationUnitSelect).at(0).simulate('change', null, null, 'TestDataSetId');
        expect(spy).toHaveBeenCalledWith(null, null, 'TestDataSetId');
        expect(wrapper.state('dataSetId')).toBe('TestDataSetId');
    });

    it('Followup Analysis calls back method when IconButton (back) is clicked', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'back');
        const wrapper = ownShallow();
        wrapper.find(IconButton).simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Followup Analysis calls start method when RaisedButton is clicked', () => {
        const spy = spyOn(FollowUpAnalysis.prototype, 'getFollowUpList');
        const wrapper = ownShallow();
        wrapper.find(RaisedButton).simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Standard Dev Outlier Analysis update state when back button is clicked', () => {
        const wrapper = ownShallow();
        wrapper.setState({ showTable: true });
        wrapper.find(IconButton).simulate('click');
        expect(wrapper.state('showTable')).toBe(false);
    });

});
