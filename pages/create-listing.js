// pages/create-listing.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'; // Импортируем dynamic из next/dynamic
import Header from '../components/Header';

// Импортируем react-quill динамически, чтобы избежать проблем с SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Импортируем стили для react-quill

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false); // Состояние для отслеживания клиентского рендера
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Перенаправление на страницу входа
    }
    setIsClient(true); // Устанавливаем, что мы на клиенте
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Создание объявления</h1>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Заголовок:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Содержимое:
            </label>
            {isClient && ( // Условный рендеринг только для клиента
              <ReactQuill
                value={content}
                onChange={setContent}
                required
                className="shadow appearance-none border rounded w-full"
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            Добавить объявление
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
