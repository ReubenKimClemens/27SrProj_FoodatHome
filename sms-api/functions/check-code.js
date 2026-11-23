// POST phone=+15551234567&code=123456 -> 200 if the code is right, 400 otherwise.
exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Content-Type", "application/json");

  if (!/^\+1\d{10}$/.test(event.phone ?? "") || !/^\d{6}$/.test(event.code ?? "")) {
    response.setStatusCode(400);
    response.setBody({ error: "Enter the 6-digit code." });
    return callback(null, response);
  }

  // Demo login: fixed code, no text (see send-code.js).
  if (context.DEMO_PHONE && event.phone === context.DEMO_PHONE) {
    const ok = event.code === context.DEMO_CODE;
    response.setStatusCode(ok ? 200 : 400);
    response.setBody(ok ? { ok: true } : { error: "That code is wrong. Try again." });
    return callback(null, response);
  }

  try {
    const check = await context
      .getTwilioClient()
      .verify.v2.services(context.VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: event.phone, code: event.code });
    if (check.status === "approved") {
      response.setBody({ ok: true });
    } else {
      response.setStatusCode(400);
      response.setBody({ error: "That code is wrong. Try again." });
    }
  } catch (e) {
    console.error(e);
    response.setStatusCode(400);
    // 20404: no pending code (expired after 10 min, or already used). 60202: too many wrong tries.
    const messages = {
      20404: "This code has expired. Tap \"Resend code\" for a new one.",
      60202: "Too many wrong tries. Tap \"Resend code\" for a new one.",
    };
    response.setBody({ error: messages[e.code] ?? "Couldn't check the code. Try again." });
  }
  return callback(null, response);
};
