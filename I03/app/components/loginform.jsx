import React from 'react';

const LoginForm = ({login}) => (
    <form onSubmit = {(event) => {
        event.preventDefault();
        login(event.target);
    }}>
        <p className = 'usernameText'>Brukernavn</p>
        <input className = 'loginUsername' type = 'text' name = 'email'/><br/>
        <p className = 'passwordText'>Passord</p>
        <input className = 'loginPassword' type = 'password' name = 'password'/><br/>
        <input className = 'loginSubmit' type = 'submit' name = 'submit'/>
    </form>
);

export default LoginForm;