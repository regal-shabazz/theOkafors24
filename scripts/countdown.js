export default function updateCountdown() {
  const eventDate = new Date("August 10, 2024 00:00:00").getTime();
  const now = new Date().getTime();
  const timeLeft = eventDate - now;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML = `${days} days ${hours} hrs ${minutes} mins ${seconds} secs`;

  if (timeLeft < 0) {
    clearInterval(countdownInterval);
    document.getElementById("countdown").innerHTML = "The event has started!";
  }
}
