import { connect } from 'react-redux';
import { login, logout, register, addMessageOnServer} from '../actions';
import RightPanel from '../components/rightpanel.jsx';

const mapStateToProps = (state) => {
    return {
        loginStatus: state.loginStatus,
        isVisitingProfile: state.isVisitingProfile,
        visitingProfile: state.visitingProfile,
        loginStatus: state.loginStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        postMessage: (messageForm, text) => {
            dispatch(addMessageOnServer(messageForm, text));
        },
        login: (loginForm) => {
            dispatch(login(loginForm));
        },
        logout: () => {
            dispatch(logout());
        },
        register: (registerForm) => {
            dispatch(register(registerForm));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RightPanel);