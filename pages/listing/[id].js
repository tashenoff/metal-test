// pages/listing/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

const ListingPage = () => {
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        const response = await fetch(`/api/listings/${id}`);
        if (response.ok) {
          const data = await response.json();
          setListing(data);
        } else {
          setError('Ошибка при загрузке объявления.');
        }
      };

      fetchListing();
    }
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!listing) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <Header />
      <h1>{listing.title}</h1>
      <p>{listing.content}</p>
      <p>Автор: {listing.authorId}</p>
    </div>
  );
};

export default ListingPage;
