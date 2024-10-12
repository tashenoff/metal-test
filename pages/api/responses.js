// pages/api/responses.js
import prisma from '../../prisma/client';

export default async function handler(req, res) {
    try {
        console.log('Received request method:', req.method);

        if (req.method === 'POST') {
            const { listingId, message } = req.body;

            // Проверяем, пришли ли listingId и message в теле запроса
            if (!listingId || !message) {
                return res.status(400).json({ message: 'Необходимы listingId и message.' });
            }

            console.log('Received body:', { listingId, message });

            const userId = 10; // Замените на логику получения ID пользователя
            console.log('User ID:', userId);

            // Получаем информацию о пользователе
            const user = await prisma.user.findUnique({ where: { id: userId } });
            console.log('User data:', user);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }

            // Проверяем, есть ли у пользователя достаточно баллов
            if (user.points === null || user.points <= 0) {
                return res.status(400).json({ message: 'Недостаточно баллов для отклика.' });
            }

            // Получаем информацию о объявлении
            const listing = await prisma.listing.findUnique({ where: { id: parseInt(listingId) } });
            console.log('Listing data:', listing);

            if (!listing) {
                return res.status(404).json({ message: 'Объявление не найдено.' });
            }

            // Проверка, является ли пользователь владельцем объявления
            if (listing.authorId === userId) {
                return res.status(403).json({ message: 'Владелец объявления не может отправлять отклики.' });
            }

            // Проверка, есть ли уже отклик от этого респондента на данное объявление
            const existingResponse = await prisma.response.findFirst({
                where: {
                    responderId: userId,
                    listingId: parseInt(listingId),
                },
            });
            console.log('Existing response:', existingResponse);

            if (existingResponse) {
                return res.status(400).json({ message: 'Вы уже отправили отклик на это объявление.' });
            }

            // Создаем новый отклик
            const response = await prisma.response.create({
                data: {
                    responderId: userId,
                    listingId: parseInt(listingId),
                    message,
                    accepted: false, // По умолчанию отклик не принят
                },
            });
            console.log('New response created:', response);

            // Обновляем баллы пользователя
            await prisma.user.update({
                where: { id: userId },
                data: { points: user.points - 1 },
            });

            return res.status(201).json(response);
        } else if (req.method === 'GET') {
            const { id: listingId } = req.query; // Изменено на id
            console.log('Fetching responses for listing ID:', listingId);

            // Получаем отклики на данное объявление
            const responses = await prisma.response.findMany({
                where: { listingId: parseInt(listingId) },
                include: {
                    responder: true, // Это включит данные о респонденте
                },
            });

            return res.status(200).json(responses);
        }

        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера.', error: error.message });
    }
}
