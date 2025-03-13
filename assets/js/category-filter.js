document.addEventListener('DOMContentLoaded', function() {
  const categoryTags = document.querySelectorAll('.category-tag');
  const listEntries = document.querySelectorAll('.list-entry__title');
  const yearGroups = document.querySelectorAll('.list-entry');
  const emptyMessage = document.querySelector('.category-empty-message');
  
  // Set initial state - all entries visible
  listEntries.forEach(entry => {
    entry.classList.add('visible');
    resetElementStyles(entry);
    entry.style.display = 'flex'; // Ensure flex display for initial state
  });
  
  // Function to reset element styles
  function resetElementStyles(element) {
    element.style.position = '';
    element.style.visibility = '';
    element.style.height = '';
    element.style.margin = '';
    element.style.padding = '';
    element.style.overflow = '';
    element.style.display = '';
    element.style.opacity = '';
    element.style.pointerEvents = ''; // Reset pointer to interact
  }
  
  // Function to hide element completely
  function hideElementCompletely(element) {
    element.style.position = 'absolute';
    element.style.visibility = 'hidden';
    element.style.height = '0';
    element.style.margin = '0';
    element.style.padding = '0';
    element.style.overflow = 'hidden';
    element.style.opacity = '0';
    element.style.pointerEvents = 'none'; // Prevent interaction with hidden elements
  }
  
  // Checking last selected
  let lastSelectedCategory = 'all';
  
  // Add click event to category tags
  categoryTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const selectedCategory = this.getAttribute('data-category');
      
      // Do nothing if click same tags
      if (lastSelectedCategory === selectedCategory) {
        return;
      }
      
      // Update last selected
      lastSelectedCategory = selectedCategory;
      
      // Remove active class from all tags
      categoryTags.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tag
      this.classList.add('active');
      
      let visibleCount = 0;
      
      // Reset seleced
      if (selectedCategory === 'all') {
        // Reset all elements if select All tags
        yearGroups.forEach(yearGroup => {
          resetElementStyles(yearGroup);
          const yearHeading = yearGroup.querySelector('.list-entry__year');
          resetElementStyles(yearHeading);
          
          const entriesInYear = yearGroup.querySelectorAll('.list-entry__title');
          entriesInYear.forEach(entry => {
            resetElementStyles(entry);
            entry.style.display = 'flex';
            entry.classList.add('visible');
            entry.classList.remove('category-transition');
          });
          
          visibleCount += entriesInYear.length;
        });
      } else {
        // First pass: mark which entries should be visible
        const visibleEntries = new Map();
        yearGroups.forEach(yearGroup => {
          const entriesInYear = yearGroup.querySelectorAll('.list-entry__title');
          let yearHasVisibleEntries = false;
          
          entriesInYear.forEach(entry => {
            const entryCategories = entry.getAttribute('data-categories');
            const shouldBeVisible = selectedCategory === 'all' || entryCategories.includes(selectedCategory);
            visibleEntries.set(entry, shouldBeVisible);
            
            if (shouldBeVisible) {
              yearHasVisibleEntries = true;
              visibleCount++;
            }
          });
          
          visibleEntries.set(yearGroup, yearHasVisibleEntries);
        });
        
        // Second pass: apply animations and visibility
        visibleEntries.forEach((shouldBeVisible, element) => {
          if (element.classList.contains('list-entry')) {
            // Handle year groups
            const yearHeading = element.querySelector('.list-entry__year');
            
            if (shouldBeVisible) {
              // Show year group with animation
              setTimeout(() => {
                resetElementStyles(element);
                resetElementStyles(yearHeading);
                // Force layout recalculation
                element.offsetHeight;
              }, 200);
            } else {
              // Hide year group completely
              setTimeout(() => {
                hideElementCompletely(element);
                hideElementCompletely(yearHeading);
              }, 300);
            }
          } else {
            // Handle individual entries
            element.classList.add('category-transition');
            
            if (shouldBeVisible) {
              // Show entry with animation
              setTimeout(() => {
                resetElementStyles(element);
                element.style.display = 'flex';
                // Force layout recalculation
                element.offsetHeight;
                setTimeout(() => {
                  element.classList.add('visible');
                  element.classList.remove('category-transition');
                }, 50);
              }, 200);
            } else {
              // Hide entry with animation
              element.classList.remove('visible');
              setTimeout(() => {
                hideElementCompletely(element);
                element.classList.remove('category-transition');
              }, 300);
            }
          }
        });
      }
      
      // Show/hide empty message
      if (visibleCount === 0) {
        setTimeout(() => {
          emptyMessage.classList.add('visible');
        }, 300);
      } else {
        emptyMessage.classList.remove('visible');
      }
      
      // Force layout recalculation to ensure proper reflow
      document.getElementById('list-item').offsetHeight;
    });
  });
});