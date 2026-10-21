import data from "@/data/campaign-images.json";
import { campaignScenes, type CampaignScene, type Placement } from "@/data/campaign";

export type CampaignImage = {
  file: string; // public path
  status: "review" | "approved" | "rejected";
  source: "ai-generated" | "photography";
  model?: string;
  createdAt?: string;
  width?: number;
  height?: number;
};

const images = (data as { images: Record<string, CampaignImage> }).images ?? {};

/** Only human-approved images are ever returned. */
export function approvedImage(sceneId: string): (CampaignImage & { scene: CampaignScene }) | null {
  const img = images[sceneId];
  const scene = campaignScenes.find((s) => s.id === sceneId);
  if (!img || !scene || img.status !== "approved" || !img.file?.startsWith("/campaign/people/")) return null;
  return { ...img, scene };
}

export function scenesFor(placement: Placement) {
  return campaignScenes.filter((s) => s.placement.includes(placement)).map((s) => ({ scene: s, image: approvedImage(s.id) }));
}

export function sceneForProduct(slug: string, placement: Placement) {
  const s = campaignScenes.find((x) => x.product === slug && x.placement.includes(placement));
  return s ? { scene: s, image: approvedImage(s.id) } : null;
}
