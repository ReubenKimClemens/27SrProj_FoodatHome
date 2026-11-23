# sms-api

Two Twilio Functions that text and check phone login codes through Twilio Verify.
They keep the Twilio keys on Twilio's servers, so the keys never ship inside the app.

- `POST /send-code` with `phone=+15551234567` texts a 6-digit code.
- `POST /check-code` with `phone=+15551234567&code=123456` returns 200 if the code is right, or 400 with `{ error }` if it's wrong, expired, or has had too many tries.

## Setup

1. In the Twilio Console, go to **Verify > Services > Create** (name it "Food at Home") and copy the Service SID.
2. On a trial account, add each tester's phone under **Phone Numbers > Verified Caller IDs**. Trial accounts can only text verified numbers.
3. `cp .env.example .env` and fill in the Account SID, Auth Token, Service SID, and the demo code.
   - Under **Verify > Settings > Geo permissions** (or **Messaging > Settings > Geo permissions**), allow only the United States so nobody can run up international SMS charges.
4. Install the CLI: `brew tap twilio/brew && brew install twilio`, then `twilio login` and `twilio plugins:install @twilio-labs/plugin-serverless`.
5. `npm install`, then `npm run deploy`. Copy the domain it prints (e.g. `https://fah-sms-api-1234-dev.twil.io`).
6. In `FAH/.env`, set `EXPO_PUBLIC_SMS_API_URL` to that domain and restart `npx expo start`.

`npm start` runs the functions locally on port 3000.

## Costs

- About $0.05 per successful login plus under $0.01 per text. Failed or expired codes cost nothing.
- The **demo login** (`DEMO_PHONE` / `DEMO_CODE`) never sends a text and is free. Share it in TestFlight "What to Test" notes and App Store review notes.
- Before inviting the class, upgrade the Twilio account with a **small prepaid balance (~$20)**. That balance is the most we can spend.
- The app keeps users logged in and makes them wait 30 seconds between resends, so most people get only one text.

## TestFlight builds

EAS doesn't upload the gitignored `FAH/.env`. Set `EXPO_PUBLIC_SMS_API_URL` for builds with
`npx eas-cli@latest env:create --name EXPO_PUBLIC_SMS_API_URL --value <domain> --environment preview --environment production --visibility plaintext`.
If it's missing, the build uses fake login and accepts any code.
