// import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
// import { SunIcon, MoonIcon } from '@modulz/radix-icons';

// export function ColorSchemeToggle() {
//   const { colorScheme, toggleColorScheme } = useMantineColorScheme();

//   return (
//     <Group>
//       <ActionIcon
//         // style={{ position: 'relative', bottom: 20, right: 1 }}
//         radius="xl"
//         onClick={() => toggleColorScheme()}
//         size="lg"
//         sx={(theme) => ({
//           backgroundColor:
//             theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
//           color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
//         })}
//       >
//         {colorScheme === 'dark' ? (
//           <SunIcon width={20} height={20} />
//         ) : (
//           <MoonIcon width={20} height={20} />
//         )}
//       </ActionIcon>
//     </Group>
//   );
// }

import React from 'react';
import {
  createStyles,
  UnstyledButton,
  Text,
  Center,
  useMantineColorScheme,
  Group,
} from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { Moon, Sun } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  control: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 1000,
    paddingLeft: theme.spacing.sm,
    paddingRight: 4,
    width: 136,
    height: 36,
  },

  iconWrapper: {
    height: 28,
    width: 28,
    borderRadius: 28,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.dark[4],
    color: theme.colorScheme === 'dark' ? theme.black : theme.colors.blue[2],
  },

  value: {
    lineHeight: 1,
  },
}));

export function ColorSchemeToggle() {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const Icon = colorScheme === 'dark' ? Sun : Moon;

  return (
    <Group position="center">
      <UnstyledButton
        aria-label="Toggle theme"
        className={classes.control}
        onClick={() => toggleColorScheme()}
        title="Ctrl + J"
      >
        <Text size="sm" className={classes.value}>
          {upperFirst(colorScheme === 'light' ? 'dark' : 'light')} theme
        </Text>

        <Center className={classes.iconWrapper}>
          <Icon size={18} />
        </Center>
      </UnstyledButton>
    </Group>
  );
}
