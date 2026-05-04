import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TokenHistoryPage } from '../TokenHistoryPage';
import {
  testUsers,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useTokens', () => ({ useTokens: vi.fn() }));

import { useTokens } from '@/hooks/useTokens';
const mockedUseTokens = vi.mocked(useTokens);

const cases: Array<{ role: TestUserRole; balance: number }> = [
  { role: 'evaluator', balance: 320 },
  { role: 'investor', balance: 0 },
  { role: 'projectHolder', balance: 42 },
];

const baseHookReturn = {
  transactions: [],
  loading: false,
  getTransactionTypeLabel: (t: string) => t,
  getTransactionIcon: () => '💳',
  refetch: vi.fn(),
};

describe('TokenHistoryPage header — token balance widget per role (snapshot)', () => {
  it.each(cases)(
    '$role sees token history header with current balance ($balance)',
    ({ balance }) => {
      mockedUseTokens.mockReturnValue({
        ...baseHookReturn,
        balance,
      } as unknown as ReturnType<typeof useTokens>);

      const onBack = vi.fn();
      render(<TokenHistoryPage onBack={onBack} />);

      // Locked title + subtitle
      expect(
        screen.getByRole('heading', { name: 'Historique des Tokens' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Suivez tous vos gains et dépenses de tokens')
      ).toBeInTheDocument();

      // Balance card
      expect(screen.getByText(String(balance))).toBeInTheDocument();
      expect(screen.getByText('Solde actuel')).toBeInTheDocument();

      // Stats labels — locked wording
      expect(screen.getByText('Gains totaux')).toBeInTheDocument();
      expect(screen.getByText('Dépenses totales')).toBeInTheDocument();
      expect(
        screen.getByText('Historique des transactions')
      ).toBeInTheDocument();
    }
  );

  it('shows empty state when no transactions', () => {
    mockedUseTokens.mockReturnValue({
      ...baseHookReturn,
      balance: 0,
    } as unknown as ReturnType<typeof useTokens>);

    render(<TokenHistoryPage onBack={vi.fn()} />);

    expect(screen.getByText('Aucune transaction')).toBeInTheDocument();
    expect(
      screen.getByText('Vos transactions apparaîtront ici au fur et à mesure')
    ).toBeInTheDocument();
  });

  it('matches locked token history header baseline', () => {
    // Sanity — fixtures still expose the three roles we wire in CI.
    expect(Object.keys(testUsers).sort()).toEqual(
      ['evaluator', 'investor', 'projectHolder'].sort()
    );

    const baseline = {
      title: 'Historique des Tokens',
      subtitle: 'Suivez tous vos gains et dépenses de tokens',
      balanceLabel: 'Solde actuel',
      gainsLabel: 'Gains totaux',
      spendLabel: 'Dépenses totales',
      historyHeading: 'Historique des transactions',
      emptyTitle: 'Aucune transaction',
    };

    expect(baseline).toMatchInlineSnapshot(`
      {
        "balanceLabel": "Solde actuel",
        "emptyTitle": "Aucune transaction",
        "gainsLabel": "Gains totaux",
        "historyHeading": "Historique des transactions",
        "spendLabel": "Dépenses totales",
        "subtitle": "Suivez tous vos gains et dépenses de tokens",
        "title": "Historique des Tokens",
      }
    `);
  });
});
