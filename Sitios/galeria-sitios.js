/* CAMPING TONGOY - ACCOMMODATION GALLERY */

(() => {
  const gallery = document.querySelector(".detail-gallery");
  const mainImage = gallery?.querySelector(".detail-main-image");
  const lightbox = document.getElementById("site-lightbox");

  if (!gallery || !mainImage || !lightbox) return;

  const viewerImage = document.getElementById("site-lightbox-image");
  const caption = document.getElementById("site-lightbox-caption");

  const thumbnails = [...gallery.querySelectorAll(".detail-thumbnails img")];

  // Include the main image and all thumbnail images.
  // Remove duplicate image paths.
  const photos = [
    { src: mainImage.getAttribute("src"), alt: mainImage.alt },
    ...thumbnails.map((img) => ({
      src: img.getAttribute("src"),
      alt: img.alt,
    })),
  ].filter(
    (photo, index, array) =>
      array.findIndex((item) => item.src === photo.src) === index,
  );

  let currentIndex = 0;
  let touchStartX = 0;

  function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;

    viewerImage.src = photos[currentIndex].src;
    viewerImage.alt = photos[currentIndex].alt;
    caption.textContent = photos[currentIndex].alt;
  }

  function openGallery() {
    const displayedSrc = mainImage.getAttribute("src");

    const index = photos.findIndex(
      (photo) => new URL(photo.src, document.baseURI).href === mainImage.src,
    );

    showPhoto(index >= 0 ? index : 0);
    lightbox.showModal();
  }

  // Make the main image keyboard accessible.
  mainImage.tabIndex = 0;
  mainImage.setAttribute("role", "button");
  mainImage.setAttribute("aria-label", "Ampliar fotografía");

  mainImage.addEventListener("click", openGallery);

  mainImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery();
    }
  });

  // Gallery controls
  lightbox
    .querySelector(".site-lightbox-close")
    .addEventListener("click", () => lightbox.close());

  lightbox
    .querySelector(".site-lightbox-prev")
    .addEventListener("click", () => showPhoto(currentIndex - 1));

  lightbox
    .querySelector(".site-lightbox-next")
    .addEventListener("click", () => showPhoto(currentIndex + 1));

  // Desktop keyboard navigation
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      showPhoto(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showPhoto(currentIndex - 1);
    }
  });

  // Close when tapping outside the photo.
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  // Mobile swipe navigation
  lightbox.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true },
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      const difference = event.changedTouches[0].screenX - touchStartX;

      if (Math.abs(difference) > 50) {
        showPhoto(currentIndex + (difference < 0 ? 1 : -1));
      }
    },
    { passive: true },
  );
})();
