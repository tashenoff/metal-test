// pages/listings/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import ResponsesList from '../../components/ResponsesList';
import ResponseForm from '../../components/ResponseForm'; // Импортируем ResponseForm

const ListingPage = () => {
    const [listing, setListing] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [role, setRole] = useState(null); // Роль пользователя
    const [userId, setUserId] = useState(null); // Идентификатор пользователя
    const [responses, setResponses] = useState([]);
    const [userPoints, setUserPoints] = useState(0); // Баллы пользователя
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
    const [modalMessage, setModalMessage] = useState(''); // Сообщение модального окна
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
                        setUserPoints(user.points); // Сохраняем баллы пользователя
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

    // Функция для отображения статуса отклика
    const getResponseStatus = (response) => {
        if (response.accepted === true) return 'Принят';
        if (response.accepted === false) return 'Отклонён';
        if (response.accepted === null || response.accepted === undefined) return 'На рассмотрении';
    };
    
    const handleResponseSubmit = async (message) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setFeedback('Вы должны быть авторизованы для отправки отклика.');
            return;
        }

        // Проверяем, достаточно ли баллов у пользователя
        if (userPoints < 1) { // Замените 1 на необходимое количество баллов
            setModalMessage('Недостаточно баллов. Пожалуйста, купите баллы для отправки отклика.');
            setIsModalOpen(true);
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
                message: message,
            }),
        });

        const responseText = await response.text(); // Получаем ответ как текст
        console.log('Response:', responseText); // Логируем ответ

        if (response.ok) {
            const newResponse = JSON.parse(responseText); // Парсим его как JSON
            setResponses((prevResponses) => [...prevResponses, newResponse]);
            setFeedback('Отклик успешно отправлен!');
        } else {
            setFeedback(`Ошибка при отправке отклика: ${responseText}`);
        }
    };

    // Проверяем, отправлял ли текущий пользователь отклик
    const hasResponded = responses.some((response) => response.responderId === userId);

    // Обработчик принятия отклика
    const handleAcceptResponse = async (responseId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/responses/acceptResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ responseId, userId }),
        });

        if (response.ok) {
            setFeedback('Отклик принят!');
            // Обновляем статус принятого отклика
            // setResponses((prevResponses) =>
            //     prevResponses.map((resp) =>
            //         resp.id === responseId ? { ...resp, accepted: true } : resp
            //     )
            // );
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
            body: JSON.stringify({ responseId }),
        });
    
        if (response.ok) {
            setFeedback('Отклик отклонён!');
            // Вместо удаления, обновляем статус отклонённого отклика
            setResponses((prevResponses) =>
                prevResponses.map((resp) =>
                    resp.id === responseId ? { ...resp, accepted: false } : resp
                )
            );
        } else {
            const errorData = await response.json();
            setFeedback(`Ошибка при отклонении отклика: ${errorData.message}`);
        }
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (!listing) {
        return <p>Загрузка...</p>;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto">
                <div className='w-1/2 py-10'>
                    <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
                    <p className="mb-2">{listing.content}</p>
                    <p className="text-gray-600">Дата публикации: {new Date(listing.publishedAt).toLocaleDateString()}</p>
                    <p className="text-gray-600">Срок поставки: {new Date(listing.deliveryDate).toLocaleDateString()}</p>
                </div>
                {/* Показываем отправленный отклик текущего пользователя */}
                {role !== 'PUBLISHER' && hasResponded && (
                    <div className="mt-4 border p-3 rounded shadow">
                        <h3 className="text-lg font-semibold">Ваш отклик:</h3>
                        {responses
                            .filter((response) => response.responderId === userId)
                            .map((response) => (
                                <div key={response.id} className="mt-2">
                                    <p><strong>Сообщение:</strong> {response.message}</p>
                                    <p><strong>Дата отклика:</strong> {new Date(response.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Статус:</strong> {getResponseStatus(response)}</p>
                                </div>
                            ))}
                    </div>
                )}

                {/* Форма для отправки откликов */}
                {role !== 'PUBLISHER' && !hasResponded && (
                    <ResponseForm onSubmit={handleResponseSubmit} feedback={feedback} />
                )}

                {/* Показываем список откликов для владельца объявления */}
                {role === 'PUBLISHER' && listing.authorId === userId && responses.length > 0 && (
                    <ResponsesList
                        responses={responses}
                        onAccept={handleAcceptResponse}
                        onDecline={handleDeclineResponse}
                    />
                )}

                {feedback && <p className="text-red-500 mt-4">{feedback}</p>}
            </div>

            {/* Модальное окно для недостатка баллов */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold">Ошибка</h2>
                        <p>{modalMessage}</p>
                        <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ListingPage;
