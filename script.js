document.addEventListener('DOMContentLoaded', function () {
    // Initialize the active tab
    let activeTab = 'home';

    const nav = document.querySelector('nav');
    const navLinks = nav.querySelectorAll('a'); 

    nav.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').substring(1);
            switchTab(targetId);
            setActiveTab(event.target);
        }
    });

    // Add click event listeners to all photos
    document.querySelectorAll('.photo').forEach(photo => {
        photo.addEventListener('click', function () {
            expandPhoto(photo.src);
            showBookmarkIcon(photo.src);
        });
        // Add hover effect for images
        photo.addEventListener('mouseenter', function () {
            photo.style.transform = 'scale(1.1)';
        });

        photo.addEventListener('mouseleave', function () {
            photo.style.transform = 'scale(1)';
        });
    });

    // Add click event listener to close modal
    document.getElementById('close-modal').addEventListener('click', function () {
        closePhotoModal();
    });

    // Scroll to festival sections
    document.querySelectorAll('.festivals-buttons button').forEach(link => {
        link.addEventListener('click', function () {
            const festivalId = link.getAttribute('data-festival');
            scrollToSection(festivalId);
        });
    });

    // Scroll to season sections
    document.querySelectorAll('.season-buttons button').forEach(link => {
        link.addEventListener('click', function () {
            const seasonId = link.getAttribute('data-season');
            scrollToSection(seasonId);
        });
    });

    // Function to switch tabs
    function switchTab(tabId) {
        // Hide all sections
        document.querySelectorAll('main > div > section').forEach(section => {
            section.style.display = 'none';
        });

        // Show the selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.style.display = 'block';
            activeTab = tabId;
        }
    }

    // Function to set active tab styling
    function setActiveTab(link) {
        // Remove active class from all links
        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });

        // Add active class to the clicked link
        link.classList.add('active');
    }
    switchTab(activeTab);

    var slideIndex = 1;

    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("slides");
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    // Event listeners for arrow buttons
    document.querySelector('.prev').addEventListener('click', function () {
        plusSlides(-1);
    });

    document.querySelector('.next').addEventListener('click', function () {
        plusSlides(1);
    });

    // Initial slide display
    showSlides(slideIndex);

    const uploadForm = document.getElementById('uploadForm');
    const selectedPhotosContainer = document.getElementById('selected-photos');

    // Function to show bookmark icon
    function showBookmarkIcon(photoSrc) {
        const bookmarkIcon = document.getElementById('bookmark-icon');
        if (bookmarkIcon) {
            bookmarkIcon.innerHTML = ''; // Clear previous content

            // Set the current photo source and index as data attributes
            bookmarkIcon.setAttribute('data-photo-src', photoSrc);
            bookmarkIcon.setAttribute('data-photo-index', getIndex(photoSrc));

            // Check if the photo is in the collection
            const isInCollection = checkIfInCollection(photoSrc);

            if (isInCollection) {
                // Display the bookmark icon only when the photo is in the collection
                bookmarkIcon.style.display = 'block';
            } else {
                // If not in the collection, hide the bookmark icon
                bookmarkIcon.style.display = 'none';
            }
        }
    }
    // Function to check if the photo is in the collection
    function checkIfInCollection(photoSrc) {
        const bookmarkedPhotosContainer = document.getElementById('bookmarked-photos');
        const photosInCollection = bookmarkedPhotosContainer.querySelectorAll('.bookmarked-photo');

        for (const photoElement of photosInCollection) {
            if (photoElement.src === photoSrc) {
                return true;
            }
        }

        return false;
    }
    // Function to add the current photo to the collection
    function addToCollection(photoSrc) {
        const bookmarkedPhotosContainer = document.getElementById('bookmarked-photos');

        // Check if the photo is already in the collection
        if (!checkIfInCollection(photoSrc)) {
            // Create a container div for each bookmarked photo
            const photoContainer = document.createElement('div');
            photoContainer.classList.add('bookmarked-photo-container');

            // Create an image element for the bookmarked photo
            const imgElement = document.createElement('img');
            imgElement.src = photoSrc;
            imgElement.alt = 'Bookmarked Photo';
            imgElement.classList.add('bookmarked-photo');

            // Add click event to the image in the collection
            imgElement.addEventListener('click', function () {
                expandPhoto(photoSrc);
            });

            // Append the image element to the container
            photoContainer.appendChild(imgElement);

            // Append the container to the collection container
            bookmarkedPhotosContainer.appendChild(photoContainer);

            // Scroll to the "Collection" section after adding the photo
            const collectionTab = document.querySelector('nav a[href="#likedphotos"]');
            collectionTab.click();

            // Show success message
            showSuccessMessage('Photo added to collection!');

            updateCollectionButton(photoSrc, true);
        }
    }
    function removeFromCollection(photoSrc) {
        const bookmarkedPhotosContainer = document.getElementById('bookmarked-photos');
        const photosInCollection = bookmarkedPhotosContainer.querySelectorAll('.bookmarked-photo');

        // Find the photo in the collection
        for (const photoElement of photosInCollection) {
            if (photoElement.src === photoSrc) {
                // Remove the photo from the DOM
                photoElement.parentElement.remove();
                break;
            }
        }

        // Show success message
        showSuccessMessage('Photo removed from collection!');

        updateCollectionButton(photoSrc, false);
        return;
    }
    // Function to update the "Add to Collection" button text and click event
    function updateCollectionButton(photoSrc) {
        const collectionTab = document.querySelector('nav a[href="#likedphotos"]');
        const isInCollection = checkIfInCollection(photoSrc);

        if (isInCollection) {
            collectionTab.classList.add('in-collection');
        } else {
            collectionTab.classList.remove('in-collection');
        }
        // Change the button text based on whether the photo was added or removed
    const collectionButton = document.getElementById('add-to-collection');
    if (added) {
        collectionButton.innerHTML = 'Remove from Collection';
        collectionButton.removeEventListener('click', addToCollection);
        collectionButton.addEventListener('click', function () {
            removeFromCollection(photoSrc);
        });
    } else {
        collectionButton.innerHTML = 'Add to Collection';
        collectionButton.removeEventListener('click', removeFromCollection);
        collectionButton.addEventListener('click', function () {
            addToCollection(photoSrc);
        });
    }
    }

    function showSuccessMessage(message) {
        const uploadMessage = document.getElementById('upload-message');
        uploadMessage.textContent = message;
        setTimeout(() => {
            uploadMessage.textContent = '';
        }, 2000);
    }
    
    fetchAndDisplayImages();

    function fetchAndDisplayImages() {
        const storedImagePaths = localStorage.getItem('imagePaths');

        if (storedImagePaths) {
            // If paths are found in local storage, parse and display them
            const imagePaths = JSON.parse(storedImagePaths);
            displayImages(imagePaths);
        }
        // Fetch image paths from the server
        fetch('uploading.php') 
            .then(response => response.json())
            .then(imagePaths => {
                // Now you have the image paths, update the UI
                imagePaths.forEach(imagePath => {
                    const img = document.createElement('img');
                    img.src = imagePath.file;
                    img.alt = imagePath.category;
                    img.classList.add('photo');

                    // Append the image to its respective section
                    const sectionId = imagePath.category;
                    const section = document.getElementById(sectionId);

                    if (section) {
                        section.appendChild(img);
                    } else {
                        console.error('Section not found:', sectionId);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }
    function displayImages(imagePaths) {
        const collectionContainer = document.getElementById('bookmarked-photos');

        if (collectionContainer) {
            collectionContainer.innerHTML = '';
        }

        imagePaths.forEach(imagePath => {
            const img = document.createElement('img');
            img.src = imagePath.file;
            img.alt = imagePath.category;
            img.classList.add('bookmarked-photo');

            // Append the image to the collection container
            if (collectionContainer) {
                const photoContainer = document.createElement('div');
                photoContainer.classList.add('bookmarked-photo-container');
                photoContainer.appendChild(img);
                collectionContainer.appendChild(photoContainer);
            } else {
                console.error('Collection container not found');
            }
        });
    }
    function expandPhoto(photoSrc) {
        const modalContainer = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        const photos = document.querySelectorAll('.photo');
        const photoArray = Array.from(photos);

        // Get the current index of the displayed photo
        const currentIndex = photoArray.findIndex(photo => photo.src === photoSrc);

        modalContent.src = photoSrc;

        // Create or update the modal-content-container
        let modalContentContainer = document.getElementById('modal-content-container');
        if (!modalContentContainer) {
            modalContentContainer = document.createElement('div');
            modalContentContainer.id = 'modal-content-container';
            modalContentContainer.classList.add('modal-content-container');
            modalContainer.appendChild(modalContentContainer);
        }

        // Clear existing content
        modalContentContainer.innerHTML = '';

        // Create and append navigation arrows
        const nextArrow = document.createElement('span');
        nextArrow.id = 'next-arrow';
        nextArrow.classList.add('modal-arrow');
        nextArrow.innerHTML = '&rarr;';
        nextArrow.addEventListener('click', function () {
            const nextIndex = (currentIndex + 1) % photoArray.length;
            expandPhoto(photoArray[nextIndex].src);
        });

        const prevArrow = document.createElement('span');
        prevArrow.id = 'prev-arrow';
        prevArrow.classList.add('modal-arrow');
        prevArrow.innerHTML = '&larr;';
        prevArrow.addEventListener('click', function () {
            const prevIndex = (currentIndex - 1 + photoArray.length) % photoArray.length;
            expandPhoto(photoArray[prevIndex].src);
        });

        // Check if the photo is in the collection
        const isInCollection = checkIfInCollection(photoSrc);

        // Create and append the button (Add to Collection or Remove from Collection)
        const collectionButton = document.createElement('button');
        collectionButton.id = 'add-to-collection';
        if (isInCollection) {
            collectionButton.innerHTML = 'Remove from Collection';
            collectionButton.addEventListener('click', function () {
                removeFromCollection(photoSrc);
            });
        } else {
            collectionButton.innerHTML = 'Add to Collection';
            collectionButton.addEventListener('click', function () {
                addToCollection(photoSrc);
            });
        }

        modalContentContainer.appendChild(prevArrow);
        modalContentContainer.appendChild(modalContent);
        modalContentContainer.appendChild(nextArrow);
        modalContentContainer.appendChild(collectionButton);

        modalContainer.style.display = 'block';
    }
     // Function to hide bookmark icon
     function hideBookmarkIcon() {
        const bookmarkIcon = document.getElementById('bookmark-icon');
        if (bookmarkIcon) {
            // Check if the "Collection" tab is active before hiding the icon
            const collectionTab = document.querySelector('nav a[href="#likedphotos"]');
            if (!collectionTab.classList.contains('active')) {
                bookmarkIcon.style.display = 'none';
            }
        }
    }
    // Function to close the photo modal
    function closePhotoModal() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.style.display = 'none';
            hideBookmarkIcon(); // Hide the bookmark icon when closing the modal
    }
    }
    // Function to scroll to a specific section
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const backToTopButton = document.getElementById('back-to-top');

    // Event listener for the scroll-to-top button
    backToTopButton.addEventListener('click', function () {
        scrollToTop();
    });

    // Event listener for scrolling to toggle the display of the button
    window.addEventListener('scroll', function () {
        // Check the scroll position
        if (window.scrollY > 30) {
            // If scrolled down more than 30 pixels, display the button
            backToTopButton.style.display = 'block';
        } else {
            // If not scrolled down enough, hide the button
            backToTopButton.style.display = 'none';
        }
    });


    // Function to scroll to the top of the page
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Dark mode toggle button
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Add click event listener to toggle dark mode
    darkModeToggle.addEventListener('click', function () {
        // Toggle the dark mode class on the body
        document.body.classList.toggle('dark-mode');

        // You can also save the user's preference in localStorage
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check the user's preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
});
