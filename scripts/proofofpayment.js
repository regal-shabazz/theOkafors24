import updateCountdown from "./countdown.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyACTuYpnLld325FPWB2MxA_QwLpdqvOSUA",
  authDomain: "preciousobinna24-deed8.firebaseapp.com",
  projectId: "preciousobinna24-deed8",
  storageBucket: "preciousobinna24-deed8.appspot.com",
  messagingSenderId: "991734324907",
  appId: "1:991734324907:web:3f1bae1214377ae21861ee",
  measurementId: "G-BBD9R6NKRB",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const BODY = document.querySelector("body");

  const HEADER = `
    <header>
      <div class="container">
        <a href="../index.html"><img src="../images/PO-HD_Secondary.png" alt="header logo"></a>
      </div>
    </header>
  `;

  const NAV = `
    <nav>
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../pages/ourstory.html">Our Story</a></li>
        <li><a href="../pages/proofofpayment.html">Gifting</a></li>
        <li><a href="../pages/admin.html">Admin</a></li>
      </ul>
    </nav>
  `;

  const COUNTDOWN = `
    <div id="countdown-container">
      <h5>Countdown to the Big Day</h5>
      <div id="countdown"></div>
    </div>
  `;

  const MAIN = `
    <section id="proof-of-payment-section">
      <div class="container">
        <div>
         <h2 style="display: none;">Proof of Donation</h2>
        <form id="payment-proof-form" style="display: none;">
          <div class="form-group">
            <label for="donor-name">Name:</label>
            <input type="text" id="donor-name" name="name" placeholder="Your Name" required>
          </div>
          <div class="form-group">
            <label for="donor-phone">Phone Number:</label>
            <input type="tel" id="donor-phone" name="phone" placeholder="Your Phone Number" required>
          </div>
          <div class="form-group">
            <label for="proof-of-payment">Proof of Payment:</label>
            <input type="file" id="proof-of-payment" name="proof" accept="image/*" required>
          </div>
          <button type="submit">Upload Proof</button>
          <div id="proof-feedback" style="margin-top: 10px;"></div>
        </form>

         <div id="donation-details">
          <h3>For Gifting</h3>
          <span id="details">
            <span id="bank-account">
              <p><strong>Bank Account Details:</strong></p>
              <p>0107527850 (GTB) - Obinna Okafor</p>
              <p>2130912288 (UBA) - Precious Ike</p>
            </span>
            <span id="zelle">
              <p><strong>Zelle:</strong> obinna.c.okafor@gmail.com</p>
              <p><strong>Cashapp:</strong> $Obi1Cash</p>
            </span>
          </span>
        </div>
        </div>
       
      </div>
    </section>
  `;

  BODY.innerHTML = HEADER + NAV + MAIN + COUNTDOWN;

  // Proof of payment
  const paymentProofForm = document.getElementById("payment-proof-form");
  const proofFeedback = document.getElementById("proof-feedback");

  if (!paymentProofForm || !proofFeedback) {
    console.error("Form element not found");
    return;
  }

  paymentProofForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("donor-name").value;
    const phone = document.getElementById("donor-phone").value;
    const proofInput = document.getElementById("proof-of-payment");

    if (!proofInput) {
      console.error("Proof input element not found");
      return;
    }

    if (proofInput.files && proofInput.files.length > 0) {
      const proofFile = proofInput.files[0];
      console.log("Proof file selected:", proofFile);

      // Show loading message
      proofFeedback.innerHTML = `<p style="text-align: center;">Uploading proof... Please wait.</p>`;

      try {
        const storageRef = ref(storage, `donations/${proofFile.name}`);
        await uploadBytes(storageRef, proofFile);
        const proofURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "donations"), {
          name: name,
          phone: phone,
          proofURL: proofURL,
          timestamp: new Date(),
        });

        paymentProofForm.reset();

        // Show success message
        proofFeedback.innerHTML = `<p style="color: green; text-align: center;">Proof uploaded successfully!</p>`;
        setTimeout(() => {
          proofFeedback.innerHTML = ''; // Clear success message after 3 seconds
        }, 3000);

      } catch (error) {
        console.error("Error uploading proof of payment: ", error);
        // Show error message
        proofFeedback.innerHTML = `<p style="color: red; text-align: center;">An error occurred. Please try again.</p>`;
      }
    } else {
      console.error("No file selected");
      // Show error message
      proofFeedback.innerHTML = `<p style="color: red; text-align: center;">Please upload a proof of payment.</p>`;
    }
  });

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
