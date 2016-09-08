import React from 'react';

const ProfileText = ({user}) => (
    <div className = 'profileText'>
        <h2 className = 'profileName'>{user.firstname} {user.lastname}</h2>
        <p className = 'emailText'>Username: {user.email}</p>
    </div>
);

export default ProfileText;