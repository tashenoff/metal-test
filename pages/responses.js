import { useEffect, useState } from 'react';
import Header from '../components/Header';

const ResponsesPage = () => {
    const [responses, setResponses] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // Default to "pending"
    const [selectedResponse, setSelectedResponse] = useState(null); // State for selected response
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                const response = await fetch('/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const user = await response.json();
                    setUserId(user.id);
                    fetchResponses(user.id);
                } else {
                    setFeedback('Ошибка при загрузке данных пользователя.');
                }
            };
            fetchUserData();
        } else {
            setFeedback('Вы должны быть авторизованы для доступа к откликам.');
        }
    }, []);

    const fetchResponses = async (responderId) => {
        const res = await fetch(`/api/responses/getResponses?responderId=${responderId}`);
        if (res.ok) {
            const data = await res.json();
            setResponses(data);
        } else {
            setFeedback('Ошибка при загрузке откликов.');
        }
    };

    // Filter responses by status
    const filteredResponses = responses.filter((response) => response.status === activeTab);

    // Handle opening the modal
    const handleResponseClick = (response) => {
        setSelectedResponse(response);
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResponse(null);
    };

    // Get background color class based on status
    const getStatusClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className='container mx-auto'>
                <h1 className="text-2xl font-bold mb-4">Мои отклики</h1>
                {feedback && <p className="text-red-500 mb-4">{feedback}</p>}

                {/* Tabs */}
                <div className="mb-4">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 mr-2 font-semibold rounded-lg ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Ожидающие
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`px-4 py-2 mr-2 font-semibold rounded-lg ${activeTab === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Одобренные
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 'rejected' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Отклоненные
                    </button>
                </div>

                {/* Responses Table */}
                {filteredResponses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 border-b">Название объявления</th>
                                    <th className="px-4 py-2 border-b">Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResponses.map((response) => (
                                    <tr
                                        key={response.id}
                                        className="hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleResponseClick(response)} // Handle click to open modal
                                    >
                                        <td className="px-4 py-2 border-b">{response.listing.title}</td>
                                        <td className={`px-4 py-2 border-b ${getStatusClass(response.status)}`}>{response.status}</td> {/* Apply status class only to the status cell */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-4 text-gray-600">Нет откликов в данной категории.</p>
                )}

                {/* Modal for displaying full response details */}
                {isModalOpen && selectedResponse && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <h2 className="text-xl font-bold mb-2">{selectedResponse.listing.title}</h2>
                            <p className="mb-2">
                                <strong>Статус:</strong>
                                <span className={`ml-2 ${getStatusClass(selectedResponse.status)}`}>{selectedResponse.status}</span> {/* Apply status class only to the status text */}
                            </p>
                            <p className="mb-2"><strong>Дата отклика:</strong> {new Date(selectedResponse.createdAt).toLocaleDateString()}</p> {/* Add response date */}
                            <p className="mb-2"><strong>Контент:</strong></p>
                            <p className="mb-4">{selectedResponse.listing.content}</p> {/* Display response content */}
                            {selectedResponse.status === 'approved' && ( // Conditional rendering for approved responses
                                <>
                                    <p className="mb-2"><strong>Имя паблишера:</strong> {selectedResponse.listing.author.name}</p>
                                    <p className="mb-2"><strong>Контактная информация:</strong></p>
                                    <ul className="list-disc list-inside mb-2">
                                        <li><strong>Компания:</strong> {selectedResponse.listing.author.companyName}</li>
                                        <li><strong>Телефон:</strong> {selectedResponse.listing.author.phoneNumber}</li>
                                        <li><strong>BIN:</strong> {selectedResponse.listing.author.companyBIN}</li>
                                        <li><strong>Email:</strong> {selectedResponse.listing.author.email}</li>
                                    </ul>
                                </>
                            )}
                            {selectedResponse.status !== 'approved' && ( // Message for non-approved responses
                                <p className="mb-2 text-gray-600">Контактная информация доступна только для одобренных откликов.</p>
                            )}
                            <button
                                onClick={closeModal}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponsesPage;
