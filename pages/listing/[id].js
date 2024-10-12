import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

const ListingPage = () => {
  const [listing, setListing] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [role, setRole] = useState(null); // Добавлено состояние для роли
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

    if (response.ok) {
      const newResponse = await response.json();
      setResponses((prevResponses) => [...prevResponses, newResponse]);
      setFeedback('Отклик успешно отправлен!');
      setResponseMessage('');
    } else {
      const errorData = await response.json();
      setFeedback(`Ошибка при отправке отклика: ${errorData.message}`);
    }
  };

  // Проверяем, отправлял ли текущий пользователь отклик
  const hasResponded = responses.some((response) => response.responderId === userId); // Используем userId для проверки

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
        <div>
          <h2>Отклики на ваше объявление:</h2>
          <ul>
            {responses.map((response) => (
              <li key={response.id}>
                <p><strong>Сообщение:</strong> {response.message}</p>
                <p><strong>Пользователь:</strong> {response.responderId}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default ListingPage;
