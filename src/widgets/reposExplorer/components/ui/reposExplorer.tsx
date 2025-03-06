'use client';
import { RepoCard } from '@/entities/repositories';
import {
  RepositoriesByOwnerQuery,
  useRepositoriesByOwnerQuery,
} from '@/entities/repositories/gql/queries/repositoriesByOwner.graphql';
import { InfiniteScroll } from '@/shared/components/ui/infinite-scroll';
import { Input } from '@/shared/components/ui/input';
import { Spinner } from '@/shared/components/ui/spinner';
import { NetworkStatus } from '@apollo/client';
import { useState } from 'react';
import { debounce } from 'lodash';

export const ReposExplorer = () => {
  const [login, setLogin] = useState('');
  const [searchLogin, setSearchLogin] = useState('');

  const debouncedSearch = debounce((newLogin: string) => {
    setSearchLogin(newLogin);
  }, 500);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLogin = e.target.value;
    setLogin(newLogin);
    debouncedSearch(newLogin);
  };

  const { data, loading, fetchMore, networkStatus, error } =
    useRepositoriesByOwnerQuery({
      variables: {
        login: searchLogin,
        first: 10,
      },
      notifyOnNetworkStatusChange: true,
      skip: !searchLogin,
    });

  const repos = data?.repositoryOwner?.repositories.nodes;
  const pageInfo = data?.repositoryOwner?.repositories.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage;
  const endCursor = pageInfo?.endCursor;

  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  const updateQuery = (
    previousQueryResult: RepositoriesByOwnerQuery,
    { fetchMoreResult }: { fetchMoreResult: RepositoriesByOwnerQuery | null }
  ) => {
    if (!fetchMoreResult) return previousQueryResult;

    const prevNodes =
      previousQueryResult.repositoryOwner?.repositories.nodes || [];
    const newNodes = fetchMoreResult.repositoryOwner?.repositories.nodes || [];

    return {
      ...previousQueryResult,
      repositoryOwner: {
        ...fetchMoreResult.repositoryOwner,
        repositories: {
          ...fetchMoreResult.repositoryOwner?.repositories,
          nodes: [...prevNodes, ...newNodes],
          pageInfo: fetchMoreResult.repositoryOwner?.repositories.pageInfo ?? {
            hasNextPage: false,
            endCursor: null,
          },
        },
      },
    };
  };

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        after: endCursor,
      },
      updateQuery,
    });
  };

  const renderRepos = () => {
    return (
      <div className="flex flex-col gap-3">
        {repos?.map(repo =>
          repo ? <RepoCard key={repo.id} repo={repo} /> : null
        )}
      </div>
    );
  };

  if (error) {
    return <p>Ошибка при загрузке репозиториев: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-prose">
      <Input
        name="login"
        label="Логин GitHub"
        placeholder="Введите логин для поиска репозиториев"
        value={login}
        onChange={handleLoginChange}
      />

      {!!repos?.length && (
        <InfiniteScroll
          hasNextPage={hasNextPage}
          isFetchingMore={isFetchingMore}
          fetchMore={handleFetchMore}
          endCursor={endCursor}
        >
          {renderRepos()}
        </InfiniteScroll>
      )}

      {!loading && !repos?.length && !!searchLogin && (
        <p>Репозитории не найдены</p>
      )}
      {loading && <Spinner className="self-center" />}
    </div>
  );
};
