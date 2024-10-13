// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Header = () => {
    const router = useRouter();
    const [points, setPoints] = useState(0);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(''); // Инициализация состояния для имени пользователя
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const fetchUserData = async () => {
                const response = await fetch('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const user = await response.json();
                    setPoints(user.points);
                    setRole(user.role);
                    setUsername(user.name); // Устанавливаем имя пользователя
                }
            };
            fetchUserData();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Мое приложение</h1>
                <nav className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/listings" className="hover:underline">
                                Объявления
                            </Link>



                            {role !== 'PUBLISHER' && (
                                <Link href="/responses" className="hover:underline">
                                    Мои отклики
                                </Link>
                            )}
                            {role === 'PUBLISHER' && (
                                <div className="flex space-x-4">
                                    <Link href="/create-listing" className="hover:underline">
                                        Создать объявление
                                    </Link>
                                    <Link href="/publisher" className="hover:underline">
                                        Мои объявления
                                    </Link>
                                </div>
                            )}

                            <span className="text-sm">
                                
                            {`Привет, ${username}! `}
                                {role === 'RESPONDER' && `Баллы: ${points}`}</span>
                            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded">
                                Выход
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:underline">
                                Вход
                            </Link>
                            <Link href="/register" className="hover:underline">
                                Регистрация
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
