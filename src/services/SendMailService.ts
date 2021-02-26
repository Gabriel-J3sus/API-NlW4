import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

interface VariablesProps {
  name: string;
  title: string;
  description: string;
  id: string;
  link: string;
}

interface MailProps {
  to: string;
  subject: string;
  variables: VariablesProps;
  path: string;
}

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        }
      });

      this.client = transporter;
    })
  }

  async execute({to, subject, variables, path}: MailProps) {
    const templateFileCotent = fs.readFileSync(path).toString("utf-8");

    const mailTemplateParse = handlebars.compile(templateFileCotent)

    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreplay@nps.com.br>"
    })

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
