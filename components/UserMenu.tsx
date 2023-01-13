import { Button, Image, Menu } from '@mantine/core';
import Icon from './Icon';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

const UserMenu = ({ session }: { session: Session | null }) => {
	const router = useRouter();
	return (
		<>
			{session ? (
				<Menu shadow='lg' width={200}>
					<Menu.Target>
						<Button
							sx={{
								padding: '0.5rem',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							leftIcon={<Image src={session?.user?.image} alt='discord avatar' width={16} height={16} />}
						>
							{session?.user?.name}
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Code Actions</Menu.Label>
						<Menu.Item icon={<Icon icon='list' />}>Saved Codes</Menu.Item>
						<Menu.Label>User Actions</Menu.Label>
						{/* <Menu.Item icon={<Icon icon='database' />}>Usage</Menu.Item> */}
						<Menu.Item disabled icon={<Icon icon='adjustments-alt' />}>
							Settings
						</Menu.Item>
						<Menu.Item disabled icon={<Icon icon='receipt' />}>
							Billing
						</Menu.Item>
						<Menu.Item
							onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}
							color='red'
							icon={<Icon icon='door-exit' />}
						>
							Sign Out
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			) : null}
			{!session ? (
				<Button
					sx={{
						padding: '0.5rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					leftIcon={<Icon icon='user-circle' />}
					onClick={() => router.push('/login')}
				>
					Login
				</Button>
			) : null}
		</>
	);
};

export default UserMenu;
