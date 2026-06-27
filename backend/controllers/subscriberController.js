import sendEmail from '../utils/sendEmail.js';

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Пожалуйста, проверьте формат email' });
  }

  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #23312B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e7e4; border-radius: 10px;">
        <h2 style="color: #BA9A5A; text-align: center;">Добро пожаловать в чайный клуб FateLeaf! 🍃</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Здравствуйте! Спасибо, что присоединились к нашему клубу. 
          FateLeaf — это не просто чай. Это многовековая культура, премиальные сорта и забота о каждой чашке, которую вы завариваете.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Как мы и обещали, дарим вам секретный промокод на вашу первую покупку:
        </p>
        <div style="background-color: #23312B; color: #BA9A5A; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 2px; margin: 20px 0;">
          WELCOME10
        </div>
        <p style="font-size: 16px; line-height: 1.5;">
          Используйте его при оформлении заказа и получите скидку 10% на весь ассортимент.
        </p>
        <p style="font-size: 16px; line-height: 1.5; margin-top: 30px;">
          <strong>🎁 Ваш бонус:</strong> Мы подготовили для вас <a href="#" style="color: #BA9A5A; font-weight: bold; text-decoration: none;">Мини-гайд по правильному завариванию чая</a>, чтобы ваш первый глоток был идеальным.
        </p>
        <hr style="border: none; border-top: 1px solid #e1e7e4; margin: 30px 0;">
        <p style="font-size: 14px; color: #7f8c8d; text-align: center;">
          С любовью к чаю,<br>
          Команда FateLeaf
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Добро пожаловать в чайный клуб FateLeaf! Ваш подарок внутри 🎁',
      html: htmlContent,
    });

    res.status(200).json({ message: 'Подписка успешно оформлена' });
  } catch (error) {
    console.error('Ошибка при подписке:', error);
    res.status(500).json({ message: 'Произошла ошибка при подписке. Попробуйте позже.' });
  }
};
