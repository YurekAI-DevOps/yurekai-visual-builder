import { Config } from "@/wab/server/config";
import { Project, User } from "@/wab/server/entities/Entities";
import { getUser } from "@/wab/server/routes/util";
import { fullName } from "@/wab/shared/ApiSchemaUtil";
import { ResourceType } from "@/wab/shared/perms";
import { Request } from "express-serve-static-core";

export interface ShareEmailProps {
  config: Config;
  sharer: User;
  resourceType: ResourceType;
  resourceName: string;
  resourceUrl: string;
  email: string;
  isInviteeExistingUser: boolean;
}

function generateShareEmail({
  email,
  config,
  sharer,
  resourceType,
  resourceName,
  resourceUrl,
  isInviteeExistingUser,
}: ShareEmailProps) {
  return `${fullName(
    sharer
  )} is using Builder YurekAI and has invited you to the ${resourceType} "${resourceName}":

${resourceUrl}

${
  isInviteeExistingUser
    ? ""
    : `
    -

    Builder YurekAI is a visual website and application builder.

    `.trim()
}`;
}

export async function sendAppEndUserInviteEmail(
  req: Request,
  {
    email,
    appName,
    url,
    sharer,
  }: { sharer: User; email: string; appName: string; url: string }
) {
  await req.mailer.sendMail({
    from: req.config.mailFrom,
    to: email,
    bcc: req.config.mailBcc,
    subject: `${fullName(sharer)} invited you to ${appName}`,
    text: `${fullName(sharer)} invited you to use ${appName}.

${url}
`,
  });
}

function generateEmailVerificationLink(
  host: string,
  token: string,
  nextPath?: string
) {
  return `${host}/email-verification?token=${encodeURIComponent(token)}${
    nextPath ? `&continueTo=${encodeURIComponent(nextPath)}` : ""
  }`;
}

export async function sendShareEmail(
  req: Request,
  sharer: User,
  email: string,
  resourceType: ResourceType,
  resourceName: string,
  resourceUrl: string,
  isInviteeExistingUser: boolean
) {
  await req.mailer.sendMail({
    from: req.config.mailFrom,
    replyTo: sharer.email,
    to: email,
    bcc: req.config.mailBcc,
    subject: `${fullName(
      sharer
    )} invited you to ${resourceType} "${resourceName}"`,
    text: generateShareEmail({
      email,
      sharer,
      resourceType,
      resourceName,
      resourceUrl,
      config: req.config,
      isInviteeExistingUser,
    }),
  });
}

export async function sendInviteApprovalAdminEmail(
  req: Request,
  email: string,
  project: Project
) {
  await req.mailer.sendMail({
    from: req.config.mailFrom,
    to: req.config.mailUserOps,
    subject: `[Admin] ${fullName(getUser(req))} wants to invite ${email} to "${
      project.name
    }"`,
    text: `Go to the admin panel to whitelist this user or domain:

${req.config.host}/admin

Then we'll send out any queued share emails to the associated user(s).
    `,
  });
}

export async function sendWelcomeEmail(
  req: Request,
  email: string,
  token: string,
  nextPath?: string
) {
  const emailVerificationLink = generateEmailVerificationLink(
    req.config.host,
    token,
    nextPath
  );

  const welcomeEmailBody = `
  <p><strong>Thanks for signing up for Builder YurekAI!</strong></p>

  ${
    token
      ? `<p>To start using Builder YurekAI, just click in the link below</p>
    <a href="${emailVerificationLink}">${emailVerificationLink}</a>`
      : ""
  }

  <p>We're excited to see what you build with Builder YurekAI!</p>

  <p>- The Builder YurekAI team</p>
  `;

  await req.mailer.sendMail({
    from: req.config.mailFrom,
    to: email,
    bcc: req.config.mailBcc,
    subject: `Welcome to Builder YurekAI`,
    html: welcomeEmailBody,
  });
}

export async function sendInviteEmail(req: Request, email: string) {
  await req.mailer.sendMail({
    from: req.config.mailFrom,
    to: email,
    bcc: req.config.mailBcc,
    subject: `You're invited to Builder YurekAI!`,
    text: `Hello from the Builder YurekAI team!

You're invited to Builder YurekAI's beta program.

Get started by creating your account here:

https://builder.yurekai.com

Please sign up with the email ${email} (or let us know if you prefer a different email).

We look forward to having you!

- The Builder YurekAI team
`,
  });
}

export async function sendResetPasswordEmail(
  req: Request,
  email: string,
  secret: string,
  appInfo?: {
    appName: string;
    nextPath: string;
  }
) {
  const resetPasswordFields = `email=${encodeURIComponent(
    email
  )}&token=${encodeURIComponent(secret)}`;

  const resetPasswordLink = appInfo
    ? `${appInfo.nextPath}&mode=reset+password&${resetPasswordFields}`
    : `${req.config.host}/reset-password?${resetPasswordFields}`;

  await req.mailer.sendMail({
    from: req.config.mailFrom,
    to: email,
    bcc: req.config.mailBcc,
    subject: `Request to reset your password`,
    text: `Did you forget your password? Click in the link below to choose a new one:

${resetPasswordLink}

If you don't mean to reset your password, ignore this email and your password will not change.`,
  });
}

export async function sendBlockedSignupAdminEmail(
  req: Request,
  email: string,
  firstName: string,
  lastName: string
) {
  await req.mailer.sendMail({
    from: req.config.mailFrom,
    to: req.config.mailUserOps,
    subject: `[Admin] ${email} tried to sign up but was not whitelisted`,
    text: `${firstName} ${lastName} <${email}> tried to sign up.

You can go to the admin panel to "Invite & Whitelist" this user:

${req.config.host}/admin
`,
  });
}

const PLASMIC_EMAIL_VERIFICATION_HTML = (
  appName: string,
  emailVerificationLink: string
) => `
<p><strong>Verify your email address</strong></p>

<p>To start using ${appName}, just click in the link below</p>

<a href="${emailVerificationLink}">${emailVerificationLink}</a>

<p>If you didn't create an account in ${appName}, ignore this email.</p>`;

export async function sendEmailVerificationToUser(
  req: Request,
  email: string,
  token: string,
  nextPath?: string,
  appName?: string
) {
  // If the user is signing up for an app, we will perform the email verification
  // in the app authorization page instead of the general email verification page.
  const emailVerificationLink = appName
    ? `${nextPath}&token=${encodeURIComponent(token)}&mode=email+verification`
    : generateEmailVerificationLink(req.config.host, token, nextPath);

  await req.mailer.sendMail({
    from: req.config.mailFrom,
    to: email,
    bcc: req.config.mailBcc,
    subject: `Verify your email address for ${appName ?? "Builder YurekAI"}`,
    html: PLASMIC_EMAIL_VERIFICATION_HTML(
      appName ?? "Builder YurekAI",
      emailVerificationLink
    ),
  });
}
