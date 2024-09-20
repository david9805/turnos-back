import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Cambia esto por el host SMTP de tu proveedor (ej. smtp.gmail.com para Gmail)
        port: 587, // O 465 para SSL
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: 'sorteos@hayueloscc.com', // Tu correo
          pass: 'S0rt30sH@yu3l0s', // Tu contraseña o token de aplicación si estás usando Gmail
        },
      });
    }
  
    async sendMail(to: string, subject: string, text: string, html?: string) {
      const mailOptions = {
        from: '"EVENTOS HAYUELOS" <sorteos@hayueloscc.com>', // El correo del remitente
        to, // El correo del destinatario
        subject, // El asunto del correo
        text, // Texto plano
        html, // Alternativamente puedes enviar HTML
      };
  
      return await this.transporter.sendMail(mailOptions);
    }
}
