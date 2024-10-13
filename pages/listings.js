// pages/listings.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import SearchListings from '../components/SearchListings'; // Импортируем компонент поиска

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchMessage, setSearchMessage] = useState(''); // Состояние для сообщения о поиске

    useEffect(() => {
        const fetchListings = async () => {
            const response = await fetch('/api/listings'); // Измените путь, если у вас другой API
            const data = await response.json();
            // Фильтруем объявления, оставляя только опубликованные
            const publishedListings = data.filter((listing) => listing.published);
            setListings(publishedListings);
            setFilteredResults(publishedListings); // Изначально показываем все опубликованные объявления
        };

        fetchListings();
    }, []);

    // Функция для обновления результатов поиска
    const handleSearchResults = (results) => {
        setFilteredResults(results); // Обновляем результаты поиска
        // Устанавливаем сообщение в зависимости от результатов поиска
        if (results.length === 0) {
            setSearchMessage('Поиск не найден'); // Если нет результатов
        } else {
            setSearchMessage(`Результаты поиска: ${results.length}`); // Если найдены результаты
        }
    };

    return (
        <div>
            <Header />
            <div className='container mx-auto'>
                <h1>Объявления</h1>
                <SearchListings onSearchResults={handleSearchResults} /> {/* Передаём функцию для обработки результатов поиска */}
                {searchMessage && <p>{searchMessage}</p>} {/* Выводим сообщение о поиске */}
                {filteredResults.length === 0 ? (
                    <p>Нет опубликованных объявлений.</p>
                ) : (
                    <ul>
                        {filteredResults.map((listing) => (
                            <li className='p-5 bg-white border my-5' key={listing.id}>
                                <Link href={`/listing/${listing.id}`}>
                                    <p className='font-bold'>{listing.title}</p>
                                    <p>{listing.content}</p>
                                    <div className='my-5 border border-t border-opacity-25'>
                                        <p>Дата публикации: {listing.publishedAt}</p>
                                        <p>Срок поставки: {listing.deliveryDate}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Listings;
