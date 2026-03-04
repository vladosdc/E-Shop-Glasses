import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, userName, orderName, orderNumber, photoUrl, address } = body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USER,
                pass: process.env.NEXT_PUBLIC_EMAIL_PASS
            }
        });

        const addressHtml = address 
            ? `${address.country}, ${address.city}, ${address.street}, ZIP: ${address.zipCode}, Phone: ${address.phone}`
            : `<em>No delivery address provided in profile. Our manager will clarify it with you.</em>`;


        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h2 style="text-align: center; color: #8E0F1B;">Order Confirmation #${orderNumber}</h2>
                <p>Hello, <b>${userName}</b>!</p>
                <p>Thank you for your order: <b>${orderName}</b></p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <img src="${photoUrl}" alt="${orderName}" style="max-width: 100%; height: auto; max-height: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
                </div>
                
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                
                <p style="font-size: 16px; font-weight: bold;">We will try to process your order as soon as possible!</p>
                <p>Delivery will be made to the following address:<br/>
                <span style="color: #8E0F1B; font-weight: bold; display: inline-block; margin-top: 5px;">${addressHtml}</span><br/><br/>
                after our manager contacts you!</p>
                
                <br/>
                <p style="font-size: 14px; color: #666;">Best regards,<br/><b>E-Shop Glasses Team 😎</b></p>
            </div>
        `;

        const mailOptions = {
            from: process.env.NEXT_PUBLIC_EMAIL_USER,
            to: email,
            subject: `Order Confirmation #${orderNumber} - E-Shop Glasses`,
            html: htmlContent 
        };

        await transporter.sendMail(mailOptions);
        
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}