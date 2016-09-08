import React from 'react';
import ProfileText from './profiletext.jsx';

const UserProfile = ({user}) => (
    <div>
        <img className = 'profileImage' src = '../content/ironFace.jpg' alt = 'profileImage'/>
        <ProfileText user = {user}/>
    </div>
);

export default UserProfile;