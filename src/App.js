import React from 'react';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const App = () => (
    <div className="app-wrapper">
        <HeaderBar />
        <div id="container" />
    </div>
);

export default App;
