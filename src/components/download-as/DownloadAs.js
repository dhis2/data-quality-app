import React, { PureComponent } from 'react';

import styles from './DownloadAs.css';

class DownloadAs extends PureComponent {
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
        return (
            <div className={styles.downloadAs}>
                <span
                    onClick={DownloadAs.pdf}
                    role={'button'}
                    tabIndex={0}
                >
                    DOWNLOAD AS PDF
                </span>
                <span onClick={DownloadAs.xls} role={'button'} tabIndex={0}>DOWNLOAD AS XLS</span>
                <span onClick={DownloadAs.csv} role={'button'} tabIndex={0}>DOWNLOAD AS CSV</span>
            </div>
        );
    }
}

export default DownloadAs;

