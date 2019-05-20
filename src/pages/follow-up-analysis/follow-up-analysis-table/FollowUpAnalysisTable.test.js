/* eslint-disable */
import React from 'react';
import { mount, shallow } from 'enzyme';
import FollowUpAnalysisTable from './FollowUpAnalysisTable';
import { Checkbox, Dialog, IconButton, MuiThemeProvider, RaisedButton, TableRow, TableRowColumn } from 'material-ui';
import DownloadAs from '../../../components/download-as/DownloadAs';

jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));
jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const response = [
    {
        dataElementId: 360049,
        periodId: 475192,
        sourceId: 73739,
        categoryOptionComboId: 4,
        attributeOptionComboId: 4,
        value: '10',
        followup: true,
        min: 11,
        max: 22,
        dataElementName: 'Stock PHU dispensed  BCG',
        period: {
            code: 201801,
            name: 'January 2018',
            externalAccess: false,
            displayName: 'January 2018',
            shortName: '201801',
            displayShortName: '201801',
            dimensionItemType: 'PERIOD',
            periodType: 'Monthly',
            startDate: '2018-01-01T00:00:00.000',
            endDate: '2018-01-31T00:00:00.000',
            dimensionItem: '201801',
            favorite: 'false',
            id: 201801
        },
        sourceName: 'Bontiwo MCHP',
        categoryOptionComboName: 'default',
    }, {
        dataElementId: 8240,
        periodId: 475192,
        sourceId: 559,
        categoryOptionComboId: 358734,
        attributeOptionComboId: 1153396,
        value: '12',
        comment: '1234',
        followup: true,
        min: 1,
        max: 23,
        dataElementName: 'ART enrollment stage 1',
        period: {
            code: '201801',
            name: 'January 2018',
            externalAccess: false,
            displayName: 'January 2018',
            shortName: '201801',
            displayShortName: '201801',
            dimensionItemType: 'PERIOD',
            periodType: 'Monthly',
            startDate: '2018-01-01T00:00:00.000',
            endDate: '2018-01-31T00:00:00.000',
            dimensionItem: '201801',
            favorite: false,
            id: '201801'
        },
        sourceName: 'Ngelehun CHC',
        categoryOptionComboName: 'Male, <15y',
    },
];

const testElements = response.map(FollowUpAnalysisTable.convertElementFromApiResponse);

const expectedElementFormat = {
    key: '4-4-475192-73739-360049',
    attributeOptionComboId: 4,
    categoryOptionComboId: 4,
    periodId: 475192,
    organisationUnitId: 73739,
    dataElementId: 360049,
    dataElement: 'Stock PHU dispensed  BCG',
    organisation: 'Bontiwo MCHP',
    period: 'January 2018',
    min: 11,
    max: 22,
    value: 10,
    marked: false,
    comment: undefined,
};

const expectedUnfollowFormat = {
    dataElementId: 360049,
    periodId: 475192,
    organisationUnitId: 73739,
    categoryOptionComboId: 4,
    attributeOptionComboId: 4,
    followup: false,
};

const ownShallow = () => {
    return shallow(
        <FollowUpAnalysisTable
            elements={testElements}
            toggleCheckbox={jest.fn()}
            unfollow={jest.fn()}
            loading={false}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <FollowUpAnalysisTable /> rendering:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('FollowUpAnalysisTable renders without crashing.', () => {
        ownShallow();
    });

    it('Should render correct number of rows.', () => {
        expect(wrapper.find(TableRow).length).toBe(3); // Two elements plus header row
    });

    it('Should render correct number of columns.', () => {
        expect(wrapper.find(TableRow).at(1).find(TableRowColumn).length).toBe(8); // First row after header
    });

    it('Should render a Unfollow "Checkbox" for each element.', () => {
        expect(wrapper.find(Checkbox).length).toBe(2);
    });

    it('Should render comment "Dialog" if element have it.', () => {
        expect(wrapper.find(Dialog).length).toBe(1);
    });

    it('Should render speaker_notes "FontIcon" if element have a comment.', () => {
        expect(wrapper.find(IconButton).length).toBe(1);
        const iconButton = mount(<MuiThemeProvider><span>{wrapper.find(IconButton)}</span></MuiThemeProvider>);
        expect(iconButton.text()).toBe('speaker_notes');
    });

    it('Should render an disabled "Unfollow" button when no element selected.', () => {
        expect(wrapper.find(RaisedButton).length).toBe(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBe(true);
    });

    it('Should render an enabled "Unfollow" button when element(s) selected to unfollow.', () => {
        expect(wrapper.find(RaisedButton).length).toBe(1);
        wrapper.instance().oneChecked = true;
        expect(wrapper.find(RaisedButton).props().disabled).toBe(true);
    });

    it('Render "DownloadAs" components.', () => {
        expect(wrapper.find(DownloadAs).length).toBe(2);
    });

});

describe('Test <FollowUpAnalysisTable /> actions:', () => {

    it('Should call updateCheckbox method when checkbox is checked/unchecked.', () => {
        const spy = spyOn(FollowUpAnalysisTable.prototype, 'updateCheckbox');
        const wrapper = ownShallow();
        wrapper.find(Checkbox).at(0).simulate('check');
        expect(spy).toHaveBeenCalledWith(testElements[0]);
    });

    it('Should call showComment method and update state when comment icon is clicked.', () => {
        const spy = spyOn(FollowUpAnalysisTable.prototype, 'showComment').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            showComment: false,
            comment: null,
        });
        wrapper.find(IconButton).at(0).simulate('click');
        expect(spy).toHaveBeenCalledWith(testElements[1]);
        expect(wrapper.state().showComment).toBe(true);
        expect(wrapper.state().comment).toBe(testElements[1].comment);
    });

    it('Should change showDialog state to false when closeCommentDialog method is called.', () => {
        const wrapper = ownShallow();
        wrapper.setState({
            showComment: true,
            comment: 'Test comment!',
        });
        wrapper.instance().closeCommentDialog();
        expect(wrapper.state().showComment).toBe(false);
    });

    it('Should call unfollow method when "Unfollow" button is clicked.', () => {
        const spy = spyOn(FollowUpAnalysisTable.prototype, 'unfollow');
        const wrapper = ownShallow();
        wrapper.find(RaisedButton).at(0).simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('Should correctly convert elements from API response.', () => {
        const element = FollowUpAnalysisTable.convertElementFromApiResponse(response[0]);
        expect(element).toEqual(expectedElementFormat);
    });

    it('Should correctly convert elements to Unfollowup request.', () => {
        const element = FollowUpAnalysisTable.convertElementToUnFollowupRequest(testElements[0]);
        expect(element).toEqual(expectedUnfollowFormat);
    });

    it('Should correctly generateElementKey.', () => {
        const element = FollowUpAnalysisTable.generateElementKey(response[0]);
        const responseElement = response[0];
        expect(element).toBe(`${responseElement.attributeOptionComboId}-`+
            `${responseElement.categoryOptionComboId}-`+
            `${responseElement.periodId}-`+
            `${responseElement.sourceId}-`+
            `${responseElement.dataElementId}`);
    });

});
