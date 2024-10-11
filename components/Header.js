// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [role, setRole] = useState(null); // Добавлено для хранения роли пользователя
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // Пользователь авторизован
      // Получаем информацию о пользователе для получения баллов и роли
      const fetchUserData = async () => {
        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Передаем токен в заголовках
          },
        });
        if (response.ok) {
          const user = await response.json();
          setPoints(user.points); // Устанавливаем баллы пользователя
          setRole(user.role); // Устанавливаем роль пользователя
        }
      };
      fetchUserData();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен
    router.push('/login'); // Перенаправляем на страницу входа
  };

  return (
    <header>
      <h1>Мое приложение</h1>
      <nav>
        {isLoggedIn ? (
          <>
            <Link href="/listings">Объявления</Link>
            {role === 'PUBLISHER' && (
              <>
                <button onClick={handleLogout}>Выход</button>
              </>
            )}
            {role === 'RESPONDER' && (
              <>
                <p>Баллы: {points}</p> {/* Отображение баллов только для RESPONDER */}
                <button onClick={handleLogout}>Выход</button>
              </>
            )}
            {/* Условия для отображения создания объявления только для PUBLISHER */}
            {role === 'PUBLISHER' && (
              <Link href="/create-listing">Создать объявление</Link>
            )}
          </>
        ) : (
          <>
            <Link href="/login">Вход</Link>
            <Link href="/register">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
