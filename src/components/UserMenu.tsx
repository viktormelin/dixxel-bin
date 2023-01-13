import { Button, Image, Menu } from '@mantine/core';
import Icon from './Icon';
import { signOut, useSession } from 'next-auth/react';

const UserMenu = () => {
	const { data: sessionData } = useSession();

	return (
		<>
			{sessionData ? (
				<Menu shadow='lg' width={200}>
					<Menu.Target>
						<Button
							sx={{
								padding: '0.5rem',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							leftIcon={<Image src={sessionData.user?.image} alt='discord avatar' width={16} height={16} />}
						>
							{sessionData.user?.name}
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>User Actions</Menu.Label>
						<Menu.Item disabled icon={<Icon icon='adjustments-alt' />}>
							Settings
						</Menu.Item>
						<Menu.Item disabled icon={<Icon icon='receipt' />}>
							Billing
						</Menu.Item>
						<Menu.Item
							onClick={() => void signOut({ callbackUrl: 'http://localhost:3000/' })}
							color='red'
							icon={<Icon icon='door-exit' />}
						>
							Sign Out
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			) : null}
			{!sessionData ? (
				<Button
					sx={{
						padding: '0.5rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					Login
				</Button>
			) : null}
		</>
	);
};

export default UserMenu;
