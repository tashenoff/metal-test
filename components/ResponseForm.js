// components/ResponseForm.js
import { useState } from 'react';

const ResponseForm = ({ onSubmit, feedback }) => {
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(responseMessage);
        setResponseMessage(''); // Очищаем поле ввода после отправки
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 border p-4 rounded shadow">
            <textarea
                className="border w-full p-2 mb-2"
                placeholder="Напишите ваш отклик"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                required // Убедитесь, что поле не пустое
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Отправить отклик
            </button>
            {feedback && <p className="text-red-500 mt-2">{feedback}</p>}
        </form>
    );
};

export default ResponseForm;
