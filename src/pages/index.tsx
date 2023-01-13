import { Box, Button, Container, Image, MantineTheme, Text, TextInput } from '@mantine/core';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { api } from '../utils/api';
import Icon from '../components/Icon';
import UserMenu from '../components/UserMenu';
import { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { androidstudio, androidstudioInit } from '@uiw/codemirror-theme-androidstudio';

const Home: NextPage = () => {
	const hello = api.example.hello.useQuery({ text: 'from tRPC' });

	const onChange = useCallback((value: any, viewUpdate: any) => {
		console.log('Value:', value);
	}, []);

	return (
		<>
			<Head>
				<title>dixxel.io - Bin</title>
				<meta name='description' content='Write and share code' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Box
				component='main'
				sx={(theme) => ({
					height: '100vh',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: theme.colors.gray[9],
				})}
			>
				<Container>
					<Box
						component='nav'
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							gap: '3rem',
							padding: '1rem',
						}}
					>
						<UserMenu />
					</Box>
					<Box>
						<CodeMirror
							theme={androidstudio}
							value="const func = () => {cosole.log('Hello World')}"
							width='90vw'
							height='90vh'
							extensions={[javascript({ jsx: true })]}
							onChange={onChange}
						/>
					</Box>
				</Container>
				{/* <AuthShowcase /> */}
			</Box>
		</>
	);
};

export default Home;

// const AuthShowcase: React.FC = () => {
// 	const { data: sessionData } = useSession();

// 	const { data: secretMessage } = api.example.getSecretMessage.useQuery(
// 		undefined, // no input
// 		{ enabled: sessionData?.user !== undefined }
// 	);

// 	return (
// 		<div className={styles.authContainer}>
// 			<p className={styles.showcaseText}>
// 				{sessionData && <span>Logged in as {sessionData.user?.name}</span>}
// 				{secretMessage && <span> - {secretMessage}</span>}
// 			</p>
// 			<button className={styles.loginButton} onClick={sessionData ? () => void signOut() : () => void signIn()}>
// 				{sessionData ? 'Sign out' : 'Sign in'}
// 			</button>
// 		</div>
// 	);
// };
