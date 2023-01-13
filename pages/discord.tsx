import { Anchor, Box, Button, Text } from '@mantine/core';
import Head from 'next/head';

const Discord = () => {
	return (
		<>
			<Head>
				<title>dixxel.io - Discord</title>
				<meta name='description' content='Upload and share images, powered by dixxel.io' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Box
				component='main'
				sx={{
					height: '100vh',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '2rem',
				}}
			>
				<Text>To use this service while in testing you need to join our discord and become verified.</Text>
				<Anchor href='https://discord.gg/pGN6qB9F' target='_blank'>
					<Button variant='subtle'>Join Discord</Button>
				</Anchor>
			</Box>
		</>
	);
};

export default Discord;
