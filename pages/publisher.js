import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Link from 'next/link';

const PublisherPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('published');
  const [responseCounts, setResponseCounts] = useState({});
  const [responseCountsByStatus, setResponseCountsByStatus] = useState({});

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
            await fetchListings(user.id);
          } else {
            setError('Ошибка при загрузке данных пользователя.');
          }
        } catch (err) {
          setError('Ошибка при загрузке данных пользователя.');
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setError('Вы должны быть авторизованы для доступа к объявлениям.');
      setLoading(false);
    }
  }, []);

  const fetchListings = async (userId) => {
    try {
      const response = await fetch('/api/publisher/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setListings(data);
        await fetchResponseCounts(data);
        await fetchResponseCountsByStatus(data);
      } else {
        setError('Ошибка при загрузке объявлений.');
      }
    } catch (err) {
      setError('Ошибка при загрузке объявлений.');
    }
  };

  const fetchResponseCounts = async (listings) => {
    const counts = {};
    for (const listing of listings) {
      const response = await fetch(`/api/responses/getResponsesCount?listingId=${listing.id}`);
      if (response.ok) {
        const data = await response.json();
        counts[listing.id] = data.count; 
      }
    }
    setResponseCounts(counts);
  };

  const fetchResponseCountsByStatus = async (listings) => {
    const counts = {};
    for (const listing of listings) {
      const response = await fetch(`/api/responses/getResponsesCountByStatus?listingId=${listing.id}`);
      if (response.ok) {
        const data = await response.json();
        counts[listing.id] = data; 
      }
    }
    setResponseCountsByStatus(counts); 
  };

  const handlePublish = async (listingId) => {
    try {
      const response = await fetch('/api/publisher/publishListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
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
        body: JSON.stringify({ listingId }),
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
                <Link href={`/listing/${listing.id}`}>
                  <h2 className="text-xl font-bold">{listing.title}</h2>
                </Link>
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
                {/* Отображение количества откликов */}
                <div className="mt-2">
                  <p>Количество откликов: {responseCounts[listing.id] || 0}</p>
                  {responseCountsByStatus[listing.id] && (
                    <div>
                      <p>Ожидающие отклики: {responseCountsByStatus[listing.id].pending || 0}</p>
                      <p>Обработанные отклики: {responseCountsByStatus[listing.id].approved || 0}</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handlePublish(listing.id)}
                    disabled={listing.published}
                    className={`px-4 py-2 text-white rounded-md ${listing.published ? 'bg-gray-400' : 'bg-green-500'}`}
                  >
                    Опубликовать
                  </button>
                  <button
                    onClick={() => handleUnpublish(listing.id)}
                    disabled={!listing.published}
                    className={`px-4 py-2 text-white rounded-md ${!listing.published ? 'bg-gray-400' : 'bg-red-500'}`}
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
