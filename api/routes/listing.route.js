import {createListing} from '../controllers/listing.controllers.js'
import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

const router = express();

router.post('/create', verifyToken, createListing);

export default router;

