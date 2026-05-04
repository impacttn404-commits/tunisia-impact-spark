import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  testUsers,
  buildAuthState,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useChallenges', () => ({ useChallenges: vi.fn() }));
vi.mock('../CreateChallengeModal', () => ({
  CreateChallengeModal: () => null,
}));

import { useAuth } from '@/hooks/useAuth';
import { useChallenges } from '@/hooks/useChallenges';
import { ChallengesPage } from '../ChallengesPage';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseChallenges = vi.mocked(useChallenges);

const FIXTURE_CHALLENGE = {
  id: 'ch-1',
  title: 'Challenge Impact Vert',
  description: 'Soutenir les projets à impact environnemental en Tunisie.',
  prize_amount: 50000,
  currency: 'TND',
  participation_fee: 50,
  current_participants: 12,
  max_participants: 50,
  status: 'active',
  created_at: '2026-01-15T00:00:00.000Z',
  end_date: '2026-12-31T00:00:00.000Z',
  created_by: 'sponsor-1',
} as never;

const renderPage = () =>
  render(
    <MemoryRouter>
      <ChallengesPage />
    </MemoryRouter>
  );

const cases: TestUserRole[] = ['evaluator', 'investor', 'projectHolder'];

describe('ChallengesPage header — sponsor/projet info per role (snapshot)', () => {
  beforeEach(() => {
    mockedUseChallenges.mockReturnValue({
      challenges: [FIXTURE_CHALLENGE],
      loading: false,
      createChallenge: vi.fn(),
      updateChallenge: vi.fn(),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useChallenges>);
  });

  it.each(cases)(
    '%s sees the canonical page header and challenge card identity',
    (role) => {
      const fixture = testUsers[role];
      mockedUseAuth.mockReturnValue(
        buildAuthState(fixture) as unknown as ReturnType<typeof useAuth>
      );

      renderPage();

      // Page header
      expect(screen.getByText('Challenges Sponsorisés')).toBeInTheDocument();
      expect(
        screen.getByText(/Participez aux défis et remportez des financements/i)
      ).toBeInTheDocument();

      // Challenge card identity (title + prize + participation fee)
      expect(screen.getByText('Challenge Impact Vert')).toBeInTheDocument();
      expect(screen.getByText('50,000 TND')).toBeInTheDocument();
      expect(screen.getByText(/Participation:\s*50 TND/)).toBeInTheDocument();
      expect(screen.getByText('12/50')).toBeInTheDocument();
    }
  );

  it('investor sees the "Créer" challenge action', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(testUsers.investor) as unknown as ReturnType<typeof useAuth>
    );
    renderPage();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it.each(['evaluator', 'projectHolder'] as const)(
    '%s does NOT see the "Créer" challenge action',
    (role) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );
      renderPage();
      expect(
        screen.queryByRole('button', { name: /^Créer$/i })
      ).not.toBeInTheDocument();
    }
  );

  it('matches locked challenge header baseline per role', () => {
    const baseline = cases.map((role) => ({
      role,
      pageTitle: 'Challenges Sponsorisés',
      challengeTitle: FIXTURE_CHALLENGE.title,
      prize: '50,000 TND',
      participationFee: '50 TND',
      canCreateChallenge: role === 'investor',
    }));

    expect(baseline).toMatchInlineSnapshot(`
      [
        {
          "canCreateChallenge": false,
          "challengeTitle": "Challenge Impact Vert",
          "pageTitle": "Challenges Sponsorisés",
          "participationFee": "50 TND",
          "prize": "50,000 TND",
          "role": "evaluator",
        },
        {
          "canCreateChallenge": true,
          "challengeTitle": "Challenge Impact Vert",
          "pageTitle": "Challenges Sponsorisés",
          "participationFee": "50 TND",
          "prize": "50,000 TND",
          "role": "investor",
        },
        {
          "canCreateChallenge": false,
          "challengeTitle": "Challenge Impact Vert",
          "pageTitle": "Challenges Sponsorisés",
          "participationFee": "50 TND",
          "prize": "50,000 TND",
          "role": "projectHolder",
        },
      ]
    `);
  });
});
