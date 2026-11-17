// GoatCounter analytics with robust event tracking
// Fire GoatCounter custom events once the counter is ready
function gcReady(callback) {
  if (window.goatcounter?.count) return callback();
  
  const POLL_INTERVAL = 50; // ms
  const TIMEOUT = 5000; // ms
  let elapsed = 0;
  
  const timer = setInterval(() => {
    if (window.goatcounter?.count) {
      clearInterval(timer);
      callback();
    } else {
      elapsed += POLL_INTERVAL;
      if (elapsed >= TIMEOUT) {
        clearInterval(timer);
        // GoatCounter failed to load, but we continue silently
        console.warn('GoatCounter failed to load within timeout period');
      }
    }
  }, POLL_INTERVAL);
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
    // Track project and live-demo link clicks
    document.querySelectorAll('.proj a, .shelf a').forEach(link => {
      link.addEventListener('click', () => {
        const block = link.closest('.proj, li');
        const name = block?.querySelector('h3, .name')?.childNodes[0]?.textContent?.trim() || 'Unknown Project';
        gcEvent('/event/cta-click', `${name}: ${link.textContent?.trim() || 'link'}`, link.href);
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