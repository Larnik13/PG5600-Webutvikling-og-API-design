import { connect } from 'react-redux';
import { visitUser, deleteMessageOnServer, toggleUpvoteOnServer, toggleIsPublicOnServer, setIsVisitingProfileAndReload, setVisitingProfile, setSortCriteria} from '../actions';
import LeftPanel from '../components/leftpanel.jsx';

const getSortedMessages = (messages, sortCriteria) => {
    return messages.sort((msg1, msg2) => {
        if(sortCriteria === 'added') {
            return new Date(msg2.added).getTime() - new Date(msg1.added).getTime();
        }
        else {
            return msg2.upvoters.length - msg1.upvoters.length;
        }
    });
};

const mapStateToProps = (state) => {
    return {
        messages: getSortedMessages(state.messages, state.sortCriteria)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteMessage: (id) => {
            dispatch(deleteMessageOnServer(id))
        },
        setVisitingProfile: (user) => {
            dispatch(setVisitingProfile(user));
        },
        setIsVisitingProfile: (isVisiting) => {
            dispatch(setIsVisitingProfileAndReload(isVisiting));
        },
        toggleIsPublic: (message) => {
            dispatch(toggleIsPublicOnServer(message));
        },
        toggleUpvote: (message) => {
            dispatch(toggleUpvoteOnServer(message));
        },
        setSortCriteria: (criteria) => {
            dispatch(setSortCriteria(criteria));
        },
        visitUser: (user) => {
            dispatch(visitUser(user));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LeftPanel);