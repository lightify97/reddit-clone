import { Badge, Box, Card, Container, Divider, Group, Text } from '@mantine/core';

interface PostProps {
  post: {
    title: string;
    content: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    author: {
      name: string;
    };
  };
}
const Post = ({ post }: PostProps) => {
  return (
    <>
      <Container>
        <Box my={'1%'} mx={0}>
          <Card shadow="xl" style={{ width: 600 }}>
            <Card.Section px={20}>
              <Group position="apart" mt={15} mb={15}>
                <Text style={{ fontSize: 25 }} weight={900}>
                  {post.title}
                </Text>
              </Group>
            </Card.Section>
            <Divider my="xs" variant="solid" />

            <Text
              size="sm"
              style={{ lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></Text>
            <Divider my="xs" variant="solid" />
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Post;
