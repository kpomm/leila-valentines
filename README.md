# Valentine's Day Proposal Website 💕

A beautiful, interactive website to ask your special someone to be your valentine!

## Features

- 💕 Beautiful gradient background with romantic styling
- 🎉 Confetti animation when "Yes" is clicked
- 😄 "No" button that moves around when clicked
- 💬 Fun "Nice try" messages that appear when trying to click "No"
- 📧 Email tracking for all button clicks (optional)

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Email Tracking Setup (Optional)

To track button clicks via email, you'll need to set up EmailJS:

1. **Create an EmailJS account** at [https://www.emailjs.com/](https://www.emailjs.com/)

2. **Create an Email Service**:
   - Go to Email Services in your EmailJS dashboard
   - Add a new service (Gmail, Outlook, etc.)
   - Follow the setup instructions

3. **Create an Email Template**:
   - Go to Email Templates
   - Create a new template
   - Use these template variables:
     - `{{to_email}}` - recipient email
     - `{{button_type}}` - "yes" or "no"
     - `{{timestamp}}` - when the button was clicked
     - `{{message}}` - the message about what happened

4. **Get your credentials**:
   - Service ID (from your Email Service)
   - Template ID (from your Email Template)
   - Public Key (from Account > API Keys)

5. **Create a `.env` file** in the root directory:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

6. **Restart your dev server** after creating the `.env` file

**Note**: If you don't set up EmailJS, the website will still work perfectly - it just won't send email notifications. The email functionality will fail silently.

## Usage

1. Start the development server: `npm run dev`
2. Open the website in your browser
3. Share the link with your special someone!
4. Watch as they try to click "No" (it will keep moving away!)
5. When they click "Yes", enjoy the confetti celebration! 🎉

## Technologies Used

- React + TypeScript
- Vite
- Canvas Confetti
- EmailJS (for email tracking)

## License

Made with 💕 for your special someone!
