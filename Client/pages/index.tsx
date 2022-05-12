import { useMeQuery, usePostsQuery } from '../graphql/generated/graphql';
import { LoadingOverlay, Text } from '@mantine/core';
import Navbar from '../components/Navbar';
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { isServer } from '../util/isServer';

const HomePage = () => {
  // const { user, setActiveUser } = useContext(User);

  const [{ data: postsData, fetching }] = usePostsQuery();

  return (
    <>
      <Navbar />
      {fetching && (
        <LoadingOverlay
          loaderProps={{ size: 'xl', color: 'blue', variant: 'oval' }}
          overlayOpacity={0.8}
          overlayColor="#333333"
          visible
        />
      )}
      {!postsData
        ? null
        : postsData?.posts?.map((post) => (
            <div key={post?.id} dangerouslySetInnerHTML={{ __html: post?.content }}></div>
          ))}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(HomePage);
