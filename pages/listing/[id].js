// pages/listings/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import ResponsesList from '../../components/ResponsesList';

const ListingPage = () => {
    const [listing, setListing] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [role, setRole] = useState(null); // Роль пользователя
    const [userId, setUserId] = useState(null); // Идентификатор пользователя
    const [responses, setResponses] = useState([]);
    const router = useRouter();
    const { id } = router.query; // Используйте id

    useEffect(() => {
        if (id) {
            const fetchListing = async () => {
                const response = await fetch(`/api/listings/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setListing(data);
                } else {
                    setFeedback('Ошибка при загрузке объявления.');
                }
            };

            fetchListing();

            // Получаем данные пользователя
            const token = localStorage.getItem('token');
            if (token) {
                const fetchUserData = async () => {
                    const response = await fetch('/api/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const user = await response.json();
                        setRole(user.role); // Сохраняем роль пользователя
                        setUserId(user.id); // Сохраняем идентификатор пользователя
                    }
                };
                fetchUserData();
            }

            // Получаем отклики для конкретного объявления
            const fetchResponses = async () => {
                const response = await fetch(`/api/responses?id=${id}`); // Изменено на id
                if (response.ok) {
                    const data = await response.json();
                    setResponses(data); // Устанавливаем отклики
                } else {
                    setFeedback('Ошибка при загрузке откликов.');
                }
            };

            fetchResponses();
        }
    }, [id]);

    const handleResponseSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
        if (!token) {
            setFeedback('Вы должны быть авторизованы для отправки отклика.');
            return;
        }
    
        const response = await fetch('/api/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                listingId: id, // Используйте id для отправки
                message: responseMessage,
            }),
        });
    
        const responseText = await response.text(); // Получаем ответ как текст
        console.log('Response:', responseText); // Логируем ответ
    
        if (response.ok) {
            const newResponse = JSON.parse(responseText); // Парсим его как JSON
            setResponses((prevResponses) => [...prevResponses, newResponse]);
            setFeedback('Отклик успешно отправлен!');
            setResponseMessage('');
        } else {
            setFeedback(`Ошибка при отправке отклика: ${responseText}`);
        }
    };
    
    // Проверяем, отправлял ли текущий пользователь отклик
    const hasResponded = responses.some((response) => response.responderId === userId); // Используем userId для проверки

    // Обработчик принятия отклика
    const handleAcceptResponse = async (responseId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/responses/acceptResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ responseId }), // Передаём responseId в теле запроса
        });

        if (response.ok) {
            setFeedback('Отклик принят!');
            // Обновите отклики, чтобы отобразить изменения
            setResponses((prevResponses) =>
                prevResponses.map((resp) =>
                    resp.id === responseId ? { ...resp, accepted: true } : resp
                )
            );
        } else {
            const errorData = await response.json();
            setFeedback(`Ошибка при принятии отклика: ${errorData.message}`);
        }
    };

    // Обработчик отклонения отклика
    const handleDeclineResponse = async (responseId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/responses/declineResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ responseId }), // Передаём responseId в теле запроса
        });

        if (response.ok) {
            setFeedback('Отклик отклонён!');
            // Обновите отклики, чтобы отобразить изменения
            setResponses((prevResponses) =>
                prevResponses.filter((resp) => resp.id !== responseId)
            );
        } else {
            const errorData = await response.json();
            setFeedback(`Ошибка при отклонении отклика: ${errorData.message}`);
        }
    };

    if (!listing) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <Header />
            <h1>{listing.title}</h1>
            <p>{listing.content}</p>
            {role !== 'PUBLISHER' && !hasResponded && ( // Скрываем форму, если респондент уже отправил отклик
                <form onSubmit={handleResponseSubmit}>
                    <textarea
                        placeholder="Напишите ваш отклик"
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                    />
                    <button type="submit">Отправить отклик</button>
                </form>
            )}
            {role === 'PUBLISHER' && responses.length > 0 && (
                <ResponsesList 
                    responses={responses}
                    onAccept={handleAcceptResponse}
                    onDecline={handleDeclineResponse}
                />
            )}
            {feedback && <p>{feedback}</p>}
        </div>
    );
};

export default ListingPage;
