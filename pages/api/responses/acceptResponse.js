// pages/api/responses/acceptResponse.js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { responseId } = req.body;

        // Проверяем наличие responseId
        if (!responseId) {
            return res.status(400).json({ message: 'Необходим responseId.' });
        }

        try {
            // Обновляем отклик, устанавливая его статус на 'accepted'
            const response = await prisma.response.update({
                where: { id: responseId },
                data: { accepted: true, status: 'approved' }, // Обновляем статус отклика
            });

            // Получаем идентификатор объявления из отклика
            const listingId = response.listingId; // Предполагаем, что у вас есть это поле в отклике

            // Обновляем статус публикации объявления на false
            // await prisma.listing.update({
                // where: { id: listingId },
                // data: { published: false }, // Устанавливаем статус публикации на false
            // });

            return res.status(200).json({ response, message: 'Отклик принят и статус объявления обновлен.' });
        } catch (error) {
            console.error('Ошибка при принятии отклика:', error);
            return res.status(500).json({ message: 'Ошибка при принятии отклика.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    }
}
