// pages/create-listing.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Перенаправление на страницу входа
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Передаем токен в заголовках
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      setMessage('Объявление успешно добавлено!');
      setTitle('');
      setContent('');
    } else {
      setMessage('Ошибка при добавлении объявления.');
    }
  };

  return (
    <div>
         <Header />
      <h1>Создание объявления</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Заголовок:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Содержимое:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Добавить объявление</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateListing;
