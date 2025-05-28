import { auth, db } from './firebaseConfig.js';

// Global Variables
let currentUser = null;
let isAdmin = false;
let letters = [];
let filteredLetters = [];
let currentPage = 1;
const lettersPerPage = 10;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const adminPanel = document.getElementById('adminPanel');
const letterForm = document.getElementById('letterForm');
const toggleFormBtn = document.getElementById('toggleForm');
const createLetterForm = document.getElementById('createLetterForm');
const lettersGrid = document.getElementById('lettersGrid');
const lettersLoading = document.getElementById('lettersLoading');
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination');
const previewModal = document.getElementById('previewModal');
const letterPreview = document.getElementById('letterPreview');
const themeToggle = document.getElementById('themeToggle');
const loginMessage = document.getElementById('loginMessage');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Custom Salutation and Closing Handling
function handleSalutationChange(select) {
    const customInput = document.getElementById('customSalutation');
    if (select.value === 'custom') {
        customInput.classList.add('show');
        customInput.required = true;
        customInput.focus();
    } else {
        customInput.classList.remove('show');
        customInput.required = false;
        customInput.value = '';
    }
}

function handleClosingChange(select) {
    const customInput = document.getElementById('customClosing');
    if (select.value === 'custom') {
        customInput.classList.add('show');
        customInput.required = true;
        customInput.focus();
    } else {
        customInput.classList.remove('show');
        customInput.required = false;
        customInput.value = '';
    }
}

// Authentication Functions
function showLogin() {
    loginModal.style.display = 'block';
}

function hideLogin() {
    loginModal.style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
}

function updateUIForUser(user) {
    if (user) {
        currentUser = user;
        isAdmin = user.email === 'admin@sample.com';
        
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = 'Admin';
        }
        
        adminPanel.style.display = isAdmin ? 'block' : 'none';
        loginMessage.style.display = 'none';
    } else {
        currentUser = null;
        isAdmin = false;
        
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
        adminPanel.style.display = 'none';
        loginMessage.style.display = 'block';
    }
}

async function login(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        hideLogin();
    } catch (error) {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Letter Management Functions
async function loadLetters() {
    lettersLoading.style.display = 'block';
    lettersGrid.innerHTML = '';
    
    try {
        const snapshot = await db.collection('letters').orderBy('letterDate', 'desc').get();
        letters = [];
        
        snapshot.forEach(doc => {
            letters.push({ id: doc.id, ...doc.data() });
        });
        
        filteredLetters = [...letters];
        renderLetters();
    } catch (error) {
        console.error('Error loading letters:', error);
        lettersGrid.innerHTML = '<p>Error loading letters. Please try again.</p>';
    } finally {
        lettersLoading.style.display = 'none';
    }
}

function renderLetters() {
    const startIndex = (currentPage - 1) * lettersPerPage;
    const endIndex = startIndex + lettersPerPage;
    const lettersToShow = filteredLetters.slice(startIndex, endIndex);
    
    if (lettersToShow.length === 0) {
        lettersGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No letters found.</p>';
        pagination.innerHTML = '';
        return;
    }
    
    lettersGrid.innerHTML = lettersToShow.map(letter => `
        <div class="letter-card" onclick="showLetterPreview('${letter.id}')">
            <div class="letter-card-header">
                <span class="letter-number">#${letter.letterNumber}</span>
                <span class="letter-date">${formatDate(letter.letterDate)}</span>
            </div>
            <h3 class="letter-subject">${letter.subject}</h3>
            <p class="letter-preview-text">${letter.mainBody.substring(0, 150)}${letter.mainBody.length > 150 ? '...' : ''}</p>
        </div>
    `).join('');
    
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredLetters.length / lettersPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredLetters.length / lettersPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderLetters();
    }
}

function searchLetters() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        filteredLetters = [...letters];
    } else {
        filteredLetters = letters.filter(letter => 
            letter.letterNumber.toLowerCase().includes(query) ||
            letter.subject.toLowerCase().includes(query) ||
            letter.mainBody.toLowerCase().includes(query) ||
            letter.salutation.toLowerCase().includes(query) ||
            (letter.specialRemarks && letter.specialRemarks.toLowerCase().includes(query))
        );
    }
    
    currentPage = 1;
    renderLetters();
}

async function createLetter(letterData) {
    try {
        await db.collection('letters').add({
            ...letterData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: currentUser.email
        });
        
        createLetterForm.reset();
        letterForm.style.display = 'none';
        toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i> New Letter';
        
        // Reset custom inputs
        document.getElementById('customSalutation').classList.remove('show');
        document.getElementById('customClosing').classList.remove('show');
        
        await loadLetters();
        
        alert('Letter created successfully!');
    } catch (error) {
        console.error('Error creating letter:', error);
        alert('Error creating letter. Please try again.');
    }
}

function showLetterPreview(letterId) {
    const letter = letters.find(l => l.id === letterId);
    if (!letter) return;
    
    const previewHTML = `
        <div class="letter-preview">
            <div class="letter-meta">
                <div>Letter No: ${letter.letterNumber}</div>
                <div>Date: ${formatDate(letter.letterDate)}</div>
            </div>
            
            <div style="margin: 2rem 0;">
                <strong>${letter.salutation}</strong>
            </div>
            
            <div style="margin: 2rem 0; text-align: center;">
                <strong><u>Subject: ${letter.subject}</u></strong>
            </div>
            
            <div class="letter-body">
                ${letter.mainBody.replace(/\n/g, '<br>')}
            </div>
            
            ${letter.specialRemarks ? `
                <div style="margin: 2rem 0;">
                    <strong>Special Remarks:</strong><br>
                    ${letter.specialRemarks.replace(/\n/g, '<br>')}
                </div>
            ` : ''}
            
            <div class="letter-closing">
                ${letter.closing}
            </div>
        </div>
    `;
    
    letterPreview.innerHTML = previewHTML;
    previewModal.style.display = 'block';
    
    const downloadPdf = document.getElementById('downloadPdf');
    const deleteLetter = document.getElementById('deleteLetter');
    
    if (downloadPdf) {
        downloadPdf.onclick = () => generatePDF(letter);
    }
    
    if (deleteLetter) {
        deleteLetter.style.display = isAdmin ? 'inline-flex' : 'none';
        deleteLetter.onclick = () => confirmDeleteLetter(letter.id);
    }
}

