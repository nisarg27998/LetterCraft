# LetterCraft 📝

A professional letter creation and management system built with HTML, CSS, JavaScript, Firebase, and Vite for optimized builds.

## Features

✨ **Core Features:**

- Create professional letters with structured format
- View and search through all letters
- Pagination for large letter collections
- Download letters as PDF (all users) and DOCX (admin only)
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

## Demo

### Admin Access

- **Email:** admin@sample.com
- **Password:** AdminPass@123
- Can create, edit, and download letters in both PDF and DOCX formats

### Regular Users

- Can view and search letters
- Can download letters in PDF format only

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/lettercraft.git
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
     `javascript
     rules_version = '2';
      service cloud.firestore {
         match /databases/{database}/documents {
            match /letters/{document} {
               allow read: if true;
               allow write: if request.auth != null && request.auth.token.email == 'admin@sample.com';
            }
         }
      }
     `

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
4. Download as PDF (or DOCX for admin).

### Features by User Type

| Feature        | Admin | Regular User |
| -------------- | ----- | ------------ |
| View Letters   | ✅    | ✅           |
| Search Letters | ✅    | ✅           |
| Create Letters | ✅    | ❌           |
| Download PDF   | ✅    | ✅           |
| Download DOCX  | ✅    | ❌           |

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Build Tool:** Vite (minification and bundling)
- **Backend:** Firebase (Firestore, Authentication, Hosting)
- **Libraries:**
  - Font Awesome (icons)
  - jsPDF (PDF generation)
  - docx.js (DOCX generation)
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
- docx.js for DOCX generation

---

**Built with ❤️ for professional letter management**
