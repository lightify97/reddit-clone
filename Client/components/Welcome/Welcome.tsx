import { Title, Text, Anchor } from '@mantine/core';
import useStyles from './Welcome.styles';

export function Welcome() {
  const { classes } = useStyles();

  return (
    <>
      <Title className={classes.title} align="center" mt={50}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span">
          Reddit
        </Text>
      </Title>

    </>
  );
}
