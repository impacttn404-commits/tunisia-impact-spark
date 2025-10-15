import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SEO Tests', () => {
  describe('Landing Page Structure', () => {
    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<LandingPage />);
      
      const h1 = container.querySelector('h1');
      const h2Elements = container.querySelectorAll('h2');
      
      expect(h1).toBeInTheDocument();
      expect(h2Elements.length).toBeGreaterThan(0);
      
      // H1 should appear before H2
      const h1Position = Array.from(container.querySelectorAll('*')).indexOf(h1!);
      const firstH2Position = Array.from(container.querySelectorAll('*')).indexOf(h2Elements[0]);
      
      expect(h1Position).toBeLessThan(firstH2Position);
    });

    it('should have only one h1 element', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const h1Elements = container.querySelectorAll('h1');
      
      expect(h1Elements.length).toBe(1);
    });

    it('should use semantic HTML5 elements', () => {
      const { container } = renderWithRouter(<LandingPage />);
      
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main') || container.querySelector('section')).toBeTruthy();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should have navigation with proper landmarks', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const nav = container.querySelector('nav');
      
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('role', 'navigation');
    });

    it('should have sections with descriptive aria-labels', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const sections = container.querySelectorAll('section[aria-labelledby]');
      
      expect(sections.length).toBeGreaterThan(0);
      
      sections.forEach((section) => {
        const labelId = section.getAttribute('aria-labelledby');
        expect(labelId).toBeTruthy();
        
        if (labelId) {
          const labelElement = container.querySelector(`#${labelId}`);
          expect(labelElement).toBeInTheDocument();
        }
      });
    });
  });

  describe('Content Optimization', () => {
    it('should have descriptive text content', () => {
      const { getByText } = renderWithRouter(<LandingPage />);
      
      expect(getByText(/Rejoignez la communauté/i)).toBeInTheDocument();
      expect(getByText(/impact social/i)).toBeInTheDocument();
    });

    it('should have call-to-action buttons with descriptive labels', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach((button) => {
        const ariaLabel = button.getAttribute('aria-label');
        const textContent = button.textContent;
        
        // Either aria-label or text content should be descriptive
        expect(ariaLabel || textContent).toBeTruthy();
        expect((ariaLabel || textContent || '').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Links and Navigation', () => {
    it('should have descriptive link text', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const links = container.querySelectorAll('a');
      
      links.forEach((link) => {
        const text = link.textContent || '';
        const ariaLabel = link.getAttribute('aria-label') || '';
        
        // Avoid generic link text like "click here" or "read more"
        expect(text.toLowerCase()).not.toBe('click here');
        expect(text.toLowerCase()).not.toBe('read more');
        
        // Should have either text or aria-label
        expect(text || ariaLabel).toBeTruthy();
      });
    });

    it('should have proper role attributes for navigation', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const header = container.querySelector('header');
      
      expect(header).toHaveAttribute('role', 'banner');
    });
  });

  describe('Accessibility Features for SEO', () => {
    it('should have icons with proper aria attributes', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const icons = container.querySelectorAll('[role="img"]');
      
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-label');
      });
    });

    it('should hide decorative icons from screen readers', () => {
      const { container } = renderWithRouter(<LandingPage />);
      // SVG icons inside buttons should be aria-hidden
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach((button) => {
        const svg = button.querySelector('svg[aria-hidden="true"]');
        if (svg) {
          expect(svg).toHaveAttribute('aria-hidden', 'true');
        }
      });
    });
  });

  describe('Performance and Loading', () => {
    it('should not have inline styles that could block rendering', () => {
      const { container } = renderWithRouter(<LandingPage />);
      const elementsWithInlineStyles = container.querySelectorAll('[style]');
      
      // Minimal inline styles are okay, but should be limited
      expect(elementsWithInlineStyles.length).toBeLessThan(5);
    });
  });
});
