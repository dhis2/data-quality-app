import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { i18nKeys } from '../../i18n';

import styles from './DownloadAs.css';

class DownloadAs extends PureComponent {
    static contextTypes = {
        translator: PropTypes.func,
    }

    static pdf() {
        console.log('Download as PDF not implemented!');
    }

    static xls() {
        console.log('Download as XLS not implemented!');
    }

    static csv() {
        console.log('Download as CSV not implemented!');
    }

    render() {
        const translator = this.context.translator;
        return (
            <div className={styles.downloadAs}>
                <span
                    onClick={DownloadAs.pdf}
                    role={'button'}
                    tabIndex={0}
                >
                    {translator(i18nKeys.downloadAs.pdf)}
                </span>
                <span onClick={DownloadAs.xls} role={'button'} tabIndex={0}>{translator(i18nKeys.downloadAs.xls)}</span>
                <span onClick={DownloadAs.csv} role={'button'} tabIndex={0}>{translator(i18nKeys.downloadAs.csv)}</span>
            </div>
        );
    }
}

export default DownloadAs;

