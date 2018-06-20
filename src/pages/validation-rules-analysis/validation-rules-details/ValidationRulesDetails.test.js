/* eslint-disable */
import React from 'react';
import { shallow, mount } from 'enzyme';

import { Dialog, FlatButton, FontIcon } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ValidationRulesDetails from './ValidationRulesDetails';
import FormattedNumber from '../../../components/formatters/FormattedNumber';

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const rule = {
    lastUpdated: '2014-03-04T01:43:47.165',
    id: 'sxamEpoUXb5',
    href: 'http://localhost:8080/api/29/validationRules/sxamEpoUXb5',
    created: '2011-12-24T12:24:22.817',
    name: 'Measles, Slept under LLITN last night, <1 year Fixed',
    importance: 'MEDIUM',
    displayName: 'Measles, Slept under LLITN last night, <1 year Fixed',
    publicAccess: 'rw------',
    description: 'Question asked at Measles',
    operator: 'less_than_or_equal_to',
    externalAccess: false,
    displayDescription: 'Question asked at Measles',
    dimensionItem: 'sxamEpoUXb5',
    periodType: 'Monthly',
    instruction: 'Slept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)',
    skipFormValidation: false,
    favorite: false,
    access: {
    read: true,
        update: true,
        externalize: false,
        delete: true,
        write: true,
        manage: true,
    },
    leftSide: {
    expression: '#{GCGfEY82Wz6.Prlt0C1RF0s}',
        description: 'At Measles, slept under LLITN last night, <1 year Fixed',
        missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
        slidingWindow: false,
    },
    rightSide: {
    expression: '#{YtbsuPPo010.Prlt0C1RF0s}',
        description: 'Measles, <1 year Fixed[34.292]',
        missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
        slidingWindow: false,
    },
    user: {
        id: 'GOLswS44mh8',
    },
    validationRuleGroups: [{
        id: 'UiOSY1iIdub',
    }],
    favorites: [],
    organisationUnitLevels: [],
    notificationTemplates: [],
    translations: [],
    userGroupAccesses: [],
    attributeValues: [],
    userAccesses: [],
    legendSets: [],
};

const expression = {
    leftSide: [{
        name: 'Q_Slept under LLIN last night Measles Fixed, <1y',
        value: '6',
    }],
    rightSide: [{
        name: 'Measles doses given Fixed, <1y',
        value: '1',
    }]
};


const ownShallow = () => {
    return shallow(
        <ValidationRulesDetails
            organisationUnitId={'organisationUnitId'}
            periodId={'periodId'}
            validationRuleId={'validationRuleId'}
        />,
        {
            context: {
                updateAppState: jest.fn(),
                d2: {
                    Api: {
                        getApi: jest.fn().mockReturnValue({
                                get: jest.fn(),
                            }),
                    },
                },
            },
            disableLifecycleMethods: true,
        }
    );
};

describe('Test <ValidationRulesDetails /> rendering:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('ValidationRulesDetails renders without crashing.', () => {
        ownShallow();
    });

    it('Should render a FontIcon to open details.', () => {
        expect(wrapper.find(FontIcon)).toHaveLength(1);
        const detailsIcon = <span>{wrapper.find(FontIcon)}</span>;
        const fontIconWrapper = mount(<MuiThemeProvider>{detailsIcon}</MuiThemeProvider>);
        expect(fontIconWrapper.find(FontIcon).find('span.material-icons').text()).toBe('info');
    });

    it('Should have a dialog to show details.', () => {
        expect(wrapper.find(Dialog)).toHaveLength(1);
        expect(wrapper.find(Dialog).props().open).toBeFalsy();
    });

    it('Should show the dialog when "open" state equals to true.', () => {
        wrapper.setState({
            openDetails: true,
        });
        expect(wrapper.find(Dialog)).toHaveLength(1);
        expect(wrapper.find(Dialog).props().open).toBeTruthy();
    });

    it('Should not show the dialog when "open" state equals to false.', () => {
        wrapper.setState({
            openDetails: false,
        });
        expect(wrapper.find(Dialog)).toHaveLength(1);
        expect(wrapper.find(Dialog).props().open).toBeFalsy();
    });

    it('Dialog should render a close Button.', () => {
        const dialog = wrapper.find(Dialog);
        const actions = mount(<MuiThemeProvider><span>{dialog.props().actions}</span></MuiThemeProvider>);
        expect(actions.find(FlatButton)).toHaveLength(1);
    });

    it('Should have 3 sections of information.', () => {
        expect(wrapper.find('.row')).toHaveLength(3);
    });

    it('Firt section should show rule "Summary".', () => {
        wrapper.setState({ rule, expression });
        expect(wrapper.find('.row').at(0).children().at(3).text()).toBe('Measles, Slept under LLITN last' +
            ' night, <1 year Fixed');
        expect(wrapper.find('.row').at(0).children().at(5).text()).toBe('Question asked at Measles');
    });

    it('Second section should show "Left Side" information.', () => {
        wrapper.setState({ rule, expression });
        expect(wrapper.find('.row').at(1).children().at(3).text()).toBe('Q_Slept under LLIN last night Measles' +
            ' Fixed, <1y<FormattedNumber />');
        expect(wrapper.find('.row').at(1).children().find(FormattedNumber).props().value).toBe(6);
    });

    it('Third section should show "Right Side" information.', () => {
        wrapper.setState({ rule, expression });
        expect(wrapper.find('.row').at(3).children().at(3).text()).toBe('Measles doses given Fixed,' +
            ' <1y<FormattedNumber />');
        expect(wrapper.find('.row').at(3).children().find(FormattedNumber).props().value).toBe(1);
    });

});

describe('Test <ValidationRulesDetails /> actions:', () => {

    it('FontIcon "info" icon should call "loadDetails".', () => {
        const spy = spyOn(ValidationRulesDetails.prototype, 'loadDetails');
        const localWrapper = ownShallow();
        const detailsIcon = localWrapper.find(FontIcon);
        detailsIcon.simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Dialog close button should call handleClose and update state.', () => {
        const spy = spyOn(ValidationRulesDetails.prototype, 'handleClose').and.callThrough();
        const localWrapper = ownShallow();
        const dialog = localWrapper.find(Dialog);
        const actionsWrapper = mount(<MuiThemeProvider><span>{dialog.props().actions}</span></MuiThemeProvider>);
        localWrapper.setState({
            openDetails: true,
        });
        actionsWrapper.find(FlatButton).at(0).simulate('click');
        expect(spy).toHaveBeenCalled();
        expect(localWrapper.state('openDetails')).toBeFalsy();
    });

});
