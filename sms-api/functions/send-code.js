// POST phone=+15551234567 -> texts a 6-digit code via Twilio Verify.
exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Content-Type", "application/json");

  // US numbers only, matching the app. Also limits SMS fraud to other countries.
  if (!/^\+1\d{10}$/.test(event.phone ?? "")) {
    response.setStatusCode(400);
    response.setBody({ error: "Enter a 10-digit US phone number." });
    return callback(null, response);
  }

  // Demo login for Apple review and class testers: no text is sent (free).
  if (context.DEMO_PHONE && event.phone === context.DEMO_PHONE) {
    response.setBody({ ok: true });
    return callback(null, response);
  }

  try {
    await context
      .getTwilioClient()
      .verify.v2.services(context.VERIFY_SERVICE_SID)
      .verifications.create({ to: event.phone, channel: "sms" });
    response.setBody({ ok: true });
  } catch (e) {
    console.error(e);
    response.setStatusCode(e.status ?? 500);
    response.setBody({
      error: e.code === 60203 ? "Too many codes sent. Wait 10 minutes and try again." : "Couldn't send the code. Try again.",
    });
  }
  return callback(null, response);
};
