// pages/listings.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

const Listings = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            const response = await fetch('/api/listings'); // Измените путь, если у вас другой API
            const data = await response.json();
            // Фильтруем объявления, оставляя только опубликованные
            const publishedListings = data.filter((listing) => listing.published);
            setListings(publishedListings);
        };

        fetchListings();
    }, []);

    return (
        <div>
            <Header />
            <h1>Объявления</h1>
            {listings.length === 0 ? (
                <p>Нет опубликованных объявлений.</p>
            ) : (
                <ul>
                    {listings.map((listing) => (
                        <li className='p-5 bg-white border' key={listing.id}>
                            <Link href={`/listing/${listing.id}`}>
                                <p className='font-bold'> {listing.title}</p>
                                <p>{listing.content}</p>
                                <div className='my-5 border border-t border-opacity-25'>
                                    <p>дата публикации: {listing.publishedAt}</p>
                                    <p>срок поставки: {listing.deliveryDate}</p>
                                </div>

                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Listings;
