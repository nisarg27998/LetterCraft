# LetterCraft 📝

A professional letter creation and management system built with HTML, CSS, JavaScript, Firebase, and Vite for optimized builds.

## Latest Updates (v1.3.5)
- Improved agenda modal styling and accessibility
- Added and documented HTTP security headers (`X-Content-Type-Options`, `Cache-Control`)
- Fixed module script MIME and deployment issues for Firebase Hosting
- Enhanced admin-only agenda creation and preview features
- General bug fixes and deployment improvements


## Latest Updates (v1.3.0)
- Improved authentication error handling
- Firestore rules updated for admin-only write access
- Removed TinyMCE, now uses basic textarea
- Bug fixes and performance improvements

## Latest Updates (v1.2.0)
- Added Rich Text Editor integration with TinyMCE
- Improved PDF generation with proper formatting
- Added sender and recipient fields
- Fixed mobile view icon visibility
- Enhanced search box focus color
- Fixed form validation issues
- Improved dark mode compatibility
- Enhanced success/error messages

## Latest Updates (v1.1.0)
- Added Rich Text Editor for letter content
- Improved loading screens and animations
- Enhanced success/error messages
- Added custom delete confirmations
- Improved letter editing functionality
- Added print functionality
- Enhanced UI animations

## Features

✨ **Core Features:**

- Create professional letters with structured format
- View and search through all letters
- Pagination for large letter collections
- Download letters as PDF
- Dark/Light theme toggle
- Responsive design for all devices

🔐 **Authentication:**

- Firebase Authentication with Email/Password
- Admin panel for letter creation
- Role-based access control
- Secure user management

📱 **User Experience:**

- Clean, modern interface
- Loading screens and smooth animations
- Search functionality
- Mobile-friendly design
- Real-time updates

## Live Demo
Visit [LetterCraft](https://lettercraft-c71f7.web.app)

### Admin Access

- **Email:** admin@sample.com
- **Password:** AdminPass@123
- Can create and edit letters

### Regular Users

- Can view and search letters
- Can download letters in PDF format

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nisarg27998/lettercraft.git
cd lettercraft
```

### 2. Firebase Configuration Setup (IMPORTANT - Security)

1. Copy the example configuration file:
   ```bash
   copy firebaseConfig.example.js firebaseConfig.js
   ```
2. Go to [Firebase Console](https://console.firebase.google.com/)
3. Create a new project named "lettercraft" (or use existing project `lettercraft-c71f7`).
4. Go to **Project Settings** > **General** > **Your apps**.
5. Click **Web** to create a web app.
6. Copy your Firebase configuration.
7. Replace the placeholder values in `firebaseConfig.js` with your actual Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.firebasestorage.app",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id",
   };
   window.firebaseConfig = firebaseConfig;
   ```
8. **NEVER commit `firebaseConfig.js` to version control** (it's in `.gitignore`).

### 3. Firebase Services Setup

1. **Enable Authentication**:

   - In Firebase Console, go to **Authentication** > **Sign-in method**.
   - Enable **Email/Password** authentication.
   - Go to **Authentication** > **Users**.
   - Add the admin user:
     - Email: `admin@sample.com`
     - Password: `AdminPass@123`

2. **Enable Firestore Database**:

   - In Firebase Console, go to **Firestore Database**.
   - Create a database in production mode.

3. **Set Up Firestore Security Rules**:
   - The `firestore.rules` file defines security rules:
     ```javascript
     rules_version = '2';
      service cloud.firestore {
         match /databases/{database}/documents {
            match /letters/{document} {
               allow read: if true;
               allow write: if request.auth != null && request.auth.token.email == 'admin@sample.com';
            }
         }
      }
     ```

### 4. Install Dependencies

1. Install Node.js dependencies (including Vite):
   ```bash
   npm install
   ```

### 5. Install Firebase CLI

1. Install the Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```

### 6. Initialize Firebase Hosting

1. Run:
   ```bash
   firebase init hosting
   ```
2. Select your Firebase project (`lettercraft-c71f7`).
3. Set the public directory to `dist`.
4. Configure as a single-page app (rewrite all URLs to `/index.html`).
5. Do not set up automatic builds with GitHub.

### 7. Build and Deploy

1. Build the project with Vite:
   ```bash
   npm run build
   ```
2. Deploy to Firebase Hosting and Firestore rules:
   ```bash
   firebase deploy
   ```
3. Access your site at the provided URL (e.g., `https://lettercraft-c71f7.web.app`).

## Environment Setup
1. Create `.env` file in project root
2. Add required environment variables:
```env
TINYMCE_API_KEY=your-api-key-here
```

## Security Notes
- Environment variables are not committed to version control
- API keys are stored securely
- Firebase configuration is protected

## File Structure

```
lettercraft/
├── index.html                  # Main HTML file
├── styles.css                  # CSS styles
├── app.js                     # JavaScript functionality
├── firebaseConfig.js          # Firebase config (NOT in version control)
├── firebaseConfig.example.js  # Example config file
├── firestore.rules            # Firestore Security Rules
├── firebase.json              # Firebase configuration
├── vite.config.js             # Vite configuration
├── package.json               # Project dependencies
├── package-lock.json          # Dependency lock file
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
└── assets/                    # Additional assets (if any)
```

## Security Notes

🔒 **Important Security Measures:**

- `firebaseConfig.js` is excluded from version control via `.gitignore`.
- Never commit Firebase credentials to GitHub.
- Use `firebaseConfig.example.js` as a template.
- `firestore.rules` restricts write access to `admin@sample.com`.
- In Google Cloud Console, restrict your Firebase API key to your Firebase Hosting domain (e.g., `https://lettercraft-c71f7.web.app`).

## Usage

### Creating Letters (Admin Only)

1. Log in with admin credentials (`admin@sample.com`, `AdminPass@123`).
2. Click **New Letter** button.
3. Fill in all required fields:
   - Letter Number (auto-generated)
   - Letter Date
   - Salutation
   - Subject
   - Main Body
   - Special Remarks (optional)
   - Closing
4. Click **Save Letter**.

### Viewing Letters (All Users)

1. Letters are displayed in a grid layout.
2. Use the search bar to find specific letters.
3. Click on any letter card to preview.
4. Download as PDF.

### Features by User Type

| Feature        | Admin | Regular User |
| -------------- | ----- | ------------ |
| View Letters   | ✅    | ✅           |
| Search Letters | ✅    | ✅           |
| Create Letters | ✅    | ❌           |
| Download PDF   | ✅    | ✅           |

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Build Tool:** Vite (minification and bundling)
- **Backend:** Firebase (Firestore, Authentication, Hosting)
- **Libraries:**
  - Font Awesome (icons)
  - jsPDF (PDF generation)
- **Hosting:** Firebase Hosting

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
Nisarg Panchal

## Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub.
2. Create a new issue with a detailed description.
3. Provide steps to reproduce the problem.

## Acknowledgments

- Firebase for backend and hosting services
- Vite for build optimization
- Font Awesome for icons
- jsPDF for PDF generation

---

**Built with ❤️ for professional letter management**
