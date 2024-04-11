import { createTransport, SentMessageInfo, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export class Mailer {
  constructor(private transporter: Transporter) {}
  async sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
    mailOptions.from = process.env.NODE_MAILER_FROM;

    if (typeof mailOptions.subject === "string") {
      mailOptions.subject = mailOptions.subject.replace(
        /Plasmic/gim,
        "Builder YurekAI"
      );
    }

    if (typeof mailOptions.html === "string") {
      mailOptions.html = mailOptions.html.replace(
        /Plasmic/gim,
        "Builder YurekAI"
      );
    }

    console.log(`SENDING MAIL`, mailOptions);
    return this.transporter.sendMail(mailOptions);
  }
}

/* OLD
export class Mailer {
  constructor(private transporter: Transporter) {}
  async sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
    if (getSmtpPass()) {
      return this.transporter.sendMail(mailOptions);
    } else {
      console.log(`SENDING MAIL`, mailOptions);
    }
  }
}
*/

export function createMailer() {
  return new Mailer(
    createTransport({
      host: "",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );
}

/* ETHEREAL
export function createMailer() {
  return new Mailer(
    createTransport({
     "host": "smtp.ethereal.email",
      "port": 587,
      "auth": {
          "user": "bo.green7@ethereal.email",
          "pass": "H5n4J81vFSyrKHQkEf"
      },
      "pool": true,
      "maxConnections": 50,
      "maxMessages": 500
    })
  );
}
*/

/* OLD
export function createMailer() {
  return new Mailer(
    createTransport({
      host: "email-smtp.us-west-2.amazonaws.com",
      port: 587,
      auth: {
        user: "AKIA5VNZFKGRPSEJ6X6W",
        pass: getSmtpPass(),
      },
    })
  );
}
*/
