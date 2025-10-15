import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageHeader from '../PageHeader';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PageHeader', () => {
  it('should render title and description', () => {
    const { getByText } = renderWithRouter(
      <PageHeader 
        title="Test Title" 
        description="Test Description" 
      />
    );
    
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  it('should render home link', () => {
    const { getByRole } = renderWithRouter(
      <PageHeader 
        title="Test Title" 
        description="Test Description" 
      />
    );
    
    const homeLink = getByRole('link', { name: /impact tunisia/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should apply gradient styling to logo', () => {
    const { getByText } = renderWithRouter(
      <PageHeader 
        title="Test Title" 
        description="Test Description" 
      />
    );
    
    const logo = getByText('Impact Tunisia');
    expect(logo).toHaveClass('bg-gradient-to-r', 'from-primary', 'to-primary-dark');
  });
});
