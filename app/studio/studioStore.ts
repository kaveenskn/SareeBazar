"use client";

import { createContext, useContext } from "react";
import type { StudioPost } from "./StudioMyPosts";

// ── Feed post shape (used by the public feed in page.tsx) ──
export interface FeedPost {
  id: number;
  user: {
    username: string;
    avatar: string;
  };
  time: string;
  image: string;
  likes: string;
  comments: string;
  caption: string;
  isOwn?: boolean; // marks posts created by the current user
}

export interface StudioStore {
  feedPosts: FeedPost[];
  myPosts: StudioPost[];
  addPost: (post: { mediaPreview: string; caption: string; occasion: string; drapingStyle: string; taggedProduct: StudioPost["taggedProduct"] }) => void;
}

export const StudioContext = createContext<StudioStore | null>(null);

export function useStudio(): StudioStore {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside StudioProvider");
  return ctx;
}
