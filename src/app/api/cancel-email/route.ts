import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, userName, orderName, photoUrl } = body;
        
  
        const cancelNumber = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USER,
                pass: process.env.NEXT_PUBLIC_EMAIL_PASS
            }
        });

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h2 style="text-align: center; color: #8E0F1B;">Order Cancellation #${cancelNumber}</h2>
                <p>Hello, <b>${userName}</b>!</p>
                <p>Your order for <b>${orderName}</b> has been successfully canceled.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <img src="${photoUrl}" alt="${orderName}" style="max-width: 100%; height: auto; max-height: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
                </div>
                
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                
                <p style="font-size: 16px; line-height: 1.5;">We are sorry that you decided to cancel your order, however you can always change your mind and place an order again.</p>
                
                <br/>
                <p style="font-size: 14px; color: #666;">Best regards,<br/><b>E-Shop Glasses Team 😎</b></p>
            </div>
        `;

        const mailOptions = {
            from: process.env.NEXT_PUBLIC_EMAIL_USER,
            to: email,
            subject: `Order Canceled #${cancelNumber} - E-Shop Glasses`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        
        return NextResponse.json({ message: "Cancellation email sent" }, { status: 200 });
    } catch (error) {
        console.error("Error sending cancellation email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}