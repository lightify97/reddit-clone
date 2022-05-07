import React from 'react';
import { Text, Container, ActionIcon, Group, Badge } from '@mantine/core';
import { BrandTwitter, BrandYoutube, BrandInstagram } from 'tabler-icons-react';
import useStyles from './Footer.styles'
import Link from 'next/link';



interface FooterProps {
    data: {
        title: string;
        links: { label: string; link: string }[];
    }[];
}

const Footer: React.FC<FooterProps> = ({ data }) => {
    const { classes } = useStyles();
    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Text<'a'>
                // styles={ }
                key={index}
                className={classes.link}
                component="a"
                href={link.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Text>
        ));

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title}>{group.title}</Text>
                {links}
            </div>
        );
    });
    return (
        <footer className={classes.footer}>
            <Container className={classes.inner}>
                <div className={classes.logo}>
                    <Text size="xs" color="dimmed" className={classes.description}>
                        Build fully functional accessible web applications faster than ever
                    </Text>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter}>
                <Text color="dimmed" size="sm">
                    © 2020 mantine.dev. All rights reserved.
                </Text>

                <Group spacing={0} className={classes.social} position="right" noWrap>
                    <ActionIcon size="lg">
                        <Link href="https://twitter.com/lightifyCodes" passHref>
                            <BrandTwitter size={18} />
                        </Link>
                    </ActionIcon>
                    <ActionIcon size="lg">
                        <Link href="https://instagram.com" passHref>
                            <BrandYoutube size={18} />
                        </Link>
                    </ActionIcon>
                    <ActionIcon size="lg" >
                        <Link href="https://instagram.com" passHref>
                            <BrandInstagram size={18} />
                        </Link>
                    </ActionIcon>
                </Group>
            </Container>
        </footer>
    );
}


export default Footer;