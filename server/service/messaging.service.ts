import nodemailer, { Transporter } from "nodemailer";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { IMailgunClient } from "mailgun.js/Interfaces";

interface MailOptions {
	to: string;
	// from: string;
	subject: string;
	html: string;
	text?: string;
}

class MailService {
	private transporter: Transporter | null = null;
	private mg!: IMailgunClient;
	private useMailgun: boolean = false;
	private defaultFrom: string = process.env.MAIL_FROM as string;

	constructor(useMailgun: boolean = false) {
		const mailgun = new Mailgun(formData);

		if (useMailgun) {
			this.mg = mailgun.client({
				username: "api",
				key: process.env.MAILGUN_KEY as string,
			});
		} else {
			this.transporter = nodemailer.createTransport({
				host: process.env.MAIL_HOST,
				port: 465,
				secure: true,
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASSWORD,
				},
				tls: {
					rejectUnauthorized: false,
				},
			});
		}
	}

	private async sendEmail(options: Omit<MailOptions, "from">) {
		const mailOptions = { from: this.defaultFrom, ...options };
		if (this.useMailgun) {
			try {
				const domain = process.env.MAILGUN_DOMAIN as string;
				await this.mg.messages.create(domain, mailOptions);
			} catch (err) {
				console.error("MailGun: Error sending email", err);
				throw new Error("MailGun: Error sending email");
			}
		} else {
			if (!this.transporter) {
				throw new Error("Nodemailer transport is not available");
			}
			try {
				await this.transporter.sendMail(options);
			} catch (err) {
				console.error("Transporter: Error sending email", err);
				throw new Error("Transporter: Error sending email");
			}
		}
	}

	async sendWelcomeEmail(to: string, name: string) {
		const subject = "Welcome!";
		const text = `Hi ${name}. \nWelcome to Circle Connect. We are glad to have you.`;
		const html = `<strong>Hi ${name}. \nWelcome to Circle Connect. We are glad to have you.</strong>`;

		await this.sendEmail({ to, subject, text, html });
	}

	// Method to send reset password email
	async sendResetPasswordEmail(to: string, name: string, resetCode: string) {
		const subject = "Reset Your Password";
		const text = `Hi ${name}. \nPlease use the following code to reset your password: ${resetCode}. It expires in 10 minutes`;
		const html = `<strong>Hi ${name}. \nPlease use the following code to reset your password:</strong> ${resetCode}. It expires in 10 minutes`;

		await this.sendEmail({ to, subject, text, html });
	}

	// Method to send invite email
	async sendInviteEmail(to: string, name: string, inviteLink: string) {
		const subject = "You're Invited!";
		const text = `Hi ${name}. \nYou have been invited to Circle Connect. Please use the following link to accept your invitation: ${inviteLink}`;
		const html = `<strong>Hi ${name}. \nYou have been invited to Circle Connect.</strong> Please use the following link to accept your invitation: <a href="${inviteLink}">${inviteLink}</a>`;

		await this.sendEmail({ to, subject, text, html });
	}
}
const mailService = new MailService();
export default mailService;
