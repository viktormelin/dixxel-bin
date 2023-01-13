import { Box, Button } from '@mantine/core';
import Icon from './Icon';
import UserMenu from './UserMenu';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

const Navbar = ({ session, screen }: { session: Session | null; screen: string }) => {
	const router = useRouter();

	return (
		<Box
			component='nav'
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '3rem',
				padding: '1rem',
			}}
		>
			<Button
				sx={(theme) => ({ backgroundColor: screen === 'upload' ? theme.colors.blue[0] : 'transparent' })}
				variant='subtle'
				leftIcon={<Icon icon='upload' />}
				onClick={() => router.push('/dashboard')}
			>
				Upload
			</Button>
			<Button
				sx={(theme) => ({ backgroundColor: screen === 'images' ? theme.colors.blue[0] : 'transparent' })}
				variant='subtle'
				leftIcon={<Icon icon='photo' />}
				onClick={() => router.push('/dashboard/images')}
			>
				Images
			</Button>
			<UserMenu session={session} />
		</Box>
	);
};

export default Navbar;
