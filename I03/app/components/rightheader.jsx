import React from 'react';
import LoginForm from './loginform.jsx';
import {connect} from 'react-redux';
import { LoginStatuses  } from '../actions';

const RightHeader = ({login, logout, loginStatus}) => (
    <div className = 'rightHeaderContainer'>
        {(() => {
            if(loginStatus === LoginStatuses.LOGGED_IN) {
                return (
                    <div>
                        <p>Logget inn som {localStorage.getItem('username')}</p>
                        <button className = 'logoutButton' onClick = {logout}>Logg ut</button>
                    </div>
                );
            }
            else {
                return (<LoginForm login = {login}/>);
            }
        })()}
    </div>
);

export default connect(state => ({loginStatus: state.loginStatus}))(RightHeader);