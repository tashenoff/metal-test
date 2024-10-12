// components/ResponsesList.js
import React from 'react';

const ResponsesList = ({ responses, onAccept, onDecline }) => {
    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Отклики:</h2>
            <ul className="space-y-4">
                {responses.map((response) => (
                    <li key={response.id} className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                        <p className="font-semibold">
                            <strong>Сообщение:</strong> {response.message}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Пользователь:</strong> {response.responder ? response.responder.name : 'Неизвестный'}
                        </p>
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={() => onAccept(response.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                            >
                                Принять
                            </button>
                            <button
                                onClick={() => onDecline(response.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                            >
                                Отклонить
                            </button>
                            {response.accepted && <span className="text-green-600 font-semibold"> (Принят)</span>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResponsesList;
