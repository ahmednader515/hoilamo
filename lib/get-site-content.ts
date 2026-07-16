import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SITE_CONTENT,
  allContentKeys,
  type SiteContentMap,
} from "@/lib/site-content";

export type { SiteContentMap };
export { t, getLogoUrl, getHeroVideos } from "@/lib/site-content";

export async function getSiteContent(): Promise<SiteContentMap> {
  const content: SiteContentMap = { ...DEFAULT_SITE_CONTENT };

  try {
    const rows = await prisma.siteContent.findMany();
    for (const row of rows) {
      content[row.key] = row.value;
    }
  } catch {
    // DB unavailable or table not migrated yet — use defaults
  }

  return content;
}

export async function ensureSiteContentDefaults() {
  const keys = allContentKeys();
  await Promise.all(
    keys.map((key) =>
      prisma.siteContent.upsert({
        where: { key },
        update: {},
        create: {
          key,
          value: DEFAULT_SITE_CONTENT[key] ?? "",
        },
      })
    )
  );
}
