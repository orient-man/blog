import type { Metadata } from 'next';
import SearchInput from '@/components/SearchInput';

export const metadata: Metadata = {
  title: 'Search',
};

export default function SearchPage() {
  return (
    <div className="max-w-prose mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search</h1>
      <SearchInput />
    </div>
  );
}
