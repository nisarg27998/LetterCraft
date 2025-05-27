// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQftta-eSPlu9K66wVhhy3B_5BUQ2-TyI",
  authDomain: "lettercraft-c71f7.firebaseapp.com",
  projectId: "lettercraft-c71f7",
  storageBucket: "lettercraft-c71f7.firebasestorage.app",
  messagingSenderId: "510521753035",
  appId: "1:510521753035:web:916ad725921a2c1907ca4e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global Variables
let currentUser = null;
let isAdmin = false;
let letters = [];
let filteredLetters = [];
let currentPage = 1;
const lettersPerPage = 10;

// DOM Elements
const loadingScreen = document.getElementById("loadingScreen");
const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userEmail = document.getElementById("userEmail");
const adminPanel = document.getElementById("adminPanel");
const letterForm = document.getElementById("letterForm");
const toggleFormBtn = document.getElementById("toggleForm");
const createLetterForm = document.getElementById("createLetterForm");
const lettersGrid = document.getElementById("lettersGrid");
const lettersLoading = document.getElementById("lettersLoading");
const searchInput = document.getElementById("searchInput");
const pagination = document.getElementById("pagination");
const previewModal = document.getElementById("previewModal");
const letterPreview = document.getElementById("letterPreview");
const themeToggle = document.getElementById("themeToggle");

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// Authentication Functions
function showLogin() {
  loginModal.style.display = "block";
}

function hideLogin() {
  loginModal.style.display = "none";
  document.getElementById("loginForm").reset();
  document.getElementById("loginError").style.display = "none";
}

function updateUIForUser(user) {
  if (user) {
    currentUser = user;
    isAdmin = user.email === "admin@sample.com";

    loginBtn.style.display = "none";
    userInfo.style.display = "flex";
    userEmail.textContent = user.email;

    if (isAdmin) {
      adminPanel.style.display = "block";
    } else {
      adminPanel.style.display = "none";
    }
  } else {
    currentUser = null;
    isAdmin = false;

    loginBtn.style.display = "block";
    userInfo.style.display = "none";
    adminPanel.style.display = "none";
  }
}

async function login(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    hideLogin();
  } catch (error) {
    const errorDiv = document.getElementById("loginError");
    errorDiv.textContent = error.message;
    errorDiv.style.display = "block";
  }
}

async function logout() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Letter Management Functions
async function loadLetters() {
  lettersLoading.style.display = "block";
  lettersGrid.innerHTML = "";

  try {
    const snapshot = await db
      .collection("letters")
      .orderBy("letterDate", "desc")
      .get();
    letters = [];

    snapshot.forEach((doc) => {
      letters.push({ id: doc.id, ...doc.data() });
    });

    filteredLetters = [...letters];
    renderLetters();
  } catch (error) {
    console.error("Error loading letters:", error);
    lettersGrid.innerHTML = "<p>Error loading letters. Please try again.</p>";
  } finally {
    lettersLoading.style.display = "none";
  }
}

function renderLetters() {
  const startIndex = (currentPage - 1) * lettersPerPage;
  const endIndex = startIndex + lettersPerPage;
  const lettersToShow = filteredLetters.slice(startIndex, endIndex);

  if (lettersToShow.length === 0) {
    lettersGrid.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No letters found.</p>';
    pagination.innerHTML = "";
    return;
  }

  lettersGrid.innerHTML = lettersToShow
    .map(
      (letter) => `
        <div class="letter-card" onclick="showLetterPreview('${letter.id}')">
            <div class="letter-card-header">
                <span class="letter-number">#${letter.letterNumber}</span>
                <span class="letter-date">${formatDate(
                  letter.letterDate
                )}</span>
            </div>
            <h3 class="letter-subject">${letter.subject}</h3>
            <p class="letter-preview-text">${letter.mainBody.substring(
              0,
              150
            )}${letter.mainBody.length > 150 ? "..." : ""}</p>
        </div>
    `
    )
    .join("");

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredLetters.length / lettersPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  // Previous button
  paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${
    currentPage === 1 ? "disabled" : ""
  }>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      paginationHTML += `
                <button onclick="changePage(${i})" ${
        i === currentPage ? 'class="active"' : ""
      }>
                    ${i}
                </button>
            `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      paginationHTML += "<span>...</span>";
    }
  }

  // Next button
  paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${
    currentPage === totalPages ? "disabled" : ""
  }>
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

  if (query === "") {
    filteredLetters = [...letters];
  } else {
    filteredLetters = letters.filter(
      (letter) =>
        letter.letterNumber.toLowerCase().includes(query) ||
        letter.subject.toLowerCase().includes(query) ||
        letter.mainBody.toLowerCase().includes(query) ||
        letter.salutation.toLowerCase().includes(query) ||
        (letter.specialRemarks &&
          letter.specialRemarks.toLowerCase().includes(query))
    );
  }

  currentPage = 1;
  renderLetters();
}

