import '../styles/globals.css';
import type { AppProps } from 'next/app';
import theme from '../themes/theme';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				<ModalsProvider>
					<NotificationsProvider>
						<SessionProvider session={session}>
							<Component {...pageProps} />
						</SessionProvider>
					</NotificationsProvider>
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	);
}
