// pages/responses.js
import { useEffect, useState } from 'react';
import Header from '../components/Header';

const ResponsesPage = () => {
    const [responses, setResponses] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [userId, setUserId] = useState(null); // Идентификатор пользователя

    useEffect(() => {
        // Получаем данные пользователя
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                const response = await fetch('/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const user = await response.json();
                    setUserId(user.id); // Сохраняем идентификатор пользователя
                    fetchResponses(user.id); // Получаем отклики для текущего пользователя
                } else {
                    setFeedback('Ошибка при загрузке данных пользователя.');
                }
            };
            fetchUserData();
        } else {
            setFeedback('Вы должны быть авторизованы для доступа к откликам.');
        }
    }, []);

    const fetchResponses = async (responderId) => {
        const res = await fetch(`/api/responses/getResponses?responderId=${responderId}`);
        if (res.ok) {
            const data = await res.json();
            setResponses(data);
        } else {
            setFeedback('Ошибка при загрузке откликов.');
        }
    };

    return (
        <div>
            <Header />
            <h1>Мои отклики</h1>
            {feedback && <p>{feedback}</p>}
            {responses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Название объявления</th>
                            <th>Статус</th>
                            <th>Имя паблишера</th>
                            <th>Контактная информация</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((response) => (
                            <tr key={response.id}>
                                <td>{response.listing.title}</td>
                                <td>{response.status}</td>
                                {response.status === 'approved' ? ( // Условный рендеринг
                                    <>
                                        <td>{response.listing.author.name}</td>
                                        <td>{response.listing.author.companyName}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>—</td> {/* Отображаем дефис, если статус не approved */}
                                        <td>—</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет откликов.</p>
            )}
        </div>
    );
};

export default ResponsesPage;
