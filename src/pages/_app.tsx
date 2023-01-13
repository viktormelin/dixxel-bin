import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '../utils/api';

import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import theme from '../themes/theme';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<SessionProvider session={session}>
			<MantineProvider theme={theme}>
				<ModalsProvider>
					<NotificationsProvider>
						<Component {...pageProps} />
					</NotificationsProvider>
				</ModalsProvider>
			</MantineProvider>
		</SessionProvider>
	);
};

export default api.withTRPC(MyApp);
