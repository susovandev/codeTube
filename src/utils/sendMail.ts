import { createTransport } from 'nodemailer';
import { config } from '../config/config';

export const sendResetPasswordEmail = async (
  to: string,
  subject: string,
  message: string,
) => {
  const transport = createTransport({
    service: 'gmail',
    auth: {
      user: config.userEmail,
      pass: config.userEmailPassword,
    },
  });

  await transport.sendMail({
    from: config.userEmail,
    to,
    subject,
    html: message,
  });
};
