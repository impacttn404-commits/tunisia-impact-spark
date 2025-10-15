import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Accessibility Tests', () => {
  describe('Footer Component', () => {
    it('should have proper ARIA roles', () => {
      const { container } = renderWithRouter(<Footer />);
      const footer = container.querySelector('footer');
      
      expect(footer).toHaveAttribute('role', 'contentinfo');
    });

    it('should have navigation landmarks', () => {
      const { container } = renderWithRouter(<Footer />);
      const navElements = container.querySelectorAll('nav');
      
      expect(navElements.length).toBeGreaterThan(0);
      navElements.forEach((nav) => {
        expect(nav).toHaveAttribute('aria-label');
      });
    });

    it('should have accessible social media links', () => {
      const { getByLabelText } = renderWithRouter(<Footer />);
      
      expect(getByLabelText('Facebook')).toBeInTheDocument();
      expect(getByLabelText('LinkedIn')).toBeInTheDocument();
      expect(getByLabelText('Instagram')).toBeInTheDocument();
    });
  });

  describe('BottomNavigation Component', () => {
    const mockOnTabChange = () => {};

    it('should have proper navigation role', () => {
      const { container } = render(
        <BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />
      );
      const nav = container.querySelector('nav');
      
      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navigation principale');
    });

    it('should have accessible buttons with aria-labels', () => {
      const { container } = render(
        <BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />
      );
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should mark active tab with aria-current', () => {
      const { container } = render(
        <BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />
      );
      const activeButton = container.querySelector('[aria-current="page"]');
      
      expect(activeButton).toBeInTheDocument();
    });

    it('should have focus visible styles', () => {
      const { container } = render(
        <BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />
      );
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach((button) => {
        expect(button.className).toContain('focus:ring');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should allow tab navigation on footer links', () => {
      const { container } = renderWithRouter(<Footer />);
      const links = container.querySelectorAll('a');
      
      links.forEach((link) => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should have focusable navigation buttons', () => {
      const { container } = render(
        <BottomNavigation activeTab="home" onTabChange={() => {}} />
      );
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic HTML elements in Footer', () => {
      const { container } = renderWithRouter(<Footer />);
      
      expect(container.querySelector('footer')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('should use semantic HTML elements in BottomNavigation', () => {
      const { container } = render(
        <BottomNavigation activeTab="home" onTabChange={() => {}} />
      );
      
      expect(container.querySelector('nav')).toBeInTheDocument();
    });
  });

  describe('Color Contrast', () => {
    it('should not use hard-coded colors that might fail contrast', () => {
      const { container } = renderWithRouter(<Footer />);
      const footer = container.querySelector('footer');
      
      // Check that we're using CSS variables/classes, not hard-coded colors
      expect(footer?.className).toContain('bg-card');
      expect(footer?.className).toContain('border-border');
    });
  });
});
