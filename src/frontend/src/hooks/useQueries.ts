import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChallengeData,
  CreatorSettings,
  ExtraSection,
  GiftPackageContent,
  QuizData,
} from "../backend.d";
import { useActor } from "./useActor";

export function useListMyPackages() {
  const { actor, isFetching } = useActor();
  return useQuery<GiftPackageContent[]>({
    queryKey: ["my-packages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPackage(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      const result = await actor.getPackage(id);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetPackageByToken(token: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["package-token", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      const result = await actor.getPackageByToken(token);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useGetPackageExtras(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["package-extras", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      const result = await actor.getPackageExtras(id);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreatePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createPackage(title);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-packages"] }),
  });
}

export function useUpdatePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: string;
      title: string;
      themeId: string;
      message: string;
      photoUrl: string;
      memeId: string;
      songId: string;
      gameType: string;
      voiceNoteUrl: string;
      bgMusicId: string;
      extraSections: ExtraSection[];
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updatePackage(
        args.id,
        args.title,
        args.themeId,
        args.message,
        args.photoUrl,
        args.memeId,
        args.songId,
        args.gameType,
        args.voiceNoteUrl,
        args.bgMusicId,
        args.extraSections,
      );
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["package", vars.id] }),
  });
}

export function useUpdatePackageExtras() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (args: {
      id: string;
      quiz: QuizData;
      challengeData: ChallengeData;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updatePackageExtras(
        args.id,
        args.quiz,
        args.challengeData,
      );
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
  });
}

export function usePublishPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.publishPackage(id);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-packages"] }),
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deletePackage(id);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-packages"] }),
  });
}

export function useSuggestQuizQuestions() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (topic: string) => {
      if (!actor) return [];
      return actor.suggestQuizQuestions(topic);
    },
  });
}

export function useGetCreatorSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<CreatorSettings>({
    queryKey: ["creator-settings"],
    queryFn: async () => {
      if (!actor) return { customSectionLabels: [], stepOrder: [] };
      return actor.getCreatorSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCreatorSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: CreatorSettings) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateCreatorSettings(settings);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["creator-settings"] }),
  });
}
