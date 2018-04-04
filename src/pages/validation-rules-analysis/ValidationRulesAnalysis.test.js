/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import ValidationRulesAnalysis from './ValidationRulesAnalysis';

import {
    sections,
    VALIDATION_RULES_ANALYSIS_SECTION_KEY,
} from '../sections.conf';

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
                validate: jest.fn(),
                translator: (key) => key,
            },
            disableLifecycleMethods: true
        }
    );
};

describe('Test <ValidationRulesAnalysis /> render', () => {
    it('Should render without crashing', () =>{
        ownShallow();
    });

    it('Should show correct title.', () =>{
        const wrapper = ownShallow();
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(wrapper.find('h1').text()).toBe('<IconButton />Validation Rule Analysis<PageHelper />');
    });

    it('Should render an "AvailableOrganisationUnitsTree" component.', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('AvailableOrganisationUnitsTree')).toHaveLength(1);
    });

    it('Renders a "Start Date" - DatePicker.', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('DatePicker').at(0).props().floatingLabelText).toBe('Start Date');
    });

    it('Renders a "End Date" - DatePicker.', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('DatePicker').at(1).props().floatingLabelText).toBe('End Date');
    });

    it('Should render a "Validation Rule Group" - Select.', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('ValidationRuleGroupsSelect')).toHaveLength(1);
    });

    it('Should render a Checkbox to choose "Send notifications".', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('Checkbox').at(0).props().label).toBe('Send Notifications');
    });

    it('Should render a Checkbox to choose "Persist new results".', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('Checkbox').at(1).props().label).toBe('Persist new results');
    });

    it('Should render "Validate" button.', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('RaisedButton')).toHaveLength(1);
    });
});

describe('Test <ValidationRulesAnalysis /> actions', () => {

    it('Should call organisationUnitOnChange function when Available Organisation Units Tree changes.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'organisationUnitOnChange').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            organisationUnitId: null,
        });
        wrapper.find('AvailableOrganisationUnitsTree').simulate('change', 'TestOrganisationUnitId');
        wrapper.update();
        expect(spy).toHaveBeenCalled();
        expect(wrapper.state('organisationUnitId')).toBe('TestOrganisationUnitId');
    });

    it('Should call startDateOnChange function when Start Date DatePicker changes.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'startDateOnChange');
        const wrapper = ownShallow();
        wrapper.setState({
            organisationUnitId: null,
        });
        wrapper.find('DatePicker').at(0).simulate('change');
        expect(spy).toHaveBeenCalled();
    });

    it('Should call endDateOnChange function when End Date DatePicker changes.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'endDateOnChange');
        const wrapper = ownShallow();
        wrapper.find('DatePicker').at(1).simulate('change');
        expect(spy).toHaveBeenCalled();
    });

    it('Should call validationRuleGroupOnChange function when ValidationRuleGroupsSelect changes.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'validationRuleGroupOnChange');
        const wrapper = ownShallow();
        wrapper.find('ValidationRuleGroupsSelect').at(0).simulate('change');
        expect(spy).toHaveBeenCalled();
    });

    it('Should call updateSendNotifications when "Send notifications" checkbox change.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'updateSendNotifications');
        const wrapper = ownShallow();
        wrapper.find('Checkbox').at(0).simulate('check');
        expect(spy).toHaveBeenCalled();
    });

    it('Should call updatePersistNewResults when "Persist new results" checkbox change.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'updatePersistNewResults');
        const wrapper = ownShallow();
        wrapper.find('Checkbox').at(1).simulate('check');
        expect(spy).toHaveBeenCalled();
    });

    it('Should call validate function when Validate button is clicked.', () => {
        const spy = spyOn(ValidationRulesAnalysis.prototype, 'validate');
        const wrapper = ownShallow();
        wrapper.find('RaisedButton').simulate('click');
        expect(spy).toHaveBeenCalled();
    });

});
