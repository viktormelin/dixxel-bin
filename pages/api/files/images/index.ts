import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { resolve } from 'path';
import Cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const cors = Cors({
	methods: ['POST', 'GET', 'HEAD'],
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
};

const uploadFile = async (file: any) => {
	const data = fs.readFileSync(file.filepath);
	fs.writeFileSync(`./public/temp/${file.originalFilename}`, data);
	fs.unlinkSync(file.filepath);

	const tempFile = fs.readFileSync(`./public/temp/${file.originalFilename}`);
	const tempBlob = new Blob([tempFile]);
	const body = new FormData();
	const uuid = uuidv4();
	const fileExtension = file.originalFilename.split('.').pop();
	// file size converted to MB from
	const fileSize = file.size * 0.001;

	body.append('file', tempBlob, `${uuid}.${fileExtension}`);
	// body.append('url', `http://localhost:3000/temp/${file.originalFilename}`);

	const result = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v1`,
		{
			credentials: 'include',
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
			},
			body,
		}
	);

	const removedFiled = fs.rmSync(`./public/temp/${file.originalFilename}`);
	const json = result.json();
	return json;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);
	const sessionToken = req.cookies['next-auth.session-token'];
	const { type, scope, id } = req.query;

	if (sessionToken) {
		const user = await prisma.session.findUnique({ where: { sessionToken } });
		if (user) {
			if (type === 'upload') {
				const form = new formidable.IncomingForm();
				form.parse(req, async (err, fields, files) => {
					if (err) {
						res.status(400).send(err);
					}

					console.log(files.image);

					const response = await uploadFile(files.image);
					const { result } = response;
					if (response.success === true) {
						const dbImage = await prisma.images.create({
							data: {
								userId: user.userId,
								imageId: result.id,
								imageURL: result.variants[0],
								imageName: result.filename,
							},
						});

						if (dbImage) {
							res.status(201).json(dbImage);
							res.end();
						} else {
							res.status(500).send('Could not create image on server');
						}
					} else {
						res.status(500);
					}
				});
			} else if (type === 'fetch') {
				if (scope === 'all') {
					const images = await prisma.images.findMany({
						where: {
							userId: user.userId,
						},
					});

					if (images) {
						res.status(200).json(images);
						res.end();
					} else {
						res.status(400).send('No images found');
					}
				}
			} else if (type === 'delete') {
				if (id && typeof id === 'string') {
					const deletedImage = await prisma.images.deleteMany({
						where: {
							imageId: id,
							userId: user.userId,
						},
					});

					if (deletedImage.count > 0) {
						res.status(200).send('Image removed');
					} else {
						res.status(400).send('No image found');
					}
				} else {
					res.status(400).send('Image ID was not specified as a string');
				}
			}
		} else {
			res.status(400).send('No user found');
		}
	} else {
		res.status(401).send('No session found');
	}
};

export default handler;
