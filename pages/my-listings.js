// pages/my-listings.js
import { useEffect, useState } from 'react';
import Header from '../components/Header';

const MyListings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/my-listings'); // Ваш API для получения объявлений PUBLISHER
      const data = await response.json();
      setListings(data);
    };

    fetchListings();
  }, []);

  // Функция для одобрения отклика
  const approveResponse = async (responseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/responses/${responseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'approved' }), // Обновляем статус
    });

    if (response.ok) {
      // Обновить состояние или повторно запросить данные
      console.log('Отклик одобрен');
      // Здесь вы можете обновить список откликов, если хотите
      // Например, повторно запросить данные
      const updatedListings = await fetchListings(); // Перезагружаем объявления
      setListings(updatedListings);
    } else {
      console.error('Ошибка при одобрении отклика');
    }
  };

  return (
    <div>
      <Header />
      <h1>Мои объявления</h1>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>
            <h2>{listing.title}</h2>
            <p>{listing.content}</p>
            <h3>Отклики:</h3>
            <ul>
              {listing.responses.map((response) => (
                <li key={response.id}>
                  <p>Отклик от: {response.responder.email}</p>
                  <button onClick={() => approveResponse(response.id)}>Одобрить</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyListings;
