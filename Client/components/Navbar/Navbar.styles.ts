import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
    header: {
        // paddingTop: 5,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
        // borderBottom: `1px solid ${theme.colors[theme.primaryColor][5]}`,
    },

    mainSection: {
        padding: 1
    },

    userMenu: {
        marginTop: 10,
        [theme.fn.smallerThan('xs')]: {
            // display: 'none',
        },
    },
    user: {
        color: theme.white,
        // padding: `1px 0`,
        paddingRight: 10,
        borderRadius: 600,// theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            // backgroundColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 9 : 5],
            backgroundColor: theme.colors.gray[theme.colorScheme === 'dark' ? 7 : 5],
        },
    },

    userActive: {
        backgroundColor: theme.colors.gray[theme.colorScheme === 'dark' ? 7 : 5],

    },
}));