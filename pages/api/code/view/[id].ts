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
	const { id } = req.query;
	if (id && typeof id === 'string') {
		const codeSnipppet = await prisma.codes.findUnique({ where: { id } });
		if (codeSnipppet) {
			res.status(200).json(codeSnipppet);
			res.end();
		} else {
			res.status(500).send('No snippet found with that id');
		}
	} else {
		res.status(400).send('No snippet id provided, or it was not a string');
	}
};

export default handler;
