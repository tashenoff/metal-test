// pages/api/responses/declineResponse.js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { responseId } = req.body;

        // Отклонить отклик
        if (!responseId) {
            return res.status(400).json({ message: 'Необходим responseId.' });
        }

        try {
            await prisma.response.update({
                where: { id: responseId },
                data: { accepted: false, status: 'rejected' }, // Обновляем статус
            });

            return res.status(204).end(); // Успешное удаление без контента
        } catch (error) {
            console.error('Ошибка при отклонении отклика:', error);
            return res.status(500).json({ message: 'Ошибка при отклонении отклика.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    }
}
