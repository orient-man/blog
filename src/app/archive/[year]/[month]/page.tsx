import { notFound } from "next/navigation";

import { PostList } from "@/components/PostList";
import { getPostsByMonth, getArchiveMonths } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { formatMonthYear, pad2 } from "@/lib/utils";

interface Props {
  params: Promise<{ year: string; month: string }>;
}

export function generateStaticParams() {
  const months = getArchiveMonths();
  return months.map((m) => ({
    year: String(m.year),
    month: pad2(m.month),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { year: yearStr, month: monthStr } = await params;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const label = formatMonthYear(year, month);
  return { title: `Archive: ${label} — ${siteConfig.title}` };
}

export default async function ArchivePage({ params }: Props) {
  const { year: yearStr, month: monthStr } = await params;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) notFound();

  const posts = getPostsByMonth(year, month);
  if (posts.length === 0) notFound();

  const label = formatMonthYear(year, month);

  return <PostList posts={posts} title={`Archive: ${label}`} />;
}
