// React
import React from 'react';
import ReactDOM from 'react-dom';

/* d2 */
import { init, getManifest, getUserSettings } from 'd2/lib/d2';

// logging
import log from 'loglevel';

/* Redux */
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';

/* i18n */
import { configI18n } from './configI18n';

import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

log.setLevel(process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.DEBUG);

const configurations = (userSettings) => {
    const uiLocale = userSettings.keyUiLocale;
    sessionStorage.setItem('uiLocale', uiLocale || 'en');

    configI18n(userSettings);
};

/* init d2 */
let d2Instance;

getManifest('manifest.webapp').then((manifest) => {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? `${manifest.getBaseUrl()}/api/${manifest.dhis2.apiVersion}`
            : `${process.env.REACT_APP_DHIS2_BASE_URL}/api/${manifest.dhis2.apiVersion}`;

    // init d2 with configs
    init({
        baseUrl,
        schemas: [
            'organisationUnit',
            'dataSet',
            'validationRuleGroup',
        ],
    })
        .then((d2) => { d2Instance = d2; })
        .then(getUserSettings)
        .then(configurations)
        .then(() => {
            ReactDOM.render(
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <App
                            d2={d2Instance}
                        />
                    </ConnectedRouter>
                </Provider>,
                document.getElementById('app'),
            );
        });
});

registerServiceWorker();
