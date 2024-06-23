/* 
   <li><a href="../pages/gallery.html">Gallery</a></li>
*/



import updateCountdown from "./countdown.js";

document.addEventListener("DOMContentLoaded", () => {
  const BODY = document.querySelector("body");

  const HEADER = `
   <header>
    <div class="container">
      <a href="../index.html"><img src="../images/PO-HD_Secondary.png" 
      alt="header logo"></a>
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
  <footer>
    <div class="container">
      <div id="info">
        <h4>Colours of the Day</h4>
        <p><i>Formal Attire</i>: Lavender, Burnt Orange, Blue, Black</p>
      </div>
      <div id="countdown-container">
        <h5>Countdown to the Big Day</h5>
        <div id="countdown"></div>
    </div>
    </div>
  </footer>
`;

const MAIN = `
  <section id="our-love-story-page">
    <div class="container">
      
      <p class="story" id="left">Once upon a time, I stumbled upon my fiancée’s Instagram profile. Her smile in a photo caught my eye, and I couldn't help but send her a message to compliment her smile. To my surprise, she replied, sparking a conversation that felt effortless and natural.

      We quickly discovered how much we had in common, from our love for travel to our shared taste in music and food. It felt as if everything we talked about was a sign from above that we were meant for each other.</p>

      <div id="image-container"></div>

      <p class="story" id="right">As we got to know each other better, it became clear that this was more than just a digital connection—it was destiny. Our virtual chats eventually turned into real-life dates, and each moment together affirmed that we were crafted for one another by God's perfect plan.

      Now, as we prepare to say "I do," we're grateful for that fateful Instagram encounter that brought us together. It’s amazing how a simple click led us to a love story written in the stars.</p>
    <div>
  </section>

`

  BODY.innerHTML = HEADER + NAV + MAIN + COUNTDOWN;

  updateCountdown()
  setInterval(updateCountdown, 1000)
});
