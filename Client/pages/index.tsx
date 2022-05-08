import { useMeQuery, usePostsQuery } from '../graphql/generated/graphql';
import { LoadingOverlay, Text } from '@mantine/core';
import Navbar from '../components/Navbar';
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { isServer } from '../util/isServer';

const HomePage = () => {
  // const { user, setActiveUser } = useContext(User);
  // const [{ data, fetching, error }, me] = useMeQuery({
  //   pause: isServer(),
  // });
  const [{ data: postsData }] = usePostsQuery();
  // if (error) {
  // setActiveUser(null);
  // }
  // setActiveUser(data);

  return (
    <>
      <Navbar />
      {/* {fetching && (
        <LoadingOverlay
          loaderProps={{ size: 'xl', color: 'blue', variant: 'oval' }}
          overlayOpacity={0.8}
          overlayColor="#333333"
          visible
        />
      )} */}
      {!postsData ? (
        <LoadingOverlay
          loaderProps={{ size: 'xl', color: 'blue', variant: 'dots' }}
          overlayOpacity={0.9}
          overlayColor="#333333"
          visible
        />
      ) : (
        postsData?.posts?.map((post) => <div key={post?.id}>{post?.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(HomePage);
