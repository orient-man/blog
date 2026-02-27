import type { MDXComponents } from 'mdx/types';
import GistEmbed from '@/components/GistEmbed';
import TweetEmbed from '@/components/TweetEmbed';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Embedded content components — available in all MDX files without explicit imports
    GistEmbed,
    TweetEmbed,
  };
}
