// GoatCounter analytics with robust event tracking
// Fire GoatCounter custom events once the counter is ready
function gcReady(callback) {
  if (window.goatcounter?.count) return callback();
  const timer = setInterval(() => {
    if (window.goatcounter?.count) {
      clearInterval(timer);
      callback();
    }
  }, 50);
}

function gcEvent(path, title, referrer) {
  try {
    window.goatcounter.count({ 
      path, 
      title, 
      referrer, 
      event: true 
    });
  } catch (error) {
    // Silently handle any GoatCounter errors
  }
}

document.addEventListener('DOMContentLoaded', () => {
  gcReady(() => {
    // Track journey tab interactions
    document.querySelectorAll('.journey-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabText = tab.textContent?.trim() || tab.dataset.target || 'Unknown Tab';
        gcEvent('/event/journey-tab', `Journey Tab: ${tabText}`);
      });
    });

    // Track project CTA clicks (GitHub repo buttons)
    document.querySelectorAll('a.btn').forEach(link => {
      link.addEventListener('click', () => {
        const card = link.closest('.card');
        const projectTitle = card?.querySelector('h3')?.textContent?.trim() || 'Unknown Project';
        const linkText = link.textContent?.trim() || 'CTA Click';
        gcEvent('/event/cta-click', `${projectTitle}: ${linkText}`, link.href);
      });
    });

    // Track in-page navigation clicks
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        const section = link.getAttribute('href') || 'unknown-section';
        gcEvent('/event/nav-to-section', `Navigation: ${section}`);
      });
    });

    // Track email contact clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', () => {
        gcEvent('/event/email-click', 'Email Contact Click');
      });
    });

    // Track CV/Resume downloads
    document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
      link.addEventListener('click', () => {
        const fileName = link.getAttribute('href')?.split('/').pop() || 'Unknown PDF';
        gcEvent('/event/resume-view', `CV/Resume View: ${fileName}`, link.href);
      });
    });

    // Track external social media links
    document.querySelectorAll('a[href*="github.com"], a[href*="linkedin.com"], a[href*="instagram.com"], a[href*="x.com"]').forEach(link => {
      link.addEventListener('click', () => {
        const platform = link.href.includes('github.com') ? 'GitHub' :
                         link.href.includes('linkedin.com') ? 'LinkedIn' :
                         link.href.includes('instagram.com') ? 'Instagram' :
                         link.href.includes('x.com') ? 'X/Twitter' : 'Social';
        gcEvent('/event/social-link', `${platform} Click`, link.href);
      });
    });

    // Scroll depth tracking with throttling
    let maxScrollDepth = 0;
    let scrollTimeout;
    
    const trackScrollDepth = () => {
      const documentElement = document.documentElement;
      const scrollTop = documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = documentElement.scrollHeight - documentElement.clientHeight;
      
      if (scrollHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      
      // Track milestones at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && maxScrollDepth < milestone) {
          maxScrollDepth = milestone;
          gcEvent('/event/scroll-depth', `Scrolled ${milestone}%`);
        }
      });
    };

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 100);
    }, { passive: true });

    // Initial scroll check
    trackScrollDepth();
  });
});