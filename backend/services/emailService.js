const nodemailer = require("nodemailer");

/**
 * Experiment 8 — Email Notification Service
 * Uses Nodemailer with configurable SMTP environment variables.
 * Safe failure handling: Never throws or interrupts primary database flows.
 */

const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT, 10) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
    });
};

/**
 * Base safe email sender
 */
const sendMail = async ({ to, subject, text, html }) => {
    if (!to || typeof to !== "string" || !to.includes("@")) {
        console.warn("[EmailService] Invalid recipient email address. Skipping email dispatch.");
        return { success: false, reason: "Invalid recipient email" };
    }

    const transporter = getTransporter();

    if (!transporter) {
        console.log(
            `[EmailService] SMTP not fully configured. Email to "${to}" with subject "${subject}" skipped safely.`
        );
        return { success: false, reason: "SMTP credentials not configured" };
    }

    const fromAddress =
        process.env.SMTP_FROM || process.env.EMAIL_FROM || '"Sponnect Platform" <no-reply@sponnect.com>';

    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to,
            subject,
            text,
            html,
        });

        console.log(`[EmailService] Email sent successfully to ${to} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        // Safe logging — never expose credentials or secret tokens
        console.error(`[EmailService] Non-blocking email dispatch failure to ${to}:`, err.message);
        return { success: false, error: err.message };
    }
};

/**
 * Send email when a request/approach status changes (accepted or declined)
 */
const sendRequestStatusEmail = async ({
    recipientEmail,
    recipientName,
    actorName,
    status,
    entityTitle,
    isApproach = false,
}) => {
    const isAccepted = status === "accepted";
    const statusLabel = isAccepted ? "Accepted" : "Declined";
    const typeLabel = isApproach ? "Sponsorship Approach" : "Sponsorship Request";

    const subject = isAccepted
        ? `[Sponnect] Your ${typeLabel} for "${entityTitle}" Was Accepted! 🎉`
        : `[Sponnect] Update on Your ${typeLabel} for "${entityTitle}"`;

    const textBody = `Hello ${recipientName || "Sponnect User"},

We are writing to notify you that ${actorName || "the counterpart"} has ${status} your ${typeLabel.toLowerCase()} regarding "${entityTitle}".

Status: ${statusLabel.toUpperCase()}
Item: ${entityTitle}
Updated By: ${actorName || "Account Representative"}

${
    isAccepted
        ? "Congratulations! An active partnership has been initiated. You can now coordinate deliverables and terms directly via your Sponnect portal."
        : "While this opportunity could not be completed, we encourage exploring other open listings on Sponnect."
}

Best regards,
The Sponnect Team
https://sponnect.college`;

    const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="padding-bottom: 16px; border-bottom: 1px solid #edf2f7;">
            <h2 style="margin: 0; color: #4338ca; font-size: 20px; font-weight: 700;">Sponnect College Sponsorship Management</h2>
        </div>
        <div style="padding: 24px 0;">
            <p style="font-size: 15px; color: #1e293b; margin: 0 0 16px;">Hello <strong>${recipientName || "Partner"}</strong>,</p>
            <p style="font-size: 15px; color: #334155; line-height: 1.5; margin: 0 0 20px;">
                <strong>${actorName || "The partner organization"}</strong> has <strong>${status}</strong> your ${typeLabel.toLowerCase()} for <strong>"${entityTitle}"</strong>.
            </p>
            <div style="background-color: ${isAccepted ? "#f0fdf4" : "#fef2f2"}; border: 1px solid ${isAccepted ? "#bbf7d0" : "#fecaca"}; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px; font-size: 13px; color: ${isAccepted ? "#166534" : "#991b1b"}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Status Update</p>
                <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${isAccepted ? "#15803d" : "#b91c1c"};">
                    ${isAccepted ? "Accepted 🎉" : "Declined"}
                </p>
            </div>
            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin: 0;">
                ${
                    isAccepted
                        ? "A partnership has been initiated. Log in to your Sponnect portal to view active agreements and deliverable milestones."
                        : "Thank you for engaging through Sponnect. You may continue to explore active opportunities on the discovery dashboard."
                }
            </p>
        </div>
        <div style="padding-top: 16px; border-top: 1px solid #edf2f7; font-size: 12px; color: #94a3b8; text-align: center;">
            &copy; ${new Date().getFullYear()} Sponnect. All rights reserved. Automatic system notification.
        </div>
    </div>
    `;

    return await sendMail({
        to: recipientEmail,
        subject,
        text: textBody,
        html: htmlBody,
    });
};

/**
 * Send email when a partnership is created
 */
const sendPartnershipCreatedEmail = async ({
    recipientEmail,
    recipientName,
    partnerName,
    entityTitle,
    supportProvided,
}) => {
    const subject = `[Sponnect] Partnership Confirmed for "${entityTitle}" 🤝`;

    const textBody = `Hello ${recipientName || "Partner"},

We are delighted to confirm that a partnership agreement between ${recipientName || "your team"} and ${partnerName || "your partner"} for "${entityTitle}" is now active!

Partner Organization: ${partnerName || "Corporate / Committee Partner"}
Focus Event / Opportunity: ${entityTitle}
Support / Deliverables: ${supportProvided || "Agreed terms"}

Please visit your Sponnect portal to track deliverables, milestones, and status.

Warm regards,
The Sponnect Team`;

    const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="padding-bottom: 16px; border-bottom: 1px solid #edf2f7;">
            <h2 style="margin: 0; color: #4338ca; font-size: 20px; font-weight: 700;">Sponnect College Sponsorship Management</h2>
        </div>
        <div style="padding: 24px 0;">
            <p style="font-size: 15px; color: #1e293b; margin: 0 0 16px;">Hello <strong>${recipientName || "Partner"}</strong>,</p>
            <p style="font-size: 15px; color: #334155; line-height: 1.5; margin: 0 0 20px;">
                We are thrilled to announce that your new partnership with <strong>${partnerName || "the partner organization"}</strong> for <strong>"${entityTitle}"</strong> has been successfully established!
            </p>
            <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #5b21b6; font-weight: 600; text-transform: uppercase;">Partnership Active 🤝</p>
                <p style="margin: 0 0 4px; font-size: 14px; color: #334155;"><strong>Event / Focus:</strong> ${entityTitle}</p>
                <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Support Details:</strong> ${supportProvided || "Standard deliverables"}</p>
            </div>
            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin: 0;">
                You can monitor deliverable proofs and milestone updates from the Partnerships tab in your Sponnect dashboard.
            </p>
        </div>
        <div style="padding-top: 16px; border-top: 1px solid #edf2f7; font-size: 12px; color: #94a3b8; text-align: center;">
            &copy; ${new Date().getFullYear()} Sponnect. All rights reserved. Automatic system notification.
        </div>
    </div>
    `;

    return await sendMail({
        to: recipientEmail,
        subject,
        text: textBody,
        html: htmlBody,
    });
};

module.exports = {
    sendMail,
    sendRequestStatusEmail,
    sendPartnershipCreatedEmail,
};