function hidePreview() {
    previewModal.style.display = 'none';
    letterPreview.innerHTML = '';
}

async function confirmDeleteLetter(letterId) {
    if (!isAdmin) return;
    
    const confirmed = confirm('Are you sure you want to delete this letter? This action cannot be undone.');
    
    if (confirmed) {
        try {
            await db.collection('letters').doc(letterId).delete();
            hidePreview();
            await loadLetters();
            alert('Letter deleted successfully!');
        } catch (error) {
            console.error('Error deleting letter:', error);
            alert('Error deleting letter. Please try again.');
        }
    }
}

// PDF Generation
function generatePDF(letter) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont('times');
    
    doc.setFontSize(12);
    doc.text(`Letter No: ${letter.letterNumber}`, 20, 20);
    doc.text(`Date: ${formatDate(letter.letterDate)}`, 150, 20);
    
    doc.setFontSize(12);
    doc.text(letter.salutation, 20, 40);
    
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    const subjectText = `Subject: ${letter.subject}`;
    const subjectWidth = doc.getTextWidth(subjectText);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(subjectText, (pageWidth - subjectWidth) / 2, 60);
    
    doc.setFont('times', 'normal');
    const splitBody = doc.splitTextToSize(letter.mainBody, 170);
    doc.text(splitBody, 20, 80);
    
    let yPosition = 80 + (splitBody.length * 5);
    
    if (letter.specialRemarks) {
        yPosition += 10;
        doc.setFont('times', 'bold');
        doc.text('Special Remarks:', 20, yPosition);
        doc.setFont('times', 'normal');
        yPosition += 7;
        const splitRemarks = doc.splitTextToSize(letter.specialRemarks, 170);
        doc.text(splitRemarks, 20, yPosition);
        yPosition += splitRemarks.length * 5;
    }
    
    yPosition += 20;
    doc.text(letter.closing, 130, yPosition);
    
    doc.save(`Letter_${letter.letterNumber}.pdf`);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function generateLetterNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    return `LC${year}${month}${day}${time}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('letterDate').value = today;
    
    document.getElementById('letterNumber').value = generateLetterNumber();
    
    themeToggle.addEventListener('click', toggleTheme);
    
    loginBtn.addEventListener('click', showLogin);
    document.getElementById('closeLogin').addEventListener('click', hideLogin);
    
    // Salutation and Closing change handlers
    document.getElementById('salutation').addEventListener('change', function() {
        handleSalutationChange(this);
    });
    
    document.getElementById('closing').addEventListener('change', function() {
        handleClosingChange(this);
    });
    
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
    
    logoutBtn.addEventListener('click', logout);
    
    toggleFormBtn.addEventListener('click', function() {
        if (letterForm.style.display === 'none' || letterForm.style.display === '') {
            letterForm.style.display = 'block';
            this.innerHTML = '<i class="fas fa-minus"></i> Cancel';
            document.getElementById('letterNumber').value = generateLetterNumber();
        } else {
            letterForm.style.display = 'none';
            this.innerHTML = '<i class="fas fa-plus"></i> New Letter';
            createLetterForm.reset();
            // Reset custom inputs
            document.getElementById('customSalutation').classList.remove('show');
            document.getElementById('customClosing').classList.remove('show');
        }
    });
    
    document.getElementById('cancelForm').addEventListener('click', function() {
        letterForm.style.display = 'none';
        toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i> New Letter';
        createLetterForm.reset();
        // Reset custom inputs
        document.getElementById('customSalutation').classList.remove('show');
        document.getElementById('customClosing').classList.remove('show');
    });
    
    document.getElementById('createLetterForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get salutation value
        const salutationSelect = document.getElementById('salutation');
        const customSalutation = document.getElementById('customSalutation');
        const salutation = salutationSelect.value === 'custom' ? customSalutation.value : salutationSelect.value;
        
        // Get closing value
        const closingSelect = document.getElementById('closing');
        const customClosing = document.getElementById('customClosing');
        const closing = closingSelect.value === 'custom' ? customClosing.value : closingSelect.value;
        
        const letterData = {
            letterNumber: document.getElementById('letterNumber').value,
            letterDate: document.getElementById('letterDate').value,
            salutation: salutation,
            subject: document.getElementById('subject').value,
            mainBody: document.getElementById('mainBody').value,
            specialRemarks: document.getElementById('specialRemarks').value,
            closing: closing
        };
        
        createLetter(letterData);
    });
    
    searchInput.addEventListener('input', searchLetters);
    
    document.getElementById('closePreview').addEventListener('click', hidePreview);
    
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            hideLogin();
        }
        if (event.target === previewModal) {
            hidePreview();
        }
    });
    
    // Load letters for all users
    loadLetters();
    
    // Firebase auth state listener
    auth.onAuthStateChanged(function(user) {
        updateUIForUser(user);
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
    
    // Login link in loginMessage
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', showLogin);
    }
});

// Make functions globally available for onclick handlers
window.showLetterPreview = showLetterPreview;
window.confirmDeleteLetter = confirmDeleteLetter;
window.changePage = changePage;