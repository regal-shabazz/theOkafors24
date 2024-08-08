import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
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
const auth = getAuth(app);

// Your existing imports and Firebase configuration

document.addEventListener("DOMContentLoaded", () => {
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
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <p id="login-error" style="color: red; display: none;">Invalid email or password</p>
    </section>
  `;

  // Render Header and Login Form
  BODY.innerHTML = HEADER + LOGIN_FORM + MAIN;

  // Event listener for login form submission
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginError = document.getElementById("login-error");

    try {
      // Sign in user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Render admin page if login is successful
      BODY.innerHTML = HEADER + MAIN;
      renderAdminPage();
    } catch (error) {
      // Display error message if login fails
      loginError.style.display = "block";
      console.error("Error signing in:", error.message);
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
        <p style="color: red; font-size: .9rem; margin-bottom: 20px; font-style: italic">(Choose event then click "Show Guest List")
        <p id="guest-count">Total Guests: 0</p> <!-- Guest count element -->
      </div>
    `;

    const BUTTONS = `
    <div id="show-buttons">
      <button id="show-guest-list-button">Show Guest List</button>
      <button id="show-donations-button" style="display: none;">Show Donations</button>
      <button id="download-guest-list-button" style="display: none;">Download Guest List</button>
      <button id="download-donations-list-button" style="display: none;">Download Donations List</button>
    </div>
    `;

    // Admin page content
    const ADMIN_CONTENT = `
      <section id="admin-section" style="margin-bottom: 100px">
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
        document.getElementById("info").style.display = "block";
        document.getElementById("download-guest-list-button").style.display = "block";
        document.getElementById("download-donations-list-button").style.display = "none";
        renderGuestData();
      });

    // Event listener for donations button
    document
      .getElementById("show-donations-button")
      .addEventListener("click", () => {
        document.getElementById("guest-list").style.display = "none";
        document.getElementById("donations-list").style.display = "block";
        document.getElementById("info").style.display = "none";
        document.getElementById("download-guest-list-button").style.display = "none";
        document.getElementById("download-donations-list-button").style.display = "block";
        renderDonationsData();
      });

    // Event listeners for download buttons
    document
      .getElementById("download-guest-list-button")
      .addEventListener("click", downloadGuestList);

    document
      .getElementById("download-donations-list-button")
      .addEventListener("click", downloadDonationsList);
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
            <th>Actions</th>
          </tr>
        </thead>
      `;
      table.innerHTML = tableHead;

      const tableBody = document.createElement("tbody");

      const guestDataArray = []; // Array to store guest data for CSV

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
            <td style="text-align: center; color: red;"><i class="fas fa-trash delete-icon" data-id="${doc.id}"></i></td>
          `;
          tableBody.appendChild(row);

          // Add guest data to array for CSV
          guestDataArray.push({
            name: guestData.name,
            sideOfFamily: guestData.sideOfFamily,
            event: eventInfo,
          });

          filteredCount++; // Increment filtered count for the next item
        }
        count++; // Increment total count
      });

      table.appendChild(tableBody);
      guestList.appendChild(table);

      // Update guest count
      const guestCount = document.getElementById("guest-count");
      guestCount.textContent = `Total Guests: ${filteredCount}`;

      // Add delete functionality to each delete icon
      const deleteIcons = document.querySelectorAll(".delete-icon");
      deleteIcons.forEach((icon) => {
        icon.addEventListener("click", async (e) => {
          const guestId = e.target.getAttribute("data-id");
          try {
            await deleteDoc(doc(db, "guests", guestId));
            renderGuestData();
          } catch (error) {
            console.error("Error deleting guest:", error);
          }
        });
      });

      // Save guest data array for download
      localStorage.setItem("guestDataArray", JSON.stringify(guestDataArray));
    } catch (error) {
      console.error("Error rendering guest data:", error);
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

      // Create table and table headers
      const table = document.createElement("table");
      table.setAttribute("class", "donations-table");
      const tableHead = `
        <thead>
          <tr>
            <th>#</th>
            <th>Donor Name</th>
            <th>Amount</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
      `;
      table.innerHTML = tableHead;

      const tableBody = document.createElement("tbody");

      const donationsDataArray = []; // Array to store donations data for CSV
      let count = 0;

      querySnapshot.forEach((doc) => {
        const donationData = doc.data();
        const donorName = donationData.donorName.toLowerCase();

        if (donorName.includes(searchValue)) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${count + 1}</td>
            <td>${donationData.donorName}</td>
            <td>$${donationData.amount}</td>
            <td>${donationData.message}</td>
            <td style="text-align: center; color: red;"><i class="fas fa-trash delete-icon" data-id="${doc.id}"></i></td>
          `;
          tableBody.appendChild(row);

          // Add donations data to array for CSV
          donationsDataArray.push({
            donorName: donationData.donorName,
            amount: donationData.amount,
            message: donationData.message,
          });

          count++;
        }
      });

      table.appendChild(tableBody);
      donationsList.appendChild(table);

      // Add delete functionality to each delete icon
      const deleteIcons = document.querySelectorAll(".delete-icon");
      deleteIcons.forEach((icon) => {
        icon.addEventListener("click", async (e) => {
          const donationId = e.target.getAttribute("data-id");
          try {
            await deleteDoc(doc(db, "donations", donationId));
            renderDonationsData();
          } catch (error) {
            console.error("Error deleting donation:", error);
          }
        });
      });

      // Save donations data array for download
      localStorage.setItem(
        "donationsDataArray",
        JSON.stringify(donationsDataArray)
      );
    } catch (error) {
      console.error("Error rendering donations data:", error);
    }
  }

  // Function to convert data array to CSV and trigger download
  function convertToCSV(data) {
    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((item) =>
        Object.values(item)
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");
    return `${headers}\n${rows}`;
  }

  function downloadCSV(filename, csvContent) {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadGuestList() {
    const guestDataArray = JSON.parse(localStorage.getItem("guestDataArray"));
    if (guestDataArray.length === 0) return alert("No guest data available.");
    const csvContent = convertToCSV(guestDataArray);
    downloadCSV("guest_list.csv", csvContent);
  }

  function downloadDonationsList() {
    const donationsDataArray = JSON.parse(
      localStorage.getItem("donationsDataArray")
    );
    if (donationsDataArray.length === 0)
      return alert("No donations data available.");
    const csvContent = convertToCSV(donationsDataArray);
    downloadCSV("donations_list.csv", csvContent);
  }
});
