import updateCountdown from "./countdown.js";

document.addEventListener("DOMContentLoaded", () => {
  const GALLERY_CONTAINER = document.getElementById("gallery-container");
  const MAIN = document.getElementById("main");

  // Dummy image URLs for testing
  const imageUrls = [
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    "../images/PO_Primary.png",
    // Add more image URLs as needed
  ];

  
  // Function to create image elements with lazy loading and download button
  function createImageElement(url) {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
  
    const image = document.createElement("img");
    image.setAttribute("data-src", url); // Set data-src for lazy loading
    image.classList.add("lazy-load");
    imageContainer.appendChild(image);
  
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download";
    downloadBtn.addEventListener("click", async () => {
      try {
        const blob = await fetch(url).then(res => res.blob());
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "image.jpg"; // Set desired file name here
        a.click();
        
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download failed:', error);
      }
    });
    imageContainer.appendChild(downloadBtn);
  
    return imageContainer;
  }

  // Function to load all images
  function loadImages(urls) {
    urls.forEach(url => {
      const imageElement = createImageElement(url);
      GALLERY_CONTAINER.appendChild(imageElement);
    });
  }

  // Load images on page load
  loadImages(imageUrls);

  // Lazy loading setup
  function lazyLoadImages() {
    const lazyImages = document.querySelectorAll(".lazy-load");

    const lazyLoad = target => {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");
            img.setAttribute("src", src);
            observer.unobserve(img);
          }
        });
      });

      io.observe(target);
    };

    lazyImages.forEach(lazyLoad);
  }

  // Initiate lazy loading
  lazyLoadImages();


  // Initialize countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
