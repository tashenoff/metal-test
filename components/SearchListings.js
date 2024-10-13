// components/SearchListings.js
import { useState } from 'react';

const SearchListings = ({ onSearchResults }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/listings/searchListings?title=${encodeURIComponent(title)}`);
      if (response.ok) {
        const data = await response.json();
        onSearchResults(data); // Передаем только результаты поиска
      } else {
        setError('Ошибка при поиске объявлений.');
        onSearchResults([]); // Если ошибка, очищаем результаты
      }
    } catch (err) {
      setError('Ошибка при поиске объявлений.');
      onSearchResults([]); // Если ошибка, очищаем результаты
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center ">
      <input
        type="text"
        placeholder="Введите заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        Найти
      </button>
      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchListings;
