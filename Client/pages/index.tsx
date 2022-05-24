import { Box, Button, Container, LoadingOverlay } from '@mantine/core';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Refresh } from 'tabler-icons-react';
import Navbar from '../components/Navbar';
import Post from '../components/Post';
import { useFeedQuery, useMeQuery } from '../graphql/generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';
import { customLoader } from '../util/customLoader';
import { isServer } from '../util/isServer';

const HomePage: React.FC = () => {
  // const { user, setActiveUser } = useContext(User);
  const [feedVariables, setFeedVariables] = useState({ take: 10, cursor: null });
  const [{ data: user }, getMe] = useMeQuery({
    pause: isServer(),
  });
  const [{ data: postsData, fetching }, getFeed] = useFeedQuery({ variables: feedVariables });
  const loadMorePosts = () => {
    let lastPostTimestamp = postsData?.feed[postsData.feed?.length - 1]?.createdAt;
    console.log(lastPostTimestamp);
    setFeedVariables({
      take: feedVariables.take,
      cursor: lastPostTimestamp,
    });
  };
  return (
    <>
      <Navbar pageProps={undefined} />
      <Container>
        <Box my={'1%'}>
          <Box shadow="xl" style={{ width: 600 }}>
            <Link href={'/create-post'}>
              <Button leftIcon={<Plus />} variant="gradient" radius="md" size="lg" fullWidth>
                Create New Post
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
      {console.log(postsData)}
      {/* {fetching ? <LoadingOverlay visible loader={customLoader} /> : null} */}
      {postsData ? postsData?.feed?.map((post) => <Post key={post?.id} post={post} />) : null}
      {postsData ? (
        <Container>
          <Box my={'1%'}>
            <Box style={{ width: 600 }}>
              <Button
                color="green"
                leftIcon={<Refresh />}
                variant="outline"
                radius="md"
                size="md"
                fullWidth
                onClick={loadMorePosts}
              >
                Load More
              </Button>
            </Box>
          </Box>
        </Container>
      ) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(HomePage);
