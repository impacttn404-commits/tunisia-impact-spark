import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsPage } from '../ProjectsPage';
import {
  testUsers,
  buildAuthState,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useProjects', () => ({
  useProjects: vi.fn(() => ({ projects: [], loading: false })),
}));
vi.mock('../CreateProjectModal', () => ({ CreateProjectModal: () => null }));
vi.mock('../ProjectDetailModal', () => ({ ProjectDetailModal: () => null }));

import { useAuth } from '@/hooks/useAuth';
const mockedUseAuth = vi.mocked(useAuth);

describe('ProjectsPage — RBAC action snapshot (Créer button)', () => {
  it.each<TestUserRole>(['projectHolder', 'evaluator', 'investor'])(
    '%s sees correct header + Créer visibility',
    (role) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );

      render(<ProjectsPage />);

      expect(
        screen.getByRole('heading', { name: 'Projets à Impact' })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Rechercher un projet...')
      ).toBeInTheDocument();

      const createBtn = screen.queryByRole('button', { name: /^Créer$/ });
      if (role === 'projectHolder') {
        expect(createBtn).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /Créer le premier projet/i })
        ).toBeInTheDocument();
      } else {
        expect(createBtn).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: /Créer le premier projet/i })
        ).not.toBeInTheDocument();
      }
    }
  );

  it('matches locked ProjectsPage baseline', () => {
    expect({
      title: 'Projets à Impact',
      subtitle:
        'Découvrez et évaluez les projets qui transforment la Tunisie',
      filters: ['Tous', 'En évaluation', 'Sous évaluation'],
      createButton: 'Créer',
      createButtonAllowedRoles: ['projectHolder'],
    }).toMatchInlineSnapshot(`
      {
        "createButton": "Créer",
        "createButtonAllowedRoles": [
          "projectHolder",
        ],
        "filters": [
          "Tous",
          "En évaluation",
          "Sous évaluation",
        ],
        "subtitle": "Découvrez et évaluez les projets qui transforment la Tunisie",
        "title": "Projets à Impact",
      }
    `);
  });
});
