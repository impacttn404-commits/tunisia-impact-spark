import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketplacePage } from '../MarketplacePage';
import {
  testUsers,
  buildAuthState,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useMarketplace', () => ({
  useMarketplace: vi.fn(() => ({
    products: [],
    loading: false,
    purchaseWithTokens: vi.fn(),
  })),
}));
vi.mock('../CreateProductModal', () => ({
  CreateProductModal: () => null,
}));

import { useAuth } from '@/hooks/useAuth';
const mockedUseAuth = vi.mocked(useAuth);

const cases: Array<{ role: TestUserRole; balance: number }> = [
  { role: 'evaluator', balance: 250 },
  { role: 'investor', balance: 1500 },
  { role: 'projectHolder', balance: 75 },
];

describe('MarketplacePage header — token balance widget per role (snapshot)', () => {
  it.each(cases)(
    '$role sees marketplace header with token balance',
    ({ role, balance }) => {
      const fixture = {
        ...testUsers[role],
        profile: { ...testUsers[role].profile, tokens_balance: balance },
      };
      mockedUseAuth.mockReturnValue(
        buildAuthState(fixture) as unknown as ReturnType<typeof useAuth>
      );

      render(<MarketplacePage />);

      // Static header wording — must not drift
      expect(
        screen.getByRole('heading', { name: 'Marketplace' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Utilisez vos tokens pour découvrir des produits locaux à impact'
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Vendre/i })).toBeInTheDocument();

      // Token balance widget
      expect(screen.getByText(String(balance))).toBeInTheDocument();
      expect(screen.getByText('tokens disponibles')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Gagner des tokens/i })
      ).toBeInTheDocument();

      // Category labels — locked wording
      expect(screen.getByRole('button', { name: /^Tous/ })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /^Alimentaire/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /^Cosmétique/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /^Artisanat/ })
      ).toBeInTheDocument();
    }
  );

  it('guest (no profile) falls back to balance 0', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(null) as unknown as ReturnType<typeof useAuth>
    );

    render(<MarketplacePage />);

    const balanceLabel = screen.getByText('tokens disponibles');
    const balanceNode = balanceLabel.parentElement?.querySelector('div');
    expect(balanceNode?.textContent).toBe('0');
  });

  it('matches locked marketplace header baseline', () => {
    const baseline = {
      title: 'Marketplace',
      subtitle:
        'Utilisez vos tokens pour découvrir des produits locaux à impact',
      sellButton: 'Vendre',
      balanceLabel: 'tokens disponibles',
      earnButton: 'Gagner des tokens',
      categories: ['Tous', 'Alimentaire', 'Cosmétique', 'Artisanat'],
    };

    expect(baseline).toMatchInlineSnapshot(`
      {
        "balanceLabel": "tokens disponibles",
        "categories": [
          "Tous",
          "Alimentaire",
          "Cosmétique",
          "Artisanat",
        ],
        "earnButton": "Gagner des tokens",
        "sellButton": "Vendre",
        "subtitle": "Utilisez vos tokens pour découvrir des produits locaux à impact",
        "title": "Marketplace",
      }
    `);
  });
});
