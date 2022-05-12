import { Box, Title, Text } from '@mantine/core';
import { NextPage } from 'next';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RichTextEditor from '../components/RichTextEditor';

const CreatePost: NextPage<{}> = ({}) => {
  const initialValue =
    '<p>Your initial <b>html value</b> or an empty string to init editor without value </p>';
  const [value, onChange] = useState(initialValue);

  return (
    <>
      <Navbar />
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
        <RichTextEditor spellCheck="false" value={value} onChange={onChange} />
      </Box>
    </>
  );
};

export default CreatePost;
