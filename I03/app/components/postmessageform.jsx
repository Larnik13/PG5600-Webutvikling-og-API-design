import React from 'react';

const PostMessageForm = ({postMessage}) => (
    <div>
        <h2>Ny melding</h2>
        <textarea id = 'postMessageText' className = 'postText' name = 'text' form = 'messageForm'></textarea>
        <form id = 'messageForm' onSubmit = {(event) => {
            event.preventDefault();
            if(event.target.text.value !== ''){
                postMessage(event.target, document.getElementById('postMessageText').value);
            }
            else {
                alert('Meldingsfeltet er tomt, vennligst skriv inn en melding før du prøver å poste');
            }
            document.getElementById('postMessageText').value = '';
            document.getElementById('isPublicSwitch').checked = true;
        }}>
            <div className = 'postIsPublic'><input id = 'isPublicSwitch' type="checkbox" name="isPublic" defaultChecked/>Offentlig</div>
            <input className = 'postButton' type = 'submit' name = 'submit'/>
        </form>
    </div>
);

export default PostMessageForm;