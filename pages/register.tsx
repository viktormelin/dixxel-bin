import { Box, Button, Image, Text, TextInput } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Register = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	if (status === 'authenticated') {
		router.push('/dashboard');
	}

	const registerForm = useForm({
		initialValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) =>
				/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
					? null
					: 'Password must contain at least one letter, one number and be 8 characters minimum',
			confirmPassword: (value) =>
				/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
					? null
					: 'Password must contain at least one letter, one number and be 8 characters minimum',
		},
	});

	return (
		<>
			<Head>
				<title>dixxel.io - Images</title>
				<meta name='description' content='Upload and share images, powered by dixxel.io' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Box
				component='main'
				sx={{
					height: '100vh',
					width: '100%',
					display: 'flex',
				}}
			>
				{/* <Link href='map'>Goto Map</Link> */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flex: '1',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Button
						sx={{
							display: 'flex',
							justifyContent: 'center',
							width: '20rem',
							marginBottom: '2rem',
						}}
						onClick={() => signIn('discord', { callbackUrl: 'http://localhost:3000/dashboard' })}
					>
						<Text>Continue with Discord</Text>
					</Button>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '1rem',
							width: '20rem',
						}}
						component='form'
						onSubmit={registerForm.onSubmit((values) => console.log(values))}
					>
						<TextInput
							sx={{ width: '100%' }}
							withAsterisk
							label='Email'
							placeholder='your@email.com'
							{...registerForm.getInputProps('email')}
						/>
						<TextInput
							sx={{ width: '100%' }}
							withAsterisk
							label='Password'
							type='password'
							{...registerForm.getInputProps('password')}
						/>
						<TextInput
							sx={{ width: '100%' }}
							withAsterisk
							label='Confirm Password'
							type='password'
							{...registerForm.getInputProps('confirmPassword')}
						/>
						<Button disabled type='submit'>
							Register
						</Button>
					</Box>
					<Text
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '0.5rem',
							marginTop: '1rem',
						}}
					>
						Already have an account?{' '}
						<Link href='/'>
							<Text
								sx={{
									fontWeight: 'bold',
								}}
							>
								Login instead
							</Text>
						</Link>
					</Text>
				</Box>
				<Box
					sx={(theme) => ({
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						flex: '1',
						backgroundImage: theme.fn.gradient({ from: theme.colors.blue[7], to: theme.colors.blue[4] }),
					})}
				>
					<Image
						sx={{
							maxWidth: '450px',
						}}
						src='https://imagedelivery.net/3ecvmLCFkS-FijMWb0qFvQ/aca8e9de-5742-459f-e56b-dc95c8fe0c00/w=450'
						alt='images stacked'
					/>
					<Text
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							color: '#fff',
						}}
					>
						Website created by{' '}
						<a href='https://dixxel.io'>
							<Image
								sx={{
									maxWidth: '75px',
								}}
								src='https://imagedelivery.net/3ecvmLCFkS-FijMWb0qFvQ/e038977e-3fa6-41c2-c272-fd5a06649b00/w=75'
								alt='dixxel'
							/>
						</a>
					</Text>
				</Box>
			</Box>
		</>
	);
};

export default Register;
