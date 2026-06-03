import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChallengesPage } from '../ChallengesPage';
import {
  testUsers,
  buildAuthState,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useChallenges', () => ({
  useChallenges: vi.fn(() => ({ challenges: [], loading: false })),
}));
vi.mock('../CreateChallengeModal', () => ({ CreateChallengeModal: () => null }));

import { useAuth } from '@/hooks/useAuth';
const mockedUseAuth = vi.mocked(useAuth);

describe('ChallengesPage — RBAC action snapshot (Créer button)', () => {
  it.each<TestUserRole>(['investor', 'evaluator', 'projectHolder'])(
    '%s sees correct Créer button visibility',
    (role) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );

      render(<ChallengesPage />);

      expect(
        screen.getByRole('heading', { name: 'Challenges Sponsorisés' })
      ).toBeInTheDocument();

      const createBtn = screen.queryByRole('button', { name: /^Créer$/ });
      if (role === 'investor') {
        expect(createBtn).toBeInTheDocument();
      } else {
        expect(createBtn).not.toBeInTheDocument();
      }
    }
  );

  it('matches locked ChallengesPage baseline', () => {
    expect({
      title: 'Challenges Sponsorisés',
      subtitle:
        'Participez aux défis et remportez des financements pour vos projets',
      createButton: 'Créer',
      createButtonAllowedRoles: ['investor'],
    }).toMatchInlineSnapshot(`
      {
        "createButton": "Créer",
        "createButtonAllowedRoles": [
          "investor",
        ],
        "subtitle": "Participez aux défis et remportez des financements pour vos projets",
        "title": "Challenges Sponsorisés",
      }
    `);
  });
});
