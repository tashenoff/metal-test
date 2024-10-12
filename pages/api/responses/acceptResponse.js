// pages/api/responses/acceptResponse.js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { responseId } = req.body;

        // Принять отклик
        if (!responseId) {
            return res.status(400).json({ message: 'Необходим responseId.' });
        }

        try {
            const response = await prisma.response.update({
                where: { id: responseId },
                data: { accepted: true, status: 'approved' }, // Обновляем статус
            });

            return res.status(200).json(response);
        } catch (error) {
            console.error('Ошибка при принятии отклика:', error);
            return res.status(500).json({ message: 'Ошибка при принятии отклика.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    }
}
