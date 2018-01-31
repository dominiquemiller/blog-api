import * as nodeMailer from "nodemailer";
const mandrillTransport = require("nodemailer-mandrill-transport");
import { config } from "../config";

interface EmailOptions {
  from: "string";
  to: "string";
  subject: "string";
  html: "string";
  mandrilOptions?: Options;
}

interface Options {
  [key: string]: any;
}

export class MailerService {
  transport: nodeMailer.Transporter;
  mandrill: any = mandrillTransport;
  environment = process.env.NODE_ENV;
  envConfig = config[this.environment];

  constructor() {
    this.transport = nodeMailer.createTransport(this.mandrill({
      auth: {
        apiKey: this.envConfig.app.mandrill
      }
    }));
  }

  sendMail(emailOptions: EmailOptions) {
    return new Promise ( (res, rej) => {
      this.transport.sendMail(emailOptions, (err: Error, info: any) => {
        if (err) rej(err);
        res(info);
      });
    });
  }

};