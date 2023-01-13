import { Box, Image, Text } from '@mantine/core';

const Footer = () => {
	return (
		<Box
			component='footer'
			sx={(theme) => ({
				position: 'absolute',
				bottom: '0',
				width: '100%',
				padding: '0.25rem',
				backgroundColor: theme.colors.blue[6],
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			})}
		>
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
	);
};

export default Footer;
