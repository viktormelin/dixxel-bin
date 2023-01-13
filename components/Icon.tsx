import { Text } from '@mantine/core';

const Icon = ({ icon, size }: { icon: string; size?: string }) => {
	const iconClass = `ti ti-${icon}`;
	const pxSize = size ?? 20;

	return (
		<Text
			sx={{
				fontSize: `${pxSize}px`,
			}}
		>
			<i className={iconClass}></i>
		</Text>
	);
};

export default Icon;
