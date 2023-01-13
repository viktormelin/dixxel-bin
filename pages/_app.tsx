import '../styles/globals.css';
import type { AppProps } from 'next/app';
import theme from '../themes/theme';
import { Box, Button, Dialog, Group, MantineProvider, Text, TextInput } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const [cookieOpen, setCookieOpen] = useState<string | null>(localStorage.getItem('cookies'));
	const onClose = () => {
		localStorage.setItem('cookies', 'true');
		setCookieOpen('true');
	};
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				<ModalsProvider>
					<NotificationsProvider>
						<SessionProvider session={session}>
							<Component {...pageProps} />
							<Dialog
								opened={cookieOpen !== 'true'}
								withCloseButton
								onClose={onClose}
								size='lg'
								radius='md'
								shadow='xl'
							>
								<Text weight={500}>This website uses cookies</Text>
								<Text size={'sm'}>
									We only store vital information in 🍪 cookies to make your experience as good as possible.
								</Text>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
									}}
								></Box>
							</Dialog>
						</SessionProvider>
					</NotificationsProvider>
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	);
}
