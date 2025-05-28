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
        showSuccessMessage('Logged in successfully!');
    } catch (error) {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

async function logout() {
    try {
        await auth.signOut();
        showSuccessMessage('Logged out successfully!');
    } catch (error) {
        console.error('Logout error:', error);
        showErrorMessage('Failed to logout. Please try again.');
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
        
        showSuccessMessage('Letter has been successfully created');
    } catch (error) {
        console.error('Error creating letter:', error);
        showErrorMessage('Failed to create letter. Please try again.');
    }
}

async function updateLetter(letterId, letterData) {
    try {
        await db.collection('letters').doc(letterId).update(letterData);
        
        // Hide form and reset
        letterForm.classList.remove('show');
        toggleFormBtn.classList.remove('active');
        setTimeout(() => {
            letterForm.style.display = 'none';
            createLetterForm.reset();
            // Reset custom inputs
            document.getElementById('customSalutation').classList.remove('show');
            document.getElementById('customClosing').classList.remove('show');
        }, 300);
        
        await loadLetters();
        showSuccessMessage('Letter has been successfully updated');
    } catch (error) {
        console.error('Error updating letter:', error);
        showErrorMessage('Failed to update letter. Please try again.');
    }
}

// Initialize TinyMCE editors
function initializeEditors() {
    tinymce.init({
        selector: '.tinymce-editor',
        height: 300,
        setup: function(editor) {
            editor.on('change', function() {
                editor.save(); // Sync content back to textarea
            });
        },
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }'
    });
}

// Update the letter preview function to handle HTML content
function showLetterPreview(letterId) {
    const letter = letters.find(l => l.id === letterId);
    if (!letter) return;
    
    const previewHTML = `
        <div class="letter-preview">
            <div class="letter-meta">
                <div>Letter No: ${letter.letterNumber}</div>
                <div>Date: ${formatDate(letter.letterDate)}</div>
            </div>
            
            <div class="sender-recipient">
                <div>From: ${letter.senderName}</div>
                <div>To: ${letter.recipientName}</div>
            </div>
            
            <div style="margin: 2rem 0;">
                <strong>${letter.salutation}</strong>
            </div>
            
            <div style="margin: 2rem 0; text-align: center;">
                <strong><u>Subject: ${letter.subject}</u></strong>
            </div>
            
            <div class="letter-body">
                ${letter.mainBody}
            </div>
            
            ${letter.specialRemarks ? `
                <div style="margin: 2rem 0;">
                    <strong>Special Remarks:</strong><br>
                    ${letter.specialRemarks}
                </div>
            ` : ''}
            
            <div class="letter-closing">
                ${letter.closing}
            </div>
        </div>
    `;
    
    letterPreview.innerHTML = previewHTML;
    previewModal.style.display = 'block';
    
    const printLetter = document.getElementById('printLetter');
    const editLetter = document.getElementById('editLetter');
    const deleteLetter = document.getElementById('deleteLetter');
    const downloadPdf = document.getElementById('downloadPdf');  // Add this line
    
    if (isAdmin) {
        editLetter.style.display = 'inline-flex';
        deleteLetter.style.display = 'inline-flex';
        editLetter.onclick = () => editLetterForm(letter);
        deleteLetter.onclick = () => showDeleteConfirmation(letter.id);
    }
    
    printLetter.onclick = () => window.print();
    downloadPdf.onclick = () => generatePDF(letter);  // Add this line
}

function hidePreview() {
    previewModal.style.display = 'none';
    letterPreview.innerHTML = '';
}

function showSuccessMessage(message) {
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const successOk = document.getElementById('successOk');
    
    successMessage.textContent = message;
    successModal.style.display = 'block';
    
    successOk.onclick = () => {
        successModal.style.display = 'none';
    };
}

function showErrorMessage(message) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const errorOk = document.getElementById('errorOk');
    
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
    
    errorOk.onclick = () => {
        errorModal.style.display = 'none';
    };
}

