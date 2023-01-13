import { Box, Button, Container } from '@mantine/core';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubDark } from '@uiw/codemirror-theme-github';
import Icon from '../components/Icon';
import { useSession } from 'next-auth/react';
import UserMenu from '../components/UserMenu';
import { useRouter } from 'next/router';

const Index: NextPage = () => {
	const { data: sessionData } = useSession();
	const router = useRouter();
	const [isUploadingCode, setIsUploadingCode] = useState<boolean>(false);
	const [codeValue, setCodeValue] = useState<string>(`class ProductCategoryRow extends React.Component {
		render() {
			const category = this.props.category;
			return (
				<tr>
					<th colSpan="2">
						{category}
					</th>
				</tr>
			);
		}
	}`);

	const onChange = useCallback((value: string) => {
		setCodeValue(value);
	}, []);

	const onShare = async () => {
		if (codeValue && codeValue.length > 0) {
			setIsUploadingCode(true);
			const body = JSON.stringify(codeValue);
			await fetch(`/api/code/share`, { method: 'POST', body }).then((res) =>
				res.json().then((data) => router.push(`/view/${data.id}`))
			);
		}
	};

	return (
		<>
			<Head>
				<title>dixxel.io - Bin</title>
				<meta name='description' content='Write and share code' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Box
				component='main'
				// sx={(theme) => ({
				// 	backgroundColor: theme.colors.gray[9],
				// })}
			>
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
						<CodeMirror
							theme={githubDark}
							value={codeValue}
							width='100%'
							height='70vh'
							extensions={[javascript({ jsx: true })]}
							onChange={onChange}
						/>
						<Box
							sx={{
								display: 'flex',
								width: '100%',
								justifyContent: 'center',
								gap: '1rem',
							}}
						>
							{sessionData ? (
								<Button
									disabled={isUploadingCode}
									sx={{
										padding: '0.5rem',
									}}
									leftIcon={<Icon icon='share' />}
									onClick={onShare}
								>
									Share and Save Code
								</Button>
							) : null}
							{!sessionData ? (
								<>
									<Button
										disabled={isUploadingCode}
										sx={{
											padding: '0.5rem',
										}}
										leftIcon={<Icon icon='share' />}
										onClick={onShare}
									>
										Share Code
									</Button>
									<Button
										disabled
										sx={{
											padding: '0.5rem',
										}}
										leftIcon={<Icon icon='share' />}
									>
										Share and Save Code
									</Button>
								</>
							) : null}
						</Box>
					</Box>
				</Container>
				{/* <AuthShowcase /> */}
			</Box>
		</>
	);
};

export default Index;
