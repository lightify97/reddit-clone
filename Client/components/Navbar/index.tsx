import React, { useState } from 'react';
import {
    Container,
    Avatar,
    UnstyledButton,
    Group,
    Text,
    Menu,
    Divider,
    Burger,
    Button,
    BackgroundImage,
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import {
    Logout,
    Heart,
    Star,
    Message,
    Settings,
    Trash,
    SwitchHorizontal,
    ChevronDown,
    UserCheck,
    UserPlus,
} from 'tabler-icons-react';
import useStyles from './Navbar.styles'
import Link from 'next/link';


interface NavbarProps {
    user?: { name: string; image: string };
}

const Navbar = ({ user }: NavbarProps) => {
    const { classes, theme, cx } = useStyles();
    const [opened, toggleOpened] = useBooleanToggle(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    // const items = tabs.map((tab) => <Tabs.Tab label={tab} key={tab} />);

    return (
        <div className={classes.header}>
            <Container className={classes.mainSection} >
                <Group position="right">
                    <Burger
                        opened={opened}
                        onClick={() => toggleOpened()}
                        className={classes.burger}
                        size="sm"
                        color={theme.white}
                    />
                    {!user &&
                        <>
                            <Link href={'/login'} passHref>
                                <Button leftIcon={<UserCheck />}>Login</Button>
                            </Link>
                            <Link href={'/register'} passHref>
                                <Button leftIcon={<UserPlus />} variant="filled" color='green'>Sign Up</Button>
                            </Link>
                        </>
                    }
                    {user && <Menu
                        size={260}
                        placement="end"
                        transition="pop-top-right"
                        className={classes.userMenu}
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                        control={
                            <UnstyledButton
                                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                            >
                                <Group spacing={7}>
                                    <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                                    <Text weight={500} size="sm" sx={{ lineHeight: 1, color: theme.white }} mr={3}>
                                        {user.name}
                                    </Text>
                                    <ChevronDown size={12} />
                                </Group>
                            </UnstyledButton>
                        }
                    >
                        <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
                            Liked posts
                        </Menu.Item>
                        <Menu.Item icon={<Star size={14} color={theme.colors.yellow[6]} />}>
                            Saved posts
                        </Menu.Item>
                        <Menu.Item icon={<Message size={14} color={theme.colors.blue[6]} />}>
                            Your comments
                        </Menu.Item>

                        <Menu.Label>Settings</Menu.Label>
                        <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item>
                        <Menu.Item icon={<SwitchHorizontal size={14} />}>Change account</Menu.Item>
                        <Menu.Item icon={<Logout size={14} />}>Logout</Menu.Item>

                        <Divider />

                        <Menu.Label>Danger zone</Menu.Label>
                        <Menu.Item color="red" icon={<Trash size={14} />}>
                            Delete account
                        </Menu.Item>
                    </Menu>
                    }
                </Group>
            </Container>
            <Container>
                {/* <Tabs
                    variant="outline"
                    classNames={{
                        root: classes.tabs,
                        tabsListWrapper: classes.tabsList,
                        tabControl: classes.tabControl,
                        tabActive: classes.tabControlActive,
                    }}
                >

                </Tabs> */}
            </Container>
        </div >
    );
}


export default Navbar;