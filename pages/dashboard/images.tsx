import {
	Anchor,
	Box,
	Button,
	Card,
	Group,
	Image,
	Loader,
	LoadingOverlay,
	Modal,
	Table,
	Text,
	TextInput,
	Tooltip,
} from '@mantine/core';
import { useValidatedState } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import Head from 'next/head';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useClientImages from '../../hooks/useClientImages';
import { Images } from '@prisma/client';
import theme from '../../themes/theme';
import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserImages } from '../../helpers/getUserImages';
import Icon from '../../components/Icon';

const Images = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	if (status === 'unauthenticated') {
		router.push('/');
	}

	const [currentlyDeleting, setCurrentlyDeleting] = useState<string[]>([]);

	const deleteHelper = (image: Images) => {
		mutation.mutate(image);
	};

	const deleteImage = async (image: Images) => {
		if (image) {
			await fetch(`/api/files/images?type=delete&id=${image.imageId}`, {
				method: 'DELETE',
			}).then((res) => {
				if (res.status === 200) {
					showNotification({
						title: 'Image deleted',
						message: 'Successfully deleted the image',
						color: 'green',
					});
				}
			});
		} else {
			showNotification({
				title: 'Could not delete image',
				message: 'Failed to delete image, try again later',
				color: 'red',
			});
			return false;
		}
	};

	const queryClient = useQueryClient();
	const { isLoading, isError, data, error } = useQuery('userImages', getUserImages);
	const mutation = useMutation(deleteImage, {
		onSuccess: () => {
			queryClient.invalidateQueries('userImages');
		},
	});

	const openModal = (image: Images) =>
		openConfirmModal({
			title: 'Please confirm your action',
			children: <Text size='sm'>Are you sure you want to delete the image?</Text>,
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			onConfirm: () => deleteHelper(image),
		});

	const modalHandler = (image: Images) => {
		setCurrentlyDeleting([...currentlyDeleting, image.imageId]);
		openModal(image);
	};

	// const splitString = (str: string) => {
	// 	return str.split('.');
	// };

	return (
		<>
			<Head>
				<title>dixxel.io - Dashboard</title>
				<meta name='description' content='Upload and share images, powered by dixxel.io' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Box
				component='main'
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Navbar session={session} screen={'images'} />
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
					}}
				>
					<LoadingOverlay visible={isLoading} overlayBlur={1} />
					{data ? (
						<Box
							sx={{
								display: 'grid',
								gap: '1rem',
								gridTemplateColumns: 'repeat(4, 1fr)',
								maxWidth: '960px',
							}}
						>
							{data.map((image: Images) => (
								<Card key={image.imageId} shadow='sm' p='lg' radius='md' withBorder>
									<Card.Section p='lg'>
										<Image fit='contain' src={image.imageURL} height={160} alt={image.imageName} />
									</Card.Section>

									{/* <Group position='apart' mt='md' mb='xs'>
										<TextInput
											aria-label={image.imageName}
											value={splitString(image.imageName)[0]}
											rightSection={<Text>.{splitString(image.imageName)[1]}</Text>}
										/>
									</Group> */}

									<Text size='sm' color='dimmed'>
										{image.createdAt.toLocaleString()}
									</Text>

									<Box
										sx={{
											display: 'flex',
											gap: '0.25rem',
										}}
									>
										<Anchor
											sx={{
												flex: '1',
											}}
											href={image.imageURL}
											target='_blank'
										>
											<Button fullWidth>Open Image</Button>
										</Anchor>
										<Button
											disabled={currentlyDeleting.includes(image.imageId)}
											onClick={() => modalHandler(image)}
											color='red'
										>
											{currentlyDeleting.includes(image.imageId) ? <Loader size={20} /> : <Icon icon='trash' />}
										</Button>
									</Box>
								</Card>
							))}
						</Box>
					) : null}
				</Box>
				{/* <Footer /> */}
			</Box>
		</>
	);
};

export default Images;
