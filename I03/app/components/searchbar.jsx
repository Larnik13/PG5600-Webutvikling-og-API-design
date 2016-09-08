import React from 'react';
import SortOptions from './sortoptions.jsx';
import { LoginStatuses  } from '../actions';
import { connect } from 'react-redux';
const { LOGGED_IN } = LoginStatuses;

const Searchbar = ({ setSortCriteria, addMessage, register, login, logout, loginStatus}) => (
   <div className = 'Searchbar'>
       <br/>
       <h3>{(() => {
            if(loginStatus !== LOGGED_IN){
                return 'Søk i vårt message utvalg';
            }
            else {
                var user = localStorage.getItem('username');
                return 'Velkommen ' + user + ', søk i dine message';
            }
       })()}</h3>
       <SortOptions setSortCriteria = {setSortCriteria} />
       <br/>
   </div>
);

export default connect(state => ({loginStatus: state.loginStatus}))(Searchbar);