async function createLetter(letterData) {
  try {
    await db.collection("letters").add({
      ...letterData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: currentUser.email,
    });

    // Reset form and hide it
    createLetterForm.reset();
    letterForm.style.display = "none";
    toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i> New Letter';

    // Reload letters
    await loadLetters();

    alert("Letter created successfully!");
  } catch (error) {
    console.error("Error creating letter:", error);
    alert("Error creating letter. Please try again.");
  }
}

function showLetterPreview(letterId) {
  const letter = letters.find((l) => l.id === letterId);
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
                ${letter.mainBody.replace(/\n/g, "<br>")}
            </div>
            
            ${
              letter.specialRemarks
                ? `
                <div style="margin: 2rem 0;">
                    <strong>Special Remarks:</strong><br>
                    ${letter.specialRemarks.replace(/\n/g, "<br>")}
                </div>
            `
                : ""
            }
            
            <div class="letter-closing">
                ${letter.closing}
            </div>
        </div>
    `;

  letterPreview.innerHTML = previewHTML;
  previewModal.style.display = "block";

  // Setup download buttons
  const downloadPdf = document.getElementById("downloadPdf");
  const downloadDocx = document.getElementById("downloadDocx");

  downloadPdf.onclick = () => generatePDF(letter);
  downloadDocx.onclick = () => generateDOCX(letter);

  // Show DOCX button only for admin
  downloadDocx.style.display = isAdmin ? "inline-flex" : "none";
}

function hidePreview() {
  previewModal.style.display = "none";
}

// PDF Generation
function generatePDF(letter) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Set font
  doc.setFont("times");

  // Header
  doc.setFontSize(12);
  doc.text(`Letter No: ${letter.letterNumber}`, 20, 20);
  doc.text(`Date: ${formatDate(letter.letterDate)}`, 150, 20);

  // Salutation
  doc.setFontSize(12);
  doc.text(letter.salutation, 20, 40);

  // Subject
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  const subjectText = `Subject: ${letter.subject}`;
  const subjectWidth = doc.getTextWidth(subjectText);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(subjectText, (pageWidth - subjectWidth) / 2, 60);

  // Main Body
  doc.setFont("times", "normal");
  const splitBody = doc.splitTextToSize(letter.mainBody, 170);
  doc.text(splitBody, 20, 80);

  let yPosition = 80 + splitBody.length * 5;

  // Special Remarks
  if (letter.specialRemarks) {
    yPosition += 10;
    doc.setFont("times", "bold");
    doc.text("Special Remarks:", 20, yPosition);
    doc.setFont("times", "normal");
    yPosition += 7;
    const splitRemarks = doc.splitTextToSize(letter.specialRemarks, 170);
    doc.text(splitRemarks, 20, yPosition);
    yPosition += splitRemarks.length * 5;
  }

  // Closing
  yPosition += 20;
  doc.text(letter.closing, 130, yPosition);

  // Download
  doc.save(`Letter_${letter.letterNumber}.pdf`);
}

// DOCX Generation (Admin only)
function generateDOCX(letter) {
  if (!isAdmin) return;

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun(`Letter No: ${letter.letterNumber}`),
              new docx.TextRun(
                `\t\t\t\tDate: ${formatDate(letter.letterDate)}`
              ),
            ],
          }),
          new docx.Paragraph({
            children: [new docx.TextRun("")],
          }),
          new docx.Paragraph({
            children: [new docx.TextRun(letter.salutation)],
          }),
          new docx.Paragraph({
            children: [new docx.TextRun("")],
          }),
          new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            children: [
              new docx.TextRun({
                text: `Subject: ${letter.subject}`,
                bold: true,
                underline: {},
              }),
            ],
          }),
          new docx.Paragraph({
            children: [new docx.TextRun("")],
          }),
          new docx.Paragraph({
            children: [new docx.TextRun(letter.mainBody)],
          }),
        ],
      },
    ],
  });

  if (letter.specialRemarks) {
    doc.sections[0].children.push(
      new docx.Paragraph({
        children: [new docx.TextRun("")],
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Special Remarks:",
            bold: true,
          }),
        ],
      }),
      new docx.Paragraph({
        children: [new docx.TextRun(letter.specialRemarks)],
      })
    );
  }

  doc.sections[0].children.push(
    new docx.Paragraph({
      children: [new docx.TextRun("")],
    }),
    new docx.Paragraph({
      alignment: docx.AlignmentType.RIGHT,
      children: [new docx.TextRun(letter.closing)],
    })
  );

  docx.Packer.toBlob(doc).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Letter_${letter.letterNumber}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function generateLetterNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const time =
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0");
  return `LC${year}${month}${day}${time}`;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize theme
  initTheme();

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("letterDate").value = today;

  // Generate default letter number
  document.getElementById("letterNumber").value = generateLetterNumber();

  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Login modal
  loginBtn.addEventListener("click", showLogin);
  document.getElementById("closeLogin").addEventListener("click", hideLogin);

  // Login form
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

  // Logout
  logoutBtn.addEventListener("click", logout);

  // Toggle letter form
  toggleFormBtn.addEventListener("click", function () {
    if (
      letterForm.style.display === "none" ||
      letterForm.style.display === ""
    ) {
      letterForm.style.display = "block";
      this.innerHTML = '<i class="fas fa-minus"></i> Cancel';
      // Generate new letter number
      document.getElementById("letterNumber").value = generateLetterNumber();
    } else {
      letterForm.style.display = "none";
      this.innerHTML = '<i class="fas fa-plus"></i> New Letter';
      createLetterForm.reset();
    }
  });

  // Cancel form
  document.getElementById("cancelForm").addEventListener("click", function () {
    letterForm.style.display = "none";
    toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i> New Letter';
    createLetterForm.reset();
  });

  // Create letter form
  createLetterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const letterData = {
      letterNumber: document.getElementById("letterNumber").value,
      letterDate: document.getElementById("letterDate").value,
      salutation: document.getElementById("salutation").value,
      subject: document.getElementById("subject").value,
      mainBody: document.getElementById("mainBody").value,
      specialRemarks: document.getElementById("specialRemarks").value,
      closing: document.getElementById("closing").value,
    };

    createLetter(letterData);
  });

  // Search
  searchInput.addEventListener("input", searchLetters);

  // Preview modal close
  document
    .getElementById("closePreview")
    .addEventListener("click", hidePreview);

  // Close modals when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      hideLogin();
    }
    if (event.target === previewModal) {
      hidePreview();
    }
  });

  // Firebase auth state listener
  auth.onAuthStateChanged(function (user) {
    updateUIForUser(user);
    if (user) {
      loadLetters();
    } else {
      letters = [];
      filteredLetters = [];
      lettersGrid.innerHTML =
        '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Please login to view letters.</p>';
      pagination.innerHTML = "";
    }

    // Hide loading screen
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 1000);
  });
});

// Make functions globally available for onclick handlers
window.showLetterPreview = showLetterPreview;
window.changePage = changePage;
