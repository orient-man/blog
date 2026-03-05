import { notFound } from "next/navigation";

import { PostList } from "@/components/PostList";
import { getPostsByMonth, getArchiveMonths } from "@/lib/content";
import { formatMonthYear, pad2 } from "@/lib/utils";

interface Props {
  params: { year: string; month: string };
}

export function generateStaticParams() {
  const months = getArchiveMonths();
  return months.map((m) => ({
    year: String(m.year),
    month: pad2(m.month),
  }));
}

export function generateMetadata({ params }: Props) {
  const year = parseInt(params.year, 10);
  const month = parseInt(params.month, 10);
  const label = formatMonthYear(year, month);
  return { title: `Archive: ${label} — Just A Programmer` };
}

export default function ArchivePage({ params }: Props) {
  const year = parseInt(params.year, 10);
  const month = parseInt(params.month, 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) notFound();

  const posts = getPostsByMonth(year, month);
  if (posts.length === 0) notFound();

  const label = formatMonthYear(year, month);

  return <PostList posts={posts} title={`Archive: ${label}`} />;
}
