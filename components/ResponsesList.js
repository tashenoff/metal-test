// components/ResponsesList.js
import React from 'react';

const ResponsesList = ({ responses, onAccept, onDecline }) => {
    return (
        <div>
            <h2>Отклики:</h2>
            <ul>
                {responses.map((response) => (
                    <li key={response.id}>
                        <p><strong>Сообщение:</strong> {response.message}</p>
                        <p><strong>Пользователь:</strong> {response.responder ? response.responder.name : 'Неизвестный'}</p>
                        <button onClick={() => onAccept(response.id)}>Принять</button>
                        <button onClick={() => onDecline(response.id)}>Отклонить</button>
                        {response.accepted && <span> (Принят)</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResponsesList;
