import nodemailer from 'nodemailer'

//Sets up email transporter using Gmail and YUBuy email creds in .env 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

//Sending from YUBuy account
export const sendEmail = async (to, subject, text) => {
  console.log(`[email] Attempting to send "${subject}" to ${to}...`)
  try {
    const info = await transporter.sendMail({
      from: `YUBuy <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    })
    console.log(`[email] Sent successfully. messageId: ${info.messageId}, response: ${info.response}`)
  } 
  //debugging - checking if code is sent not just on resend code
  catch (error) {
    console.error(`[email] FAILED to send "${subject}" to ${to}:`, error)
    throw error
  }
}