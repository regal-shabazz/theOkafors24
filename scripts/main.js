/* 
  insert the code below in the nav ul when the gallery images are available
  <li><a href="./pages/gallery.html">Gallery</a></li>
*/

import updateCountdown from "./countdown.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const BODY = document.querySelector("body");

  const HEADER = `
    <header>
      <div class="container">
        <a href="./index.html"><img src="./images/PO-HD_Secondary.png" 
        alt="header logo"></a>
      </div>
    </header>
  `;

  const NAV = `
    <nav>
      <ul>
        <li><a href="./index.html">Home</a></li>
        <li><a href="./pages/ourstory.html">Our Story</a></li>
        <li><a href="./pages/proofofpayment.html">Gifting</a></li>
        <li><a href="./pages/admin.html">Admin</a></li>
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
    <main>
      <section id="rsvp-page">
        <div class="container">
        <h2 id="hero-bg"></h2>

          <div class="rsvp-query">
            <h4>Will you be attending?</h4>

             <div class="primary-rsvp-query">
            <input type="text" id="invite-code-input" placeholder="Invite code">
            <button id="submit-code">YES! I'll be attending!</button>
          </div>

             <span id="msg">
              <p>If you do not have an invite code, kindly RSVP below.</p>
            </span>
            <div id="rsvp-response">
              <button id="accept-button">Joyfully Accept!</button>     
            </div>
          </div>
        </div>
      </section>
      <section id="thank-you-page">
        <div class="container">
          <p>
            <strong>Thank You!</strong>
              Dear Family and Friends,
              <br/>
              <br/>
              We are deeply grateful for your love, support, and presence in our lives. Your contributions, whether through attendance, kind words, or generous gifts, have made our special day even more memorable.
              <br/>
              <br/>
              Your presence means the world to us, and we are blessed to share this joyous occasion with the people we cherish the most.
              <br/>
              <br/>
              Thank you for celebrating with us and for being an integral part of our journey. Your kindness and support have touched our hearts, and we look forward to creating many more beautiful memories together.
              <br/>
              <br/>
              With heartfelt gratitude,

            <strong>The Okafors</strong>
          </p>
        </div>
      </section>
    </main>
  `;

  function handleSplashScreenTransitionToHomepage() {
    setTimeout(() => {
      BODY.innerHTML = HEADER + NAV + MAIN + COUNTDOWN;
      updateCountdown();
      setInterval(updateCountdown, 1000);

      const acceptButton = document.getElementById("accept-button");
      // const declineButton = document.getElementById("decline-button");
      const submitCodeButton = document.getElementById("submit-code");

      acceptButton.addEventListener("click", () => {
        createModal("accept-modal", "accept-form", "Event: Cocktail Hour and Dinner", handleAcceptSubmit);
      });

      // declineButton.addEventListener("click", () => {
      //   createModal("decline-modal", "decline-form", "Regretfully Decline", handleDeclineSubmit);
      // });

      submitCodeButton.addEventListener("click", handleCodeSubmit);
    }, 3000);
  }

  function createModal(modalId, formId, formTitle, submitHandler) {
    const modal = document.createElement("div");
    modal.id = modalId;
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <form id="${formId}">
          <h2>${formTitle}</h2>
          <div class="form-group">
            <label for="name"></label>
            <input type="text" id="name" name="name" placeholder="First Name Last Name" required>
          </div>
          <div class="form-group">
            <label for="side-of-family">Side of Family:</label>
            <select id="side-of-family" name="side-of-family" required>
              <option value="">Click to select</option>
              <option value="Groom">Groom</option>
              <option value="Bride">Bride</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    `;

    BODY.appendChild(modal);

    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => {
      modal.remove();
    });

    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.remove();
      }
    });

    document.getElementById(formId).addEventListener("submit", submitHandler);
  }

  function createQRModal(name, events) {
    const modal = document.createElement("div");
    modal.id = "qr-modal";
    modal.className = "modal";

    let accessMessage;
    
    if (events.includes("pre-main") && events.includes("main")) {
      accessMessage = "This pass grants you entrance to both the Vow Ceremony and the Cocktail Hour & Dinner. (IVs both for events below)";
    } else if (events.includes("main")) {
      accessMessage = "This pass grants you entrance to the Cocktail Hour & Dinner. (IV for this event below)";
    }


    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Thank you, ${name}!</h2>
        <h3>${accessMessage}</h3>
        <p id="msg">Please download or save a screenshot of this pass and come along with it to the venue.</p>
        <div id="qrcode"></div>
        <button id="download-qr">Download QR Code</button>
        <div class="donation-details">
          <h3>Celebrating With Us?</h3>
          <p>Click <a style="font-style: italic; color: #f56e6e" href="./pages/proofofpayment.html" target="_blank">Here</a> to gift us.</p>
          <p class="hide"><strong>Bank Account Details:</strong></p>
          <p class="hide">0107527850 (GTB) - Obinna Okafor</p>
          <p class="hide">2130912288 (UBA) - Precious Ike</p>
          <p class="hide"><strong>Zelle:</strong> obinna.c.okafor@gmail.com</p>
          <p class="hide"><strong>Cashapp:</strong> $Obi1Cash</p>
          <h4>Thank you for your support!</h4>
        </div>
        
        <div id="iv-buttons">
          <button id="view-iv">View Wedding IV</button>
          <button id="download-iv">Download Wedding IV</button>
        </div>
        <div id="iv-container" style="display: none;"></div>
      </div>
    `;
  
    BODY.appendChild(modal);
  
    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => {
      modal.remove();
    });
  
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.remove();
      }
    });
  
    const qrCodeDiv = document.getElementById("qrcode");
    const qrData = `Access Pass - Name: ${name}, Events: ${events}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  
    const qrImage = new Image();
    qrImage.src = qrImageUrl;
    qrImage.onload = () => {
      qrCodeDiv.appendChild(qrImage);
      // Enable download button after QR code is loaded
      document.getElementById("download-qr").addEventListener("click", () => downloadQRCode(qrImageUrl));
    };
    qrImage.onerror = (error) => {
      console.error("Error loading QR code:", error);
      qrCodeDiv.innerHTML = "Error loading QR code. Please try again.";
    };
  
    // Handle "View Wedding IV" button click
    document.getElementById("view-iv").addEventListener("click", () => {
      const ivContainer = document.getElementById("iv-container");
      ivContainer.innerHTML = ""; // Clear previous content
  
      if (events.includes("pre-main")) {
        const ivImage1 = new Image();
        ivImage1.src = "../images/vow_ceremony_iv.jpg";
        ivImage1.alt = "Vow Ceremony IV";
        ivImage1.style.width = "100%";
        ivContainer.appendChild(ivImage1);
      }
      if (events.includes("main")) {
        const ivImage2 = new Image();
        ivImage2.src = "../images/cocktail_hour_and_dinner_iv.jpg";
        ivImage2.alt = "Cocktail Hour and Dinner IV";
        ivImage2.style.width = "100%";
        ivContainer.appendChild(ivImage2);
      }
  
      ivContainer.style.display = "block";
    });
  
    // Handle "Download Wedding IV" button click
    document.getElementById("download-iv").addEventListener("click", () => {
      if (events.includes("pre-main") && events.includes("main")) {
        downloadIV("../images/vow_ceremony_iv.jpg", "Vow_Ceremony_IV.png");
        downloadIV("../images/cocktail_hour_and_dinner_iv.jpg", "Cocktail_Hour_and_Dinner_IV.jpg");
      } else if (events.includes("main")) {
        downloadIV("../images/cocktail_hour_and_dinner_iv.jpg", "Cocktail_Hour_and_Dinner_IV.jpg");
      }
    });
  
    modal.style.display = "block";
  }
  
  function downloadIV(url, filename) {
    // Create an anchor element
    const link = document.createElement("a");
  
    // Check if the URL is a valid data URL or a blob URL
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      link.href = url;
    } else {
      // If it's not, fetch the image and create a blob URL
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          link.href = blobUrl;
  
          // Set the download attribute with the desired file name
          link.download = filename;
  
          // Append the link to the body, trigger the click, and remove the link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          // Revoke the object URL to free up memory
          URL.revokeObjectURL(blobUrl);
        })
        .catch(error => console.error('Error downloading the IV image:', error));
      return;
    }
  
    // Set the download attribute with the desired file name
    link.download = filename;
  
    // Append the link to the body, trigger the click, and remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  

  async function handleAcceptSubmit(event) {
    event.preventDefault();
    const modal = document.getElementById("accept-modal");
    const name = document.getElementById("name").value;
    const sideOfFamily = document.getElementById("side-of-family").value;

    try {
      await addDoc(collection(db, "guests"), {
        name: name,
        sideOfFamily: sideOfFamily,
        status: "accepted",
        events: "main", // Invited to main event only
        timestamp: new Date()
      });
      alert("Form submitted successfully!");
      createQRModal(name, "main");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("An error occurred. Please try again.");
    } finally {
      modal.remove();
    }
  }

  // async function handleDeclineSubmit(event) {
  //   event.preventDefault();
  //   const modal = document.getElementById("decline-modal");
  //   const name = document.getElementById("name").value;
  //   const sideOfFamily = document.getElementById("side-of-family").value;

  //   try {
  //     await addDoc(collection(db, "guests"), {
  //       name: name,
  //       sideOfFamily: sideOfFamily,
  //       status: "declined",
  //       events: "none", // Not attending any event
  //       timestamp: new Date()
  //     });
  //     alert("Form submitted successfully!");
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //     alert("An error occurred. Please try again.");
  //   } finally {
  //     modal.remove();
  //   }
  // }

  function handleCodeSubmit() {
    const inviteCode = document.getElementById("invite-code-input").value;
    if (validateInviteCode(inviteCode)) {
      createModal("accept-modal", "accept-form", "Event: Vow Ceremony, Cocktail Hour and Dinner", handleAcceptSubmitBothEvents);
    } else {
      alert("Invalid invite code. Please try again.");
    }
  }

  function validateInviteCode(code) {
    // Replace this with your actual validation logic
    const validCodes = ["vow24"];
    return validCodes.includes(code);
  }

  async function handleAcceptSubmitBothEvents(event) {
    event.preventDefault();
    const modal = document.getElementById("accept-modal");
    const name = document.getElementById("name").value;
    const sideOfFamily = document.getElementById("side-of-family").value;

    try {
      await addDoc(collection(db, "guests"), {
        name: name,
        sideOfFamily: sideOfFamily,
        status: "accepted",
        events: "pre-main, main", // Invited to both events
        timestamp: new Date()
      });
      alert("Form submitted successfully!");
      createQRModal(name, "pre-main, main");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("An error occurred. Please try again.");
    } finally {
      modal.remove();
    }
  }

  handleSplashScreenTransitionToHomepage();
  updateCountdown();
});
