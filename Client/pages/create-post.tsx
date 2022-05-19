import { Box, Button, Center, Text, TextInput, ThemeIcon, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CircleCheck, CircleX, Heading } from 'tabler-icons-react';
import Navbar from '../components/Navbar';
import RichTextEditor from '../components/RichTextEditor';
import { useCreatePostMutation, useMeQuery } from '../graphql/generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';
import { useIsAuth } from '../util/useIsAuth';

const CreatePost = () => {
  const router = useRouter();
  // const { user, setUser } = useContext(State);
  const [postEditorData, onChange] = useState('');
  const [{ error: createPostError, fetching: posting, data: createPostData }, createPost] =
    useCreatePostMutation();

  const postForm = useForm({
    initialValues: {
      title: '',
    },
  });

  useIsAuth('create-post');
  const submitPost = async (values) => {
    // getMe();

    const post = await createPost({
      content: postEditorData,
      title: values.title,
      userId: user?.me?.id as string,
    });

    if (post.data?.createPost.id) {
      showNotification({
        id: 'postSuccess',
        autoClose: true,
        title: 'Posted',
        message: 'Your Post is live.',
        color: 'green',
        radius: 'md',
        icon: <CircleCheck />,
        className: 'success-notification',
        style: { backgroundColor: 'dark' },
        sx: { backgroundColor: 'dark' },
      });
      router.replace('/');
    } else {
      showNotification({
        id: 'postFailed',
        autoClose: false,
        title: 'Error',
        message: "Either you're logged out or post is missing some attribute",
        color: 'red',
        radius: 'md',
        icon: <CircleX />,
        className: 'failure-notification',
        style: { backgroundColor: 'dark' },
        sx: { backgroundColor: 'dark' },
      });
    }
  };
  return (
    <>
      <Navbar />
      <Title align="center">
        <Text variant="gradient" className="title-heading">
          New Post
        </Text>
      </Title>
      <Box style={{ width: '50%' }} mx="auto" my={33}>
        <form onSubmit={postForm.onSubmit(submitPost)} style={{ fontFamily: 'Inter' }}>
          <TextInput
            size="md"
            icon={
              <ThemeIcon variant="light" color="primary" size={24}>
                <Heading />
              </ThemeIcon>
            }
            name="title"
            placeholder="Title of your post"
            mb={10}
            {...postForm.getInputProps('title')}
          />

          <RichTextEditor
            style={{ minHeight: 250 }}
            spellCheck="false"
            value={postEditorData}
            onChange={onChange}
          />
          <Center>
            <Button type="submit" mt={10}>
              Post
            </Button>
          </Center>
        </form>
      </Box>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
