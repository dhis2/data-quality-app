/* eslint-disable */
/* React and Enzyme */
import React from 'react';
import { shallow } from 'enzyme';

/* Material UI */
import { RaisedButton, IconButton } from 'material-ui';
import DatePicker from 'material-ui/DatePicker';

/* React components */
import FollowUpAnalysis from './FollowUpAnalysis';
import FollowUpAnalysisTable from './follow-up-analysis-table/FollowUpAnalysisTable';
import AvailableOrganisationUnitsTree from
      '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import DatasetsForOrganisationUnitSelect, { ALL_DATA_SETS_OPTION_ID } from
      '../../components/datasets-for-organisation-unit-select/DatasetsForOrganisationUnitSelect';

/* helpers */
import { i18nKeys } from '../../i18n';

import {
  sections,
  FOLLOW_UP_ANALYSIS_SECTION_KEY,
} from '../sections.conf';
import StdDevOutlierAnalysis, {DEFAULT_STANDARD_DEVIATION} from "../std-dev-outlier-analysis/StdDevOutlierAnalysis";
import SelectField from "material-ui/SelectField/index";
import AvailableDatasetsSelect from "../../components/available-datasets-select/AvailableDatasetsSelect";

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
          translator: (key) => key,
        },
        disableLifecycleMethods: true
      }
  );
};

/* Mocks */
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

describe('Test <FollowUpAnalysis /> rendering:', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = ownShallow();
  });

  it('Renders without crashing', () => {
    ownShallow();
  });

  it('Should show correct title.', () =>{
    expect(wrapper.find('h1')).toHaveLength(1);
    expect(wrapper.find('h1').text()).toBe(`<IconButton />${i18nKeys.followUpAnalysis.header}<PageHelper />`);
  });

  it('Renders a FollowUpAnalysisTable', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(FollowUpAnalysisTable)).toHaveLength(1);
  });

  it('Renders a RaisedButton', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(RaisedButton)).toHaveLength(1);
  });

  it('Renders am IconButton', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(IconButton)).toHaveLength(1);
  });

  it('Should render an AvailableOrganisationUnitsTree component.', () => {
    expect(wrapper.find(AvailableOrganisationUnitsTree)).toHaveLength(1);
  });

  it('Should render a DatasetsForOrganisationUnitSelect component.', () => {
    expect(wrapper.find(DatasetsForOrganisationUnitSelect)).toHaveLength(1);
  });

  it('Renders a "Start Date" - DatePicker.', () => {
    expect(wrapper.find(DatePicker).at(0).props().floatingLabelText).toBe(i18nKeys.followUpAnalysis.form.startDate);
  });

  it('Renders a "End Date" - DatePicker.', () => {
    expect(wrapper.find(DatePicker).at(1).props().floatingLabelText).toBe(i18nKeys.followUpAnalysis.form.endDate);
  });

  it('Should render a disabled action button.', () => {
    wrapper.setState({
      startDate: new Date(),
      endDate: new Date(),
      organisationUnitId: null,
      dataSetId: ALL_DATA_SETS_OPTION_ID,
    });
    expect(wrapper.find(RaisedButton)).toHaveLength(1);
    expect(wrapper.find(RaisedButton).props().disabled).toBeTruthy();
    expect(wrapper.instance().isActionDisabled()).toBeTruthy();
  });

  it('Should render an active action button.', () => {
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

  it('Should not show OutlierAnalyisTable component when showTable is false.', () => {
    wrapper.setState({
      showTable: false,
    });
    expect(wrapper.find(IconButton)).toHaveLength(1);
    expect(wrapper.find(IconButton).props().style.display).toBe('none');
    expect(wrapper.find(FollowUpAnalysisTable)).toHaveLength(1);
    expect(wrapper.find(FollowUpAnalysisTable).parent().props().style.display).toBe('none');
  });

  it('Should show OutlierAnalyisTable component and back icon when showTable is true.', () => {
    wrapper.setState({
      showTable: true,
    });
    expect(wrapper.find(IconButton)).toHaveLength(1);
    expect(wrapper.find(IconButton).props().style.display).toBe('inline');
    expect(wrapper.find(FollowUpAnalysisTable)).toHaveLength(1);
    expect(wrapper.find(FollowUpAnalysisTable).parent().props().style.display).toBe('block');
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
    const spy = spyOn(FollowUpAnalysis.prototype, 'dataSetOnChange');
    const wrapper = ownShallow();
    wrapper.setState({
      dataSetId: null,
    });
    wrapper.find(DatasetsForOrganisationUnitSelect).simulate('change', null, null, 'TestDataSetId');
    expect(spy).toHaveBeenCalled();
  });

  it('Should calls getFollowUpList method when RaisedButton is clicked', () => {
    const spy = spyOn(FollowUpAnalysis.prototype, 'getFollowUpList');
    const wrapper = ownShallow();
    wrapper.find(RaisedButton).simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('Should calls back method when IconButton (back) is clicked', () => {
    const spy = spyOn(FollowUpAnalysis.prototype, 'back');
    const wrapper = ownShallow();
    wrapper.find(IconButton).simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('Should update state when back button is clicked', () => {
    const wrapper = ownShallow();
    wrapper.setState({showTable: true});
    wrapper.find(IconButton).simulate('click');
    expect(wrapper.state('showTable')).toBe(false);
  });
});
/*
it('Followup Analysis renders without crashing', () => {
  ownShallow();
});

it('Followup Analysis renders a FollowUpAnalysisTable', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(FollowUpAnalysisTable)).toHaveLength(1);
});

it('Followup Analysis renders a RaisedButton', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(RaisedButton)).toHaveLength(1);
});

it('Followup Analysis renders am IconButton', () => {
  const wrapper = ownShallow();
  expect(wrapper.find(IconButton)).toHaveLength(1);
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
  wrapper.setState({showTable: true});
  wrapper.find(IconButton).simulate('click');
  expect(wrapper.state('showTable')).toBe(false);
});
*/