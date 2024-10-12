import { useEffect, useState } from 'react';
import Header from '../components/Header';

const PublisherPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('published'); // Состояние для активной вкладки

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

  // Фильтрация объявлений по выбранной вкладке
  const filteredListings = listings.filter((listing) =>
    activeTab === 'published' ? listing.published : !listing.published
  );

  return (
    <div>
      <Header />
      <div className="container mx-auto">

        <div className="flex items-center my-4 justify-between">
          <h1>Ваши объявления</h1>
          <div>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-4 py-2 rounded-md ${activeTab === 'published' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Опубликованные
            </button>
            <button
              onClick={() => setActiveTab('unpublished')}
              className={`px-4 py-2 rounded-md ${activeTab === 'unpublished' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Не опубликованные
            </button>
          </div>
        </div>
      </div>
      {filteredListings.length === 0 ? (
        <p>У вас нет объявлений.</p>
      ) : (
        <div className="container mx-auto">
          <ul className="space-y-4">
            {filteredListings.map((listing) => (
              <li key={listing.id} className="border border-gray-300 rounded-lg p-4 shadow-md bg-white">
                <h2 className="text-xl font-bold">{listing.title}</h2>
                <p className="text-gray-700">{listing.content}</p>
                <p className="text-sm text-gray-500">
                  Опубликовано: {new Date(listing.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Статус: {listing.published ? 'Опубликовано' : 'Не опубликовано'}
                </p>
                <p className="text-sm text-gray-500">
                  Дата доставки: {new Date(listing.deliveryDate).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handlePublish(listing.id)}
                    disabled={listing.published}
                    className={`px-4 py-2 text-white rounded-md ${listing.published ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    Опубликовать
                  </button>
                  <button
                    onClick={() => handleUnpublish(listing.id)}
                    disabled={!listing.published}
                    className={`px-4 py-2 text-white rounded-md ${!listing.published ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    Снять с публикации
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PublisherPage;
