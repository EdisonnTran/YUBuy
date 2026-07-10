import nodemailer from 'nodemailer'

//Sets up email transporter using Gmail and YUBuy email creds in .env 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

//Sending from YUBuy account
export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `YUBuy <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  })
}