function showDeleteConfirmation(letterId) {
    if (!isAdmin) return;
    
    const deleteModal = document.getElementById('deleteModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    
    deleteModal.style.display = 'block';
    
    confirmDelete.onclick = async () => {
        try {
            await db.collection('letters').doc(letterId).delete();
            deleteModal.style.display = 'none';
            previewModal.style.display = 'none';
            await loadLetters();
            showSuccessMessage('Letter has been successfully deleted');
        } catch (error) {
            console.error('Error deleting letter:', error);
            showErrorMessage('Failed to delete letter. Please try again.');
        }
    };
    
    cancelDelete.onclick = () => {
        deleteModal.style.display = 'none';
    };
}

async function editLetterForm(letter) {
    // Hide preview modal
    previewModal.style.display = 'none';
    
    // Show form with letter data
    letterForm.style.display = 'block';
    setTimeout(() => {
        letterForm.classList.add('show');
        toggleFormBtn.classList.add('active');
    }, 10);
    
    // Populate form fields
    document.getElementById('letterNumber').value = letter.letterNumber;
    document.getElementById('letterDate').value = letter.letterDate;
    
    // Handle salutation
    const salutationSelect = document.getElementById('salutation');
    const customSalutation = document.getElementById('customSalutation');
    if (salutationSelect.querySelector(`option[value="${letter.salutation}"]`)) {
        salutationSelect.value = letter.salutation;
        customSalutation.classList.remove('show');
    } else {
        salutationSelect.value = 'custom';
        customSalutation.value = letter.salutation;
        customSalutation.classList.add('show');
    }
    
    document.getElementById('subject').value = letter.subject;
    tinymce.get('mainBody').setContent(letter.mainBody);
    tinymce.get('specialRemarks').setContent(letter.specialRemarks || '');
    
    // Handle closing
    const closingSelect = document.getElementById('closing');
    const customClosing = document.getElementById('customClosing');
    if (closingSelect.querySelector(`option[value="${letter.closing}"]`)) {
        closingSelect.value = letter.closing;
        customClosing.classList.remove('show');
    } else {
        closingSelect.value = 'custom';
        customClosing.value = letter.closing;
        customClosing.classList.add('show');
    }
    
    // Store the letter ID for updating
    createLetterForm.setAttribute('data-editing-id', letter.id);
    
    // Update form submit handler
    createLetterForm.removeEventListener('submit', createLetterHandler);
    createLetterForm.addEventListener('submit', updateLetterHandler);
}

// Separate handlers for create and update
async function createLetterHandler(e) {
    e.preventDefault();
    
    // Get TinyMCE content
    const mainBodyContent = tinymce.get('mainBody').getContent().trim();
    
    // Validate required fields
    if (!mainBodyContent) {
        showErrorMessage('Letter body is required');
        return;
    }
    
    const salutationSelect = document.getElementById('salutation');
    const customSalutation = document.getElementById('customSalutation');
    const salutation = salutationSelect.value === 'custom' ? customSalutation.value : salutationSelect.value;
    
    const closingSelect = document.getElementById('closing');
    const customClosing = document.getElementById('customClosing');
    const closing = closingSelect.value === 'custom' ? customClosing.value : closingSelect.value;
    
    const letterData = {
        letterNumber: document.getElementById('letterNumber').value,
        letterDate: document.getElementById('letterDate').value,
        salutation: salutation,
        subject: document.getElementById('subject').value,
        mainBody: mainBodyContent,
        specialRemarks: tinymce.get('specialRemarks').getContent(),
        closing: closing,
        senderName: document.getElementById('senderName').value,
        recipientName: document.getElementById('recipientName').value,
    };
    
    await createLetter(letterData);
}

async function updateLetterHandler(e) {
    e.preventDefault();
    const letterId = createLetterForm.getAttribute('data-editing-id');
    
    const salutationSelect = document.getElementById('salutation');
    const customSalutation = document.getElementById('customSalutation');
    const salutation = salutationSelect.value === 'custom' ? customSalutation.value : salutationSelect.value;
    
    const closingSelect = document.getElementById('closing');
    const customClosing = document.getElementById('customClosing');
    const closing = closingSelect.value === 'custom' ? customClosing.value : closingSelect.value;
    
    const letterData = {
        letterNumber: document.getElementById('letterNumber').value,
        letterDate: document.getElementById('letterDate').value,
        salutation: salutation,
        subject: document.getElementById('subject').value,
        mainBody: tinymce.get('mainBody').getContent(),
        specialRemarks: tinymce.get('specialRemarks').getContent(),
        closing: closing,
        updatedAt: new Date().toISOString()
    };
    
    await updateLetter(letterId, letterData);
    
    // Reset form to create mode
    createLetterForm.removeAttribute('data-editing-id');
    createLetterForm.removeEventListener('submit', updateLetterHandler);
    createLetterForm.addEventListener('submit', createLetterHandler);
}

// PDF Generation
function generatePDF(letter) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont('times');
    doc.setFontSize(12);
    
    // Letter header
    doc.text(`Letter No: ${letter.letterNumber}`, 20, 20);
    doc.text(`Date: ${formatDate(letter.letterDate)}`, 150, 20);
    
    // Sender and recipient
    doc.text(`From: ${letter.senderName}`, 20, 40);
    doc.text(`To: ${letter.recipientName}`, 20, 50);
    
    // Subject (centered)
    doc.setFont('times', 'bold');
    const subjectText = `Subject: ${letter.subject}`;
    const subjectWidth = doc.getTextWidth(subjectText);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(subjectText, (pageWidth - subjectWidth) / 2, 70);
    
    // Main content
    doc.setFont('times', 'normal');
    const mainBodyLines = doc.splitTextToSize(letter.mainBody, 170);
    doc.text(mainBodyLines, 20, 90);
    
    // Save the PDF
    doc.save(`Letter-${letter.letterNumber}.pdf`);
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
    
    // Update the toggle form button click handler
    toggleFormBtn.addEventListener('click', function() {
        if (letterForm.style.display === 'none' || letterForm.style.display === '') {
            // Show form
            letterForm.style.display = 'block';
            setTimeout(() => letterForm.classList.add('show'), 10);
            this.classList.add('active');
            document.getElementById('letterNumber').value = generateLetterNumber();
        } else {
            // Hide form
            letterForm.classList.remove('show');
            this.classList.remove('active');
            setTimeout(() => {
                letterForm.style.display = 'none';
                createLetterForm.reset();
                // Reset custom inputs
                document.getElementById('customSalutation').classList.remove('show');
                document.getElementById('customClosing').classList.remove('show');
            }, 300);
        }
    });
    
    // Update the cancel button handler
    document.getElementById('cancelForm').addEventListener('click', function() {
        letterForm.classList.remove('show');
        toggleFormBtn.classList.remove('active');
        setTimeout(() => {
            letterForm.style.display = 'none';
            createLetterForm.reset();
            // Reset custom inputs
            document.getElementById('customSalutation').classList.remove('show');
            document.getElementById('customClosing').classList.remove('show');
        }, 300);
    });
    
    // Add create handler to form
    createLetterForm.addEventListener('submit', createLetterHandler);
    
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
    
    initializeEditors();
});

// Make functions globally available for onclick handlers
window.showLetterPreview = showLetterPreview;
window.showDeleteConfirmation = showDeleteConfirmation;
window.changePage = changePage;