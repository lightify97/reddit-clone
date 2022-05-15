import { LoadingOverlay } from '@mantine/core';
import { withUrqlClient } from 'next-urql';
import Navbar from '../components/Navbar';
import Post from '../components/Post';
import { useMeQuery, usePostsQuery } from '../graphql/generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';
import { isServer } from '../util/isServer';

const HomePage = () => {
  // const { user, setActiveUser } = useContext(User);
  const [{ data: user }, getMe] = useMeQuery({
    // pause: isServer(),
  });
  const [{ data: postsData, fetching }, getPosts] = usePostsQuery({
    variables: {
      byUser: user?.me?.id || null,
    },
  });
  return (
    <>
      <Navbar />
      {postsData ? postsData?.posts?.map((post) => <Post key={post?.id} post={post} />) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(HomePage);
