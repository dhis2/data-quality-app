/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import ValidationRulesAnalysis from './ValidationRulesAnalysis';

/* helpers */
import { i18nKeys } from '../../i18n';

import {
    sections,
    VALIDATION_RULES_ANALYSIS_SECTION_KEY,
} from '../sections.conf';
import { Checkbox, DatePicker, IconButton, RaisedButton } from 'material-ui';
import ValidationRuleGroupsSelect from '../../components/validation-rule-groups-select/ValidationRuleGroupsSelect';
import ValidationRulesAnalysisTable from './validation-rules-analysis-table/ValidationRulesAnalysisTable';
import AvailableOrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import AlertBar from '../../components/alert-bar/AlertBar';
import PageHelper from '../../components/page-helper/PageHelper';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === VALIDATION_RULES_ANALYSIS_SECTION_KEY) {
        pageInfo = section.info;
        break;
    }
}

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const ownShallow = () => {
    return shallow(
        <ValidationRulesAnalysis
            sectionKey={VALIDATION_RULES_ANALYSIS_SECTION_KEY}
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

describe('Test <ValidationRulesAnalysis /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should show correct title.', () => {
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(wrapper.find('h1').text()).toBe(`<IconButton />${i18nKeys.validationRulesAnalysis.header}<PageHelper />`);
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

    it('Renders a "Start Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).at(0).props().floatingLabelText).toBe(i18nKeys.validationRulesAnalysis.form.startDate);
    });

    it('Renders a "End Date" - DatePicker.', () => {
        expect(wrapper.find(DatePicker).at(1).props().floatingLabelText).toBe(i18nKeys.validationRulesAnalysis.form.endDate);
    });

    it('Should render a "Validation Rule Group" - Select.', () => {
        expect(wrapper.find(ValidationRuleGroupsSelect)).toHaveLength(1);
    });

    it('Should render a Checkbox to choose "Send notifications".', () => {
        expect(wrapper.find(Checkbox).at(0).props().label).toBe(i18nKeys.validationRulesAnalysis.form.notification);
    });

    it('Should render a Checkbox to choose "Persist new results".', () => {
        expect(wrapper.find(Checkbox).at(1).props().label).toBe(i18nKeys.validationRulesAnalysis.form.persist);
    });

    it('Should render a disabled "Validate" button.', () => {
        wrapper.setState({
            organisationUnitId: null,
            startDate: null,
            endDate: null,
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeTruthy();
        expect(wrapper.instance().isActionDisabled()).toBeTruthy();
    });

    it('Should render an active "Validate" button.', () => {
        wrapper.setState({
            organisationUnitId: 'TestOrganisationUnitId',
            startDate: new Date(),
            endDate: new Date(),
        });
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBeFalsy();
        expect(wrapper.instance().isActionDisabled()).toBeFalsy();
    });

    it('Should not show "ValidationRulesAnalysisTable" component when has no elements.', () => {
        const elements = [];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(IconButton).props().style.display).toBe('none');
        expect(wrapper.find(ValidationRulesAnalysisTable)).toHaveLength(1);
        expect(wrapper.find(ValidationRulesAnalysisTable).parent().props().style.display).toBe('none');
        expect(wrapper.state('showTable')).toBeFalsy();
    });

    it('Should show "ValidationRulesAnalysisTable" component and back icon when has elements.', () => {
        const elements = ['one', 'two', 'three'];
        wrapper.setState({
            elements,
            showTable: elements && elements.length > 0,
        });
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(IconButton).props().style.display).toBe('inline');
        expect(wrapper.find(ValidationRulesAnalysisTable)).toHaveLength(1);
        expect(wrapper.find(ValidationRulesAnalysisTable).parent().props().style.display).toBe('block');
        expect(wrapper.state('showTable')).toBeTruthy();
    });

});

describe('Test <ValidationRulesAnalysis /> actions:', () => {

    it('Should call organisationUnitOnChange function when Available Organisation Units Tree changes.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'organisationUnitOnChange').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            organisationUnitId: null,
        });
        wrapper.find(AvailableOrganisationUnitsTree).simulate('change', 'TestOrganisationUnitId');
        expect(spy).toHaveBeenCalledWith('TestOrganisationUnitId');
        expect(wrapper.state('organisationUnitId')).toBe('TestOrganisationUnitId');
    });

    it('Should call startDateOnChange function when Start Date DatePicker changes.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'startDateOnChange').and.callThrough();
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
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'endDateOnChange').and.callThrough();
        const wrapper = ownShallow();
        const testEndDate  = new Date();
        wrapper.setState({
            endDate: null,
        });
        wrapper.find(DatePicker).at(1).simulate('change', null, testEndDate);
        expect(spy).toHaveBeenCalledWith(null, testEndDate);
        expect(wrapper.state('endDate')).toMatchObject(testEndDate);
    });

    it('Should call validationRuleGroupOnChange function when ValidationRuleGroupsSelect changes.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'validationRuleGroupOnChange').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            validationRuleGroupId: null,
        });
        wrapper.find(ValidationRuleGroupsSelect).at(0).simulate('change', null, null, 'TestValidationRuleGroupId');
        expect(spy).toHaveBeenCalledWith(null, null, 'TestValidationRuleGroupId');
        expect(wrapper.state('validationRuleGroupId')).toBe('TestValidationRuleGroupId');
    });

    it('Should call updateSendNotifications when "Send notifications" checkbox change.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'updateSendNotifications').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            notification: null,
        });
        wrapper.find(Checkbox).at(0).simulate('check', null, true);
        expect(spy).toHaveBeenCalledWith(null, true);
        expect(wrapper.state('notification')).toBeTruthy();
    });

    it('Should call updatePersistNewResults when "Persist new results" checkbox change.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'updatePersistNewResults').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            persist: null,
        });
        wrapper.find(Checkbox).at(1).simulate('check', null, true);
        expect(spy).toHaveBeenCalledWith(null, true);
        expect(wrapper.state('persist')).toBeTruthy();
    });

    it('Should call validate function when Validate button is clicked.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'validate');
        const wrapper = ownShallow();
        wrapper.find(RaisedButton).simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Calls back method when IconButton (back) is clicked', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'back');
        const wrapper = ownShallow();
        wrapper.find(IconButton).simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Update state when back button is clicked', () => {
        const wrapper = ownShallow();
        wrapper.setState({ showTable: true });
        wrapper.find(IconButton).simulate('click');
        expect(wrapper.state('showTable')).toBe(false);
    });

});
