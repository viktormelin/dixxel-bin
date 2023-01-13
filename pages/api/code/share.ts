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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);
	const sessionToken = req.cookies['next-auth.session-token'];
	const code = req.body;

	if (code) {
		if (sessionToken) {
			const user = await prisma.session.findUnique({ where: { sessionToken } });
			if (user) {
				const codeSnippet = await prisma.codes.create({
					data: {
						userId: user.userId,
						code,
					},
				});

				if (codeSnippet) {
					res.status(201).json(codeSnippet);
					res.end();
				} else {
					res.status(500).send('Failed to create snippet on server');
				}
			} else {
				res.status(400).send('No user found with your session token');
			}
		} else {
			const codeSnippet = await prisma.codes.create({
				data: {
					code,
				},
			});

			if (codeSnippet) {
				res.status(201).json(codeSnippet);
				res.end();
			} else {
				res.status(500).send('Failed to create snippet on server');
			}
		}
	} else {
		res.status(400).send('No code value was provided from the client');
	}
};

export default handler;
