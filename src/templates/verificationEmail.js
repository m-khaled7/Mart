export default (verificationCode, Name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #4CAF50; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Email Verification</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                    Hello ${Name},
                  </p>
                  <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                    Your verification code is:
                  </p>
                  
                  <!-- Verification Code -->
                  <div style="background-color: #f8f8f8; border: 2px dashed #4CAF50; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px;">
                    <span style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px;">
                      ${verificationCode}
                    </span>
                  </div>
                  
                  <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 10px;">
                    This code will expire in <strong>10 minutes</strong>.
                  </p>
                  <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                    If you didn't request this code, please ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © 2025 Your Company. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

