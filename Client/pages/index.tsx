import { Box, Button, Container, DEFAULT_THEME, LoadingOverlay } from '@mantine/core';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { Plus } from 'tabler-icons-react';
import Navbar from '../components/Navbar';
import Post from '../components/Post';
import { useMeQuery, usePostsQuery } from '../graphql/generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';
import { isServer } from '../util/isServer';

const HomePage: React.FC<{}> = ({}) => {
  const customLoader = (
    <svg
      width="54"
      height="54"
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      stroke={DEFAULT_THEME.colors.blue[6]}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
  // const { user, setActiveUser } = useContext(User);
  const [{ data: user }, getMe] = useMeQuery({
    pause: isServer(),
  });
  const [{ data: postsData, fetching }, getPosts] = usePostsQuery();
  // console.log(postsData);
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
      {/* {fetching ? <LoadingOverlay visible loader={customLoader} /> : null} */}
      {postsData ? postsData?.posts?.map((post) => <Post key={post?.id} post={post} />) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(HomePage);
