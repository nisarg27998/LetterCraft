# LetterCraft 📝

A professional letter creation and management system built with HTML, CSS, JavaScript, and Firebase. Create, manage, and download letters with ease.

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
   cp firebaseConfig.example.js firebaseConfig.js
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
8. **NEVER commit `firebaseConfig.js` to version control** (it's already in `.gitignore`).

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
   - Create a `firestore.rules` file in your project root with the following content:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /letters/{document} {
           allow read: if request.auth != null;
           allow write: if request.auth != null && request.auth.token.email == 'admin@sample.com';
         }
       }
     }
     ```
   - Update `firebase.json` to reference the rules file:
     ```json
     {
       "hosting": {
         "public": ".",
         "ignore": [
           "firebase.json",
           "**/.*",
           "**/node_modules/**"
         ],
         "rewrites": [
           {
             "source": "**",
             "destination": "/index.html"
           }
         ]
       },
       "firestore": {
         "rules": "firestore.rules"
       }
     }
     ```

4. **Install Firebase CLI**:
   - Install the Firebase CLI globally:
     ```bash
     npm install -g firebase-tools
     ```
   - Log in to Firebase:
     ```bash
     firebase login
     ```

5. **Initialize Firebase Hosting**:
   - Run:
     ```bash
     firebase init hosting
     ```
   - Select your Firebase project (`lettercraft-c71f7`).
   - Set the public directory to `.` (root directory).
   - Configure as a single-page app (rewrite all URLs to `/index.html`).
   - Do not set up automatic builds with GitHub.

6. **Deploy to Firebase Hosting**:
   - Deploy both hosting files and Firestore rules:
     ```bash
     firebase deploy
     ```
   - This deploys your website files (`index.html`, `styles.css`, `app.js`, `firebaseConfig.js`) and `firestore.rules` to Firebase.
   - Access your site at the provided URL (e.g., `https://lettercraft-c71f7.web.app`).

## File Structure

```
lettercraft/
├── index.html                  # Main HTML file
├── styles.css                  # CSS styles with theme support
├── app.js                     # JavaScript functionality
├── firebaseConfig.js          # Firebase config (NOT in version control)
├── firebaseConfig.example.js  # Example config file
├── firestore.rules            # Firestore Security Rules
├── firebase.json              # Firebase configuration
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
└── assets/                    # Additional assets (if any)
```

## Security Notes

🔒 **Important Security Measures:**
- `firebaseConfig.js` contains sensitive Firebase credentials and is excluded from version control via `.gitignore`.
- Never commit your actual Firebase configuration to GitHub.
- Use `firebaseConfig.example.js` as a template for others.
- The `firestore.rules` file restricts write access to `admin@sample.com` and read access to authenticated users.
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

| Feature            | Admin | Regular User |
|--------------------|-------|--------------|
| View Letters       | ✅    | ✅           |
| Search Letters     | ✅    | ✅           |
| Create Letters     | ✅    | ❌           |
| Download PDF       | ✅    | ✅           |
| Download DOCX      | ✅    | ❌           |

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
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
- Font Awesome for icons
- jsPDF for PDF generation
- docx.js for DOCX generation

---

**Built with ❤️ for professional letter management**