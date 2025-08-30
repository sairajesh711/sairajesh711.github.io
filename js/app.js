// Interactive Journey Tabs
document.addEventListener('DOMContentLoaded', () => {
  // Set footer year
  const yearElem = document.getElementById('year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
  const tabsContainer = document.querySelector('.journey-tabs');
  if (!tabsContainer) return;
  
  const tabs = document.querySelectorAll('.journey-tab');
  const steps = document.querySelectorAll('.journey-step');

  tabsContainer.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.journey-tab');
    if (!clickedTab) return;

    // Deactivate all tabs and steps
    tabs.forEach(tab => tab.classList.remove('active'));
    steps.forEach(step => step.classList.remove('active'));

    // Activate the clicked tab and corresponding step
    clickedTab.classList.add('active');
    const targetId = clickedTab.dataset.target;
    const targetStep = document.getElementById(targetId);
    if (targetStep) {
      targetStep.classList.add('active');
    }
  });
});