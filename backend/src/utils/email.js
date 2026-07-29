import { google } from 'googleapis'

// Gmail API sends over HTTPS, not SMTP — this works on Render's free tier,
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
)

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
})

const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

// Builds a base64url that the Gmail API requires
const buildRawMessage = (to, subject, text) => {
  const messageParts = [
    `To: ${to}`,
    `From: YUBuy <${process.env.EMAIL_USER}>`,
    `Subject: ${subject}`,
    '',
    text
  ]
  const message = messageParts.join('\n')

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

//Sending from YUBuy account
export const sendEmail = async (to, subject, text) => {
  console.log(`[email] Attempting to send "${subject}" to ${to}...`)
  try {
    const raw = buildRawMessage(to, subject, text)
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw }
    })
    console.log(`[email] Sent successfully. messageId: ${response.data.id}`)
  }
  //Debugging - checking if code is sent not just on resend code
  catch (error) {
    console.error(`[email] FAILED to send "${subject}" to ${to}:`, error)
    throw error
  }
}