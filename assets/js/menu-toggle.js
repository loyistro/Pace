document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('menu');

    // Toggle menu visibility
    menuToggle.addEventListener('click', function (event) {
        navMenu.classList.toggle('show');
        event.stopPropagation(); // Prevent triggering the document click event
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!navMenu.contains(event.target) && event.target !== menuToggle) {
            navMenu.classList.remove('show');
        }
    });

    // Close menu when resizing to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
        }
    });
});