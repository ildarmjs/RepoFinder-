import { formatDate } from '@/shared/utils';
import { RepositoryFragment } from '../gql/fragments/repository.graphql';

interface Props {
  repo: RepositoryFragment;
}

export const RepoCard = ({ repo }: Props) => {
  return (
    <div className="flex p-4 prose border rounded-lg">
      <div className=" flex-1">
        <a href={repo.url} className="text-lg font-bold hover:underline">
          {repo.name}
        </a>
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
