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
      setListings(data);
    };

    fetchListings();
  }, []);

  return (
    <div>
         <Header />
      <h1>Объявления</h1>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>
            <Link href={`/listing/${listing.id}`}>
              {listing.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listings;
