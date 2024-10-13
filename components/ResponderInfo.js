// components/ResponderInfo.js
import { useEffect, useState } from 'react';

const ResponderInfo = ({ id }) => {
    const [responder, setResponder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResponder = async () => {
            try {
                const response = await fetch(`/api/responder/${id}`);
                if (!response.ok) {
                    throw new Error('Не удалось загрузить данные респондента');
                }
                const data = await response.json();
                setResponder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchResponder(); // Добавляем проверку на наличие ID
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
    if (!responder) return <p>Респондент не найден.</p>; // Добавляем обработку ошибки

    return (
        <div className="responder-info">
            <h2>Информация о респонденте</h2>
            <p><strong>ID:</strong> {responder.id}</p>
            <p><strong>Имя:</strong> {responder.name || 'Не указано'}</p>
            <p><strong>Email:</strong> {responder.email}</p>
            <p><strong>Номер телефона:</strong> {responder.phoneNumber || 'Не указано'}</p>
            <p><strong>Название компании:</strong> {responder.companyName || 'Не указано'}</p>
            <p><strong>Город:</strong> {responder.city || 'Не указано'}</p>
            <p><strong>Роль:</strong> {responder.role}</p>
        </div>
    );
};

export default ResponderInfo;
