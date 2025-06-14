import { Resend } from "resend";
import { getEnvVariables } from "~/env/get-env-variables";

const resend = new Resend(getEnvVariables().RESEND_API_KEY);

interface SendEmailParams {
  to: string[] | string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams) {
  return await resend.emails.send({
    from: "JobTrackr <onboarding@resend.dev>",
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}
