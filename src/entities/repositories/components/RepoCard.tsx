import { formatDate } from '@/shared/utils';
import { RepositoryFragment } from '../gql/fragments/repository.graphql';
import Link from 'next/link';

interface RepoCardProps {
  repo: RepositoryFragment;
}

export const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <div className="flex p-4 prose border rounded-lg">
      <div className=" flex-1">
        <Link
          href={repo.url}
          target="_blank"
          className="text-lg font-bold hover:underline"
        >
          {repo.name}
        </Link>
        {repo.description && (
          <p className="text-sm text-slate-500 mt-2">{repo.description}</p>
        )}
      </div>
      <code className="text-xs text-slate-500">
        {formatDate(repo.updatedAt)}
      </code>
    </div>
  );
};
