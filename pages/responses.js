import { useEffect, useState } from 'react';
import Header from '../components/Header';

const ResponsesPage = () => {
    const [responses, setResponses] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // По умолчанию вкладка "pending"

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                const response = await fetch('/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const user = await response.json();
                    setUserId(user.id);
                    fetchResponses(user.id);
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

    // Фильтруем отклики по статусу
    const filteredResponses = responses.filter((response) => response.status === activeTab);

    return (
        <div>
            <Header />
            <h1>Мои отклики</h1>
            {feedback && <p>{feedback}</p>}

            {/* Вкладки */}
            <div>
                <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'active-tab' : ''}>
                    Ожидающие
                </button>
                <button onClick={() => setActiveTab('approved')} className={activeTab === 'approved' ? 'active-tab' : ''}>
                    Одобренные
                </button>
                <button onClick={() => setActiveTab('rejected')} className={activeTab === 'rejected' ? 'active-tab' : ''}>
                    Отклоненные
                </button>
            </div>

            {/* Таблица откликов */}
            {filteredResponses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Название объявления</th>
                            <th>Статус</th>
                            {activeTab === 'approved' && (
                                <>
                                    <th>Имя паблишера</th>
                                    <th>Контактная информация</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResponses.map((response) => (
                            <tr key={response.id}>
                                <td>{response.listing.title}</td>
                                <td>{response.status}</td>
                                {activeTab === 'approved' ? ( // Показываем данные паблишера только для "approved"
                                    <>
                                        <td>{response.listing.author.name}</td>
                                        <td>{response.listing.author.companyName}</td>
                                        <td>{response.listing.author.phoneNumber}</td>
                                        <td>{response.listing.author.companyBIN}</td>
                                        <td>{response.listing.author.email}</td>
                                    </>
                                ) : (
                                    <td>—</td> // Не показываем данные паблишера для других статусов
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет откликов в данной категории.</p>
            )}
        </div>
    );
};

export default ResponsesPage;
