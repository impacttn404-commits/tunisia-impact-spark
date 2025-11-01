import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    const controller = new AbortController();

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching projects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }

    return controller;
  }, [toast]);

  const createProject = async (projectData: ProjectInsert) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un projet",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Projet créé avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le projet",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Succès",
        description: "Projet mis à jour avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le projet",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    let controller: AbortController;

    const loadProjects = async () => {
      const result = await fetchProjects();
      if (result) {
        controller = result;
      }
    };

    loadProjects();

    return () => {
      controller?.abort();
    };
  }, [fetchProjects]);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    refetch: fetchProjects,
  };
};