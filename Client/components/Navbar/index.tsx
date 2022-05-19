import {
  Avatar,
  Button,
  Container,
  Divider,
  Group,
  Indicator,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { withUrqlClient } from 'next-urql';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import {
  ChevronDown,
  Heart,
  Logout,
  Message,
  Settings,
  Star,
  SwitchHorizontal,
  Trash,
  UserCheck,
  UserPlus,
} from 'tabler-icons-react';
import { State } from '../../context';
import { useLogoutMutation, useMeQuery } from '../../graphql/generated/graphql';
import { createUrqlClient } from '../../util/createUrqlClient';
import { isServer } from '../../util/isServer';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import useStyles from './Navbar.styles';

const Navbar = () => {
  const [{ data: user, fetching: fetcingUser }, getMe] = useMeQuery({ pause: isServer() });
  let navStatus = null;
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    getMe();
    setHasMounted(true);
  }, []);
  // const { user, setUser } = useContext(State);
  const [_, logout] = useLogoutMutation();
  const handleLogout = () => {
    // setUser(null);
    logout();
  };

  if (user?.me) {
    navStatus = (
      <Group>
        <Menu
          shadow="xl"
          size={190}
          withArrow
          position="bottom"
          placement="center"
          transition="pop"
          className={classes.userMenu}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          control={
            <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
              <Group spacing={5}>
                <Indicator
                  inline
                  size={12}
                  offset={7}
                  position="bottom-end"
                  color="green"
                  withBorder
                >
                  <Avatar
                    size="md"
                    radius="xl"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
                  >
                    MH
                  </Avatar>
                </Indicator>
                <Text weight={700} size="md" sx={{ lineHeight: 1 }} mr={3}>
                  {user.me?.name}
                </Text>
                <ChevronDown size={20} />
              </Group>
            </UnstyledButton>
          }
        >
          <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>Liked posts</Menu.Item>
          <Menu.Item icon={<Star size={14} color={theme.colors.yellow[6]} />}>
            Saved posts
          </Menu.Item>
          <Menu.Item icon={<Message size={14} color={theme.colors.blue[6]} />}>
            Your comments
          </Menu.Item>
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item>
          <Menu.Item icon={<SwitchHorizontal size={14} />}>Change account</Menu.Item>
          <Menu.Item onClick={() => handleLogout()} icon={<Logout size={14} />}>
            Logout
          </Menu.Item>
          <Divider />
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item color="red" icon={<Trash size={14} />}>
            Delete account
          </Menu.Item>
        </Menu>
      </Group>
    );
  } else {
    navStatus = (
      <Group>
        <Link href={'/login'} passHref>
          <Button leftIcon={<UserCheck />}>Login</Button>
        </Link>
        <Link href={'/register'} passHref>
          <Button leftIcon={<UserPlus />} variant="filled" color="green">
            Sign Up
          </Button>
        </Link>
      </Group>
    );
  }

  if (!hasMounted) {
    navStatus = null;
  }
  return (
    <div className={classes.navbar}>
      {/* <Container className={classes.mainSection}> */}
      <Group position="apart">
        <Group ml={15}>
          <Image alt="reddit logo" src="/reddit.png" width={50} height={50} />
          <Text component="span" align="center" mt={0} className={classes.logo}>
            <Link href={'/'}>REEDIT</Link>
          </Text>
        </Group>
        <Group>
          {navStatus}
          <ColorSchemeToggle />
        </Group>
      </Group>
      {/* </Container> */}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Navbar);
