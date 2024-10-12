// components/ResponsesList.js
import { useEffect, useState } from 'react';

const ResponsesList = ({ listingId }) => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(`/api/responses/${listingId}`);
        const data = await res.json();
        setResponses(data);
      } catch (error) {
        console.error('Ошибка получения откликов:', error);
      }
    };

    fetchResponses();
  }, [listingId]);

  const handleSelect = (responderId) => {
    // Логика для начала работы с выбранным откликнувшимся
    console.log('Выбранный отклик:', responderId);
  };

  return (
    <div>
      <h2>Отклики на ваше объявление</h2>
      {responses.length === 0 ? (
        <p>Нет откликов.</p>
      ) : (
        <ul>
          {responses.map((response) => (
            <li key={response.id}>
              <strong>Отклик от:</strong> {response.responder.name} <br />
              <strong>Сообщение:</strong> {response.message}
              <button onClick={() => handleSelect(response.responderId)}>
                Начать работу
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResponsesList;
