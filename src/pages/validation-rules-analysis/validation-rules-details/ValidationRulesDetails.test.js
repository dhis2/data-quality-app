/* eslint-disable */
import React from 'react';
import { shallow, mount } from 'enzyme';

import { Dialog, FlatButton, FontIcon } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ValidationRulesDetails from './ValidationRulesDetails';

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

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
                translator: (key) => key,
                d2: {
                    Api: {
                        getApi: jest.fn().mockReturnValue({
                                get: jest.fn(),
                            }),
                    },
                },
            },
            disableLifecycleMethods: true
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
