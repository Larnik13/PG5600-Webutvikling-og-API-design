import React from 'react';
import {connect} from 'react-redux';
import { LoginStatuses  } from '../actions';

const LeftHeaderLinks = ({loginStatus, setVisitingProfile, setIsVisitingProfile, visitUser}) => (
    <div>
        <a href = '#' onClick = {() => {
            setIsVisitingProfile(false);
            setVisitingProfile({});
        }}>Hjem </a>
        <a href = '#' onClick = {() => {
            visitUser(localStorage.getItem('username'));
        }}>Profil</a>
    </div>
);

export default connect(state => ({loginStatus: state.loginStatus}))(LeftHeaderLinks);