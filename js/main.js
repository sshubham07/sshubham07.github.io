// JavaScript to add some simple interactivity

// Displaying an alert when clicking on a project link
document.addEventListener("DOMContentLoaded", function() {
    const projectLinks = document.querySelectorAll("section ul li a");
    
    projectLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default link behavior
            alert(`You clicked on ${this.textContent}!`);
        });
    });
});

