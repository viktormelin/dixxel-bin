import { Box, Button, Container, LoadingOverlay } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubDark } from '@uiw/codemirror-theme-github';
import UserMenu from '../../components/UserMenu';
import { useSession } from 'next-auth/react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { Codes } from '@prisma/client';
import { useState } from 'react';
import Icon from '../../components/Icon';

const view = () => {
	const { data: sessionData } = useSession();
	const router = useRouter();
	const { id } = router.query;

	const getCodeSnippet = async () => {
		let retVal: Codes = {
			id: '',
			userId: '',
			code: '',
			createdAt: new Date(),
		};
		await fetch(`/api/code/view/${id}`, { method: 'GET', body: null }).then((res) =>
			res.json().then((data: Codes) => {
				retVal = data;
			})
		);

		return retVal;
	};

	const { isLoading, isError, data, error } = useQuery(`${id}`, getCodeSnippet);
	return (
		<>
			<Head>
				<title>dixxel.io - Bin</title>
				<meta name='description' content='Write and share code' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Box component='main'>
				<Container
					sx={{
						height: '100vh',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
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
						<UserMenu session={sessionData} />
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '2rem',
						}}
					>
						<>
							<LoadingOverlay visible={isLoading} overlayBlur={2} />
						</>
						{data ? (
							<CodeMirror
								theme={githubDark}
								value={JSON.parse(data.code)}
								editable={false}
								width='100%'
								height='70vh'
								extensions={[javascript({ jsx: true })]}
							/>
						) : null}
						<Box
							sx={{
								display: 'flex',
								width: '100%',
								justifyContent: 'center',
								gap: '1rem',
							}}
						>
							<Button
								sx={{
									padding: '0.5rem',
								}}
								leftIcon={<Icon icon='home' />}
								onClick={() => router.push('/')}
							>
								Create new Code Snippet
							</Button>
						</Box>
					</Box>
				</Container>
				{/* <AuthShowcase /> */}
			</Box>
		</>
	);
};

export default view;
