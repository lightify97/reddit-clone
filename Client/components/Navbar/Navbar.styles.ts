import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
    header: {
        paddingTop: theme.spacing.sm,
        background: '#00acee',
        borderBottom: `1px solid ${theme.colors[theme.primaryColor][5]}`,
    },

    mainSection: {
        paddingBottom: theme.spacing.sm,
    },

    userMenu: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    user: {
        color: theme.white,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: 600,// theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            // backgroundColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 7 : 5],
        },
    },

    burger: {
        [theme.fn.largerThan('xs')]: {
            display: 'none',
        },
    },

    userActive: {
        backgroundColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 7 : 5],
    },

    tabs: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    tabsList: {
        borderBottom: '0 !important',
    },

    tabControl: {
        fontWeight: 500,
        height: 38,
        color: `${theme.white} !important`,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 7 : 5],
        },
    },

    tabControlActive: {
        color: `${theme.colorScheme === 'dark' ? theme.white : theme.black} !important`,
        borderColor: `${theme.colors[theme.primaryColor][6]} !important`,
    },

    loginButton: {
        background: '#000066',
        background: 'moz-linear-gradient(135deg, hsl(240deg 100 % 20 %) 0 %,hsl(289deg 100 % 21 %) 11 %,hsl(315deg 100 % 27 %) 22 %,hsl(329deg 100 % 36 %) 33 %,hsl(337deg 100 % 43 %) 44 %,hsl(357deg 91 % 59 %) 56 %,hsl(17deg 100 % 59 %) 67 %,hsl(34deg 100 % 53 %) 78 %,hsl(45deg 100 % 50 %) 89 %,hsl(55deg 100 % 50 %) 100 %)'
    }
}));