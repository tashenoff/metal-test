import { useEffect, useState } from 'react';
import Header from '../components/Header';

const PublisherPage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch('/api/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const user = await response.json();
                        setUserId(user.id);
                        await fetchListings(user.id); // Передаем userId для получения объявлений
                    } else {
                        setError('Ошибка при загрузке данных пользователя.');
                    }
                } catch (err) {
                    setError('Ошибка при загрузке данных пользователя.');
                } finally {
                    setLoading(false); // Завершаем загрузку
                }
            };
            fetchUserData();
        } else {
            setError('Вы должны быть авторизованы для доступа к объявлениям.');
            setLoading(false); // Завершаем загрузку
        }
    }, []);

    const fetchListings = async (userId) => {
        try {
            const response = await fetch('/api/publisher/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }), // Передаем userId в теле запроса
            });

            if (response.ok) {
                const data = await response.json();
                setListings(data);
            } else {
                setError('Ошибка при загрузке объявлений.');
            }
        } catch (err) {
            setError('Ошибка при загрузке объявлений.');
        } finally {
            setLoading(false); // Завершаем загрузку
        }
    };

    const handlePublish = async (listingId) => {
        try {
            const response = await fetch('/api/publisher/publishListing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listingId }), // Передаем listingId в теле запроса
            });

            if (response.ok) {
                const updatedListing = await response.json();
                setListings((prevListings) =>
                    prevListings.map((listing) =>
                        listing.id === updatedListing.id ? updatedListing : listing
                    )
                );
            } else {
                setError('Ошибка при публикации объявления.');
            }
        } catch (err) {
            setError('Ошибка при публикации объявления.');
        }
    };

    const handleUnpublish = async (listingId) => {
        try {
            const response = await fetch('/api/publisher/unpublishListing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listingId }), // Передаем listingId в теле запроса
            });

            if (response.ok) {
                const updatedListing = await response.json();
                setListings((prevListings) =>
                    prevListings.map((listing) =>
                        listing.id === updatedListing.id ? updatedListing : listing
                    )
                );
            } else {
                setError('Ошибка при снятии объявления с публикации.');
            }
        } catch (err) {
            setError('Ошибка при снятии объявления с публикации.');
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div>
            <Header />
            <h1>Ваши объявления</h1>
            {listings.length === 0 ? (
                <p>У вас нет объявлений.</p>
            ) : (
                <ul>
                    {listings.map((listing) => (
                        <li key={listing.id}>
                            <h2>{listing.title}</h2>
                            <p>{listing.content}</p>
                            <p>Опубликовано: {new Date(listing.publishedAt).toLocaleDateString()}</p>
                            <p>Статус: {listing.published ? 'Опубликовано' : 'Не опубликовано'}</p>
                            <p>Дата доставки: {new Date(listing.deliveryDate).toLocaleDateString()}</p>
                            <button onClick={() => handlePublish(listing.id)} disabled={listing.published}>
                                Опубликовать
                            </button>
                            <button onClick={() => handleUnpublish(listing.id)} disabled={!listing.published}>
                                Снять с публикации
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PublisherPage;
