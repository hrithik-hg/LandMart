import {createListing, deleteListing} from '../controllers/listing.controllers.js'
import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);

export default router;

