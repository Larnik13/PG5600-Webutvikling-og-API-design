import React from 'react';
import RightPanel from '../containers/rightpanel';
import SortedLeftPanel from '../containers/sortedleftpanel';
require('../style.css');

const App = ({}) => (
    <div className = 'App'>
        <SortedLeftPanel/>
        <RightPanel/>
    </div>
);

export default App;