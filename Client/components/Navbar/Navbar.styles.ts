import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  navbar: {
    position: 'sticky',
    top: 0,
    width: '100%',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.dark[5],
    fontFamily: 'Inter',
    zIndex: 222,
    padding: '1px 20px',
  },

  logo: {
    color: '#FE452A',
    fontWeight: 900,
    fontSize: '2.4em',
    textShadow: `2px 3px #eee`,

    a: {
      color: '#FE452A',
      textDecoration: 'none',
      '&:visited': {
        color: '#FE452A',
      },
    },
  },

  mainSection: {},

  userMenu: {
    marginTop: 10,
    [theme.fn.smallerThan('xs')]: {
      // display: 'none',
    },
  },
  user: {
    color: theme.white,
    paddingRight: 10,
    borderRadius: 600, // theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colors.gray[9],
    },
  },

  userActive: {
    backgroundColor: theme.colors.gray[9],
  },
}));
