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
- Firebase authentication
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

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "lettercraft"
3. Enable Authentication with Email/Password
4. Enable Firestore Database
5. Update the Firebase configuration in `app.js` with your project details

### 3. Firebase Configuration
Replace the Firebase config in `app.js`:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
};
```

### 4. Firestore Security Rules
Set up the following security rules in Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /letters/{document} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.data.keys().hasAll(['letterNumber', 'subject', 'mainBody'])
                   && request.resource.data.letterNumber is string
                   && request.resource.data.subject is string;
    }
  }
}
```

### 5. Authentication Setup
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Create the admin user:
   - Email: admin@sample.com
   - Password: AdminPass@123

### 6. Deploy to GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source as "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your site will be available at `https://yourusername.github.io/lettercraft`

## File Structure

```
lettercraft/
├── index.html          # Main HTML file
├── styles.css          # CSS styles with theme support
├── app.js             # JavaScript functionality
├── README.md          # Project documentation
└── assets/            # Additional assets (if any)
```

## Usage

### Creating Letters (Admin Only)
1. Login with admin credentials
2. Click "New Letter" button
3. Fill in all required fields:
   - Letter Number (auto-generated)
   - Letter Date
   - Salutation
   - Subject
   - Main Body
   - Special Remarks (optional)
   - Closing
4. Click "Save Letter"

### Viewing Letters (All Users)
1. Letters are displayed in a grid layout
2. Use the search bar to find specific letters
3. Click on any letter card to preview
4. Download as PDF (or DOCX for admin)

### Features by User Type

| Feature | Admin | Regular User |
|---------|-------|--------------|
| View Letters | ✅ | ✅ |
| Search Letters | ✅ | ✅ |
| Create Letters | ✅ | ❌ |
| Download PDF | ✅ | ✅ |
| Download DOCX | ✅ | ❌ |

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Firebase (Firestore, Authentication)
- **Libraries:** 
  - Font Awesome (icons)
  - jsPDF (PDF generation)
  - docx.js (DOCX generation)
- **Hosting:** GitHub Pages

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Provide steps to reproduce the problem

## Acknowledgments

- Firebase for backend services
- Font Awesome for icons
- jsPDF for PDF generation
- docx.js for DOCX generation

---

**Built with ❤️ for professional letter management**