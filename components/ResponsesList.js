// components/ResponsesList.js
import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // Импортируем компонент модального окна

const ResponsesList = ({ responses, onAccept, onDecline }) => {
    const [selectedResponder, setSelectedResponder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [responseToAccept, setResponseToAccept] = useState(null);
    const [acceptedResponses, setAcceptedResponses] = useState(new Set());

    useEffect(() => {
        const storedAcceptedResponses = JSON.parse(localStorage.getItem('acceptedResponses')) || [];
        setAcceptedResponses(new Set(storedAcceptedResponses));
    }, []);

    const handleResponderClick = (responder) => {
        setSelectedResponder(responder);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResponder(null);
    };

    const openConfirmation = (responseId, responder) => {
        setResponseToAccept(responseId);
        setSelectedResponder(responder);
        setIsConfirmationOpen(true);
    };

    const closeConfirmation = () => {
        setIsConfirmationOpen(false);
        setResponseToAccept(null);
        setSelectedResponder(null);
    };

    const confirmAcceptance = () => {
        if (responseToAccept) {
            onAccept(responseToAccept);
            const updatedAcceptedResponses = new Set(acceptedResponses).add(responseToAccept);
            setAcceptedResponses(updatedAcceptedResponses);
            localStorage.setItem('acceptedResponses', JSON.stringify(Array.from(updatedAcceptedResponses)));
        }
        closeConfirmation();
    };

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
                            <strong>Пользователь: {response.responder ? response.responder.name : 'Неизвестный'}</strong>
                        </p>
                        <span
                            className="cursor-pointer text-blue-500 underline my-5"
                            onClick={() => handleResponderClick(response.responder)}
                        >
                            посмотреть профиль пользователя
                        </span>

                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={() => openConfirmation(response.id, response.responder)}
                                className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 ${acceptedResponses.has(response.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={acceptedResponses.has(response.id)}
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

            {/* Используем компонент модального окна для отображения профиля респондента */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedResponder && (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Информация о пользователе</h3>
                        <p><strong>Имя:</strong> {selectedResponder.name}</p>
                        <p><strong>Организация:</strong> {selectedResponder.companyName}</p>
                        <p><strong>Дата Регистрации:</strong> {new Date(selectedResponder.registrationDate).toLocaleDateString()}</p>
                    </div>
                )}
            </Modal>

            {/* Используем компонент модального окна для подтверждения */}
            <Modal isOpen={isConfirmationOpen} onClose={closeConfirmation}>
                {selectedResponder && (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Подтверждение</h3>
                        <p>
                            После принятия отклика, потенциальный исполнитель увидит ваши контактные данные. <br />
                            Вы уверены, что хотите предоставить свои данные для связи с <strong>{selectedResponder.name}</strong>?
                        </p>
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={confirmAcceptance}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Да, согласен
                            </button>
                            <button
                                onClick={closeConfirmation}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Нет, отменить
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ResponsesList;
