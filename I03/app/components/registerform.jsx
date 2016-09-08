import React from 'react';

const RegisterForm = ({register}) => (
    <form id = 'registerForm' onSubmit = {(event) => {
        event.preventDefault();
        if(event.target.password.value === event.target.confirmPassword.value) {
            register(event.target);
        }
        else {
            alert('Passordfeltene har ikke samme verdi');
        }
    }}>
        <h2>Registrer deg</h2>
        Fornavn <input id = 'firstname' className = 'formInput' type = 'text' name = 'firstname'/><br/>
        Etternavn <input id = 'lastname' className = 'formInput' type = 'text' name = 'lastname'/><br/>
        Brukernavn <input id = 'email' className = 'formInput' type = 'text' name = 'email'/><br/>
        Passord <input id = 'password' className = 'formInput' type = 'password' name = 'password'/><br/>
        Gjenta passord <input id = 'confirmPassword' className = 'formInput' type = 'password' name = 'confirmPassword'/><br/>
        <input className = 'formSubmit' type = 'submit' name = 'submit'/>
    </form>
);

export default RegisterForm;