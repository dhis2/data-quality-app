/* eslint-disable */
import React from 'react';
import {shallow} from 'enzyme';
import PageHelper from './PageHelper';
import {IconButton} from 'material-ui';

import {
    VALIDATION_RULES_ANALYSIS_SECTION_KEY,
    getDocsKeyForSection
} from '../../pages/sections.conf';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const ownShallow = () => {
    return shallow(
        <PageHelper
            sectionDocsKey={getDocsKeyForSection(VALIDATION_RULES_ANALYSIS_SECTION_KEY)}
        />,
        {
            context: {
                d2: {
                    system: {
                        version: {
                            snapshot: true,
                        }
                    }
                }
            },
        },
    );
};

it('Page Helper renders without crashing.', () => {
    ownShallow();
});

it('Page Helper should have an icon button.', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(IconButton)).toHaveLength(1);
});
