import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  title: {
    fontSize: 70,
    fontWeight: 900,
    letterSpacing: -2,
    lineHeight: 1,
    marginBottom: 20,

    [theme.fn.smallerThan('md')]: {
      fontSize: 50,
    },
  },
}));
