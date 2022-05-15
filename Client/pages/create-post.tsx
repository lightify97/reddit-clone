import { Box, Title, Text, Button, Center, Input, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { Heading, Message2 } from 'tabler-icons-react';
import Navbar from '../components/Navbar';
import RichTextEditor from '../components/RichTextEditor';
import { useCreatePostMutation, useMeQuery } from '../graphql/generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';

const CreatePost: NextPage<{}> = ({}) => {
  const [postEditorData, onChange] = useState('');
  const [{ error: createPostError, fetching: posting, data: createPostData }, createPost] =
    useCreatePostMutation();

  const [{ data: user }, getMe] = useMeQuery();
  const postForm = useForm({
    initialValues: {
      title: '',
    },
  });

  const submitPost = async (values) => {
    const post = await createPost({
      content: postEditorData,
      title: values.title,
      userId: user?.me?.id as string,
    });
  };
  return (
    <>
      <Navbar user={user} />
      <Title align="center">
        <Text
          variant="gradient"
          style={{
            fontSize: 70,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          New Post
        </Text>
      </Title>
      <Box style={{ width: '50%' }} mx="auto" mt={33}>
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
