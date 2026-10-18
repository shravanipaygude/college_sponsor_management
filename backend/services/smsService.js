/**
 * Optional SMS Readiness Service — Feature 3
 * Provides a clean extensibility point for future SMS gateway integration
 * (e.g., Twilio, AWS SNS, MSG91) without requiring paid credentials or
 * external dependencies at this time.
 */

const sendSms = async ({ to, message }) => {
    // Check if SMS provider feature flag is toggled on in future deployment
    if (process.env.SMS_ENABLED !== "true") {
        return {
            success: false,
            provider: "none",
            reason: "SMS notifications are disabled or not configured in this environment (readiness stub).",
        };
    }

    if (!to || !message) {
        return {
            success: false,
            reason: "Missing recipient phone number or message body.",
        };
    }

    // Future SMS provider API call implementation goes here
    console.log(`[SmsService] Readiness hook triggered for phone number: ${to.substring(0, 4)}****`);
    return {
        success: true,
        simulated: true,
        message: "SMS dispatch queued (readiness stub)",
    };
};

module.exports = {
    sendSms,
};
