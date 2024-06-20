import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACTuYpnLld325FPWB2MxA_QwLpdqvOSUA",
  authDomain: "preciousobinna24-deed8.firebaseapp.com",
  projectId: "preciousobinna24-deed8",
  storageBucket: "preciousobinna24-deed8.appspot.com",
  messagingSenderId: "991734324907",
  appId: "1:991734324907:web:3f1bae1214377ae21861ee",
  measurementId: "G-BBD9R6NKRB",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", async () => {
  const BODY = document.querySelector("body");
  const MAIN_CONTAINER = document.querySelector("main .container");

  // Header
  const HEADER = `
    <header>
      <div class="container">
        <a href="../index.html"><img src="../images/PO-HD_Secondary.png" alt="header logo"></a>
      </div>
    </header>
  `;

  const MAIN = `<main><div class="container"><div></main>`;

  // Login Form
  const LOGIN_FORM = `
    <section id="login-section">
      <h2>Login</h2>
      <form id="login-form">
        <input type="text" id="username" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <p id="login-error" style="color: red; display: none;">Invalid username or password</p>
    </section>
  `;

  // Render Header and Login Form
  BODY.innerHTML = HEADER + LOGIN_FORM + MAIN;

  // Function to validate login credentials
  function validateLogin(username, password) {
    // Replace with your actual admin credentials
    const adminUsername = "admin";
    const adminPassword = "admin123";
    return username === adminUsername && password === adminPassword;
  }

  // Event listener for login form submission
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginError = document.getElementById("login-error");

    if (validateLogin(username, password)) {
      // Render admin page if login is successful
      BODY.innerHTML = HEADER + MAIN;
      renderAdminPage();
    } else {
      // Display error message if login fails
      loginError.style.display = "block";
    }
  });

  function renderAdminPage() {
    const MAIN_CONTAINER = document.querySelector("main .container");
    if (!MAIN_CONTAINER) {
      console.error("Main container not found");
      return;
    }

    const SEARCH_INPUT = `
      <div class="input-n-title">
        <input type="text" id="search-input" placeholder="Search by name">
        <span id="info">Choose event: 
        <select id="event-filter">
          <option value="pre-main">Vow Ceremony</option>
          <option value="main">Cocktail Hour and Dinner</option>
        </select>

        <p id="guest-count">Total Guests: 0</p> <!-- Guest count element -->
      </div>
    `;

    const BUTTONS = `
    <div id="show-buttons">
      <button id="show-guest-list-button">Show Guest List</button>
      <button id="show-donations-button">Show Donations</button>
    </div>
    `;

    // Admin page content
    const ADMIN_CONTENT = `
      <section id="admin-section">
        <div id="guest-list" class="container" style="display:none;">
          <!-- Guest list will be rendered here -->
        </div>
        <div id="donations-list" class="container" style="display:none;">
          <!-- Donations list will be rendered here -->
        </div>
      </section>
    `;

    MAIN_CONTAINER.innerHTML = SEARCH_INPUT + BUTTONS + ADMIN_CONTENT;

    // Fetch and render guest data initially
    renderGuestData();

    // Set up event listeners for search and filter input
    document
      .getElementById("search-input")
      .addEventListener("input", () => {
        if (document.getElementById("guest-list").style.display === "block") {
          renderGuestData();
        } else if (document.getElementById("donations-list").style.display === "block") {
          renderDonationsData();
        }
      });
    document
      .getElementById("event-filter")
      .addEventListener("change", () => {
        if (document.getElementById("guest-list").style.display === "block") {
          renderGuestData();
        }
      });

    // Event listener for guest list button
    document
      .getElementById("show-guest-list-button")
      .addEventListener("click", () => {
        document.getElementById("guest-list").style.display = "block";
        document.getElementById("donations-list").style.display = "none";
        document.getElementById("info").style.display = "block"
        renderGuestData();
      });

    // Event listener for donations button
    document
      .getElementById("show-donations-button")
      .addEventListener("click", () => {
        document.getElementById("guest-list").style.display = "none";
        document.getElementById("donations-list").style.display = "block";
        document.getElementById("info").style.display = "none"
        renderDonationsData();
      });
  }

  async function renderGuestData() {
    try {
      const searchValue = document
        .getElementById("search-input")
        .value.trim()
        .toLowerCase();
      const filterValue = document.getElementById("event-filter").value;
      const guestsRef = collection(db, "guests");
      const querySnapshot = await getDocs(guestsRef);
      const guestList = document.getElementById("guest-list");
      guestList.innerHTML = ""; // Clear previous content
      let count = 0; // Initialize count
      let filteredCount = 0; // Initialize filtered count

      // Create table and table headers
      const table = document.createElement("table");
      table.setAttribute("class", "guest-table");
      const tableHead = `
        <thead>
          <tr>
            <th>#</th>
            <th>Guest</th>
            <th>Side of Family</th>
            <th>Event Attending</th>
          </tr>
        </thead>
      `;
      table.innerHTML = tableHead;

      const tableBody = document.createElement("tbody");

      querySnapshot.forEach((doc) => {
        const guestData = doc.data();
        const guestName = guestData.name.toLowerCase();
        let eventInfo = "";

        // Determine the event type to display and apply filtering criteria
        if (
          filterValue === "pre-main" &&
          guestData.events === "pre-main, main"
        ) {
          eventInfo = "Vow Ceremony";
        } else if (
          filterValue === "main" &&
          (guestData.events === "pre-main, main" || guestData.events === "main")
        ) {
          eventInfo = "Cocktail Hour and Dinner";
        }

        // Apply search and filter criteria
        if (eventInfo && guestName.includes(searchValue)) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${filteredCount + 1}</td>
            <td>${guestData.name}</td>
            <td>${guestData.sideOfFamily}</td>
            <td>${eventInfo}</td>
          `;
          tableBody.appendChild(row);
          filteredCount++; // Increment filtered count for the next item
        }
        count++; // Increment total count
      });

      table.appendChild(tableBody);
      guestList.appendChild(table);

      // Update guest count
      const guestCountElement = document.getElementById("guest-count");
      guestCountElement.textContent = `Total Guests: ${filteredCount}`;
    } catch (error) {
      console.error("Error getting guest data:", error);
    }
  }

  async function renderDonationsData() {
    try {
      const searchValue = document
        .getElementById("search-input")
        .value.trim()
        .toLowerCase();
      const donationsRef = collection(db, "donations");
      const querySnapshot = await getDocs(donationsRef);
      const donationsList = document.getElementById("donations-list");
      donationsList.innerHTML = ""; // Clear previous content
      donationsList.style.display = "block";

      // Create table and table headers
      const table = document.createElement("table");
      table.setAttribute("class", "donations-table");
      const tableHead = `
        <thead>
          <tr>
                       
            <th>Name</th>
            <th>Phone Number</th>
            <th>Proof of Donation</th>
          </tr>
        </thead>
      `;
      table.innerHTML = tableHead;

      const tableBody = document.createElement("tbody");

      querySnapshot.forEach((doc, index) => {
        const donationData = doc.data();
        const donorName = donationData.name.toLowerCase();

        // Apply search criteria
        if (donorName.includes(searchValue)) {
          const row = document.createElement("tr");
          row.innerHTML = `
         
            <td>${donationData.name}</td>
            <td>${donationData.phone}</td>
            <td><button class="proof-button" data-url="${donationData.proofURL}">View Proof</button></td>
          `;
          tableBody.appendChild(row);


          
        }
      });

      table.appendChild(tableBody);
      donationsList.appendChild(table);

      // Add event listener to proof buttons
      document.querySelectorAll(".proof-button").forEach(button => {
        button.addEventListener("click", async (event) => {
          const url = event.target.getAttribute("data-url");
          const imageUrl = await getDownloadURL(ref(storage, url));
          showModal(imageUrl);
        });
      });
    } catch (error) {
      console.error("Error getting donation data:", error);
    }
  }

  function showModal(imageUrl) {
    const modal = document.createElement("div");
    modal.setAttribute("class", "modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <img src="${imageUrl}" alt="Proof of Donation">
      </div>
    `;
    document.body.appendChild(modal);

    // Add event listener to close button
    modal.querySelector(".close-button").addEventListener("click", () => {
      modal.remove();
    });

    // Add event listener to close modal when clicking outside of content
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }
});
