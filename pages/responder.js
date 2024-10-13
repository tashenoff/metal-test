// pages/responder.js
import { useRouter } from 'next/router';
import ResponderInfo from '../components/ResponderInfo';
import Header from '../components/Header';

const ResponderPage = () => {
    const router = useRouter();
    const { id } = router.query; // Получаем ID респондента из маршрута

    if (!id) return <p>Загрузка...</p>; // Проверяем, загружен ли ID

    return (
        <div>
            <Header />
            <h1>Информация о респонденте</h1>
            <ResponderInfo id={id} /> {/* Передаем ID в компонент */}
        </div>
    );
};

export default ResponderPage;
