import { ActionIcon, Box, Button, Image, Loader, LoadingOverlay, Menu, Table, Text, Tooltip } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { getCsrfToken, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import Link from 'next/link';
import UserMenu from '../../components/UserMenu';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';

const Dashboard = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	if (status === 'unauthenticated') {
		router.push('/');
	}

	const [isUploading, setIsUploading] = useState(false);
	const [files, setFiles] = useState<any>([]);

	const uploadFile = (upload: any) => {
		let temp = [];

		for (const item in upload) {
			temp.push({ file: upload[item], loading: false });
			// temp.push({
			// 	path: upload[item].path,
			// 	name: upload[item].name,
			// 	size: upload[item].size,
			// 	type: upload[item].type,
			// 	webkitRelativePath: upload[item].webkitRelativePath,
			// });
		}

		setFiles([...files, ...temp]);
	};

	const removeFile = (name: string) => {
		setFiles(files.filter((item: any) => item.file.name !== name));
	};

	const uploadToServer = async () => {
		setIsUploading(true);

		for (const index in files) {
			files[index].loading = true;
			const body = new FormData();
			body.append('image', files[index].file, files[index].file.name);
			await fetch(`/api/files/images?type=upload`, {
				method: 'POST',
				body,
			}).then((res) => {
				console.log(res);
				if (res.status === 201) {
					res.json().then((data) => {
						setIsUploading(false);
						setFiles([]);
						showNotification({
							title: 'Completed upload',
							message: `Finished uploading new image with name ${data.imageName}`,
							color: 'green',
						});
					});
				} else {
					setIsUploading(false);
					setFiles([]);
					showNotification({
						title: 'Could not upload image',
						message: 'Failed to upload images to the server',
						color: 'red',
					});
				}
			});
		}
	};

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
					height: '100vh',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Navbar session={session} screen={'upload'} />
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						height: '100%',
					}}
				>
					<Dropzone
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							width: '30rem',
							height: '15rem',
						}}
						onDrop={uploadFile}
						onReject={() =>
							showNotification({
								title: 'Could not upload image',
								message: 'The file you tried to upload is not allowed',
								color: 'red',
							})
						}
						accept={IMAGE_MIME_TYPE}
					>
						<LoadingOverlay visible={isUploading} overlayBlur={1} />
						<Dropzone.Accept>
							<Icon icon='photo-check' size='25' />
						</Dropzone.Accept>
						<Dropzone.Reject>
							<Icon icon='photo-cancel' size='25' />
						</Dropzone.Reject>
						<Dropzone.Idle>
							<Icon icon='photo' size='25' />
						</Dropzone.Idle>
						<Box>
							<Text>Drag images here or select files</Text>
						</Box>
					</Dropzone>

					{files.length > 0 ? (
						<Table
							sx={{
								width: '30rem',
							}}
						>
							<thead>
								<tr>
									<th>Name</th>
								</tr>
							</thead>
							<tbody>
								{files.map((item: any) => (
									<tr key={item.file.name}>
										<Text
											component='td'
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<Text>{item.file.name}</Text>
											{item.loading ? <Loader size={20} /> : null}
											{!item.loading ? (
												<Tooltip label='Remove' withArrow>
													<ActionIcon onClick={() => removeFile(item.file.name)} color='red'>
														<Icon icon='trash' />
													</ActionIcon>
												</Tooltip>
											) : null}
										</Text>
									</tr>
								))}
							</tbody>
						</Table>
					) : null}

					{files.length > 0 ? (
						<Box sx={{ display: 'flex', gap: '1rem' }}>
							<Button onClick={uploadToServer}>Upload</Button>
							<Button color='red' onClick={() => setFiles([])}>
								Clear
							</Button>
						</Box>
					) : null}
				</Box>
				{/* <Footer /> */}
			</Box>
		</>
	);
};

export default Dashboard;
