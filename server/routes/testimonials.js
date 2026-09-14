import express from 'express';
import { createTestimonial, getTestimonials, deleteTestimonial } from '../controllers/testimonialsController.js';

const router = express.Router();

// GET /api/testimonials - Retrieve all testimonies, newest first
router.get('/', getTestimonials);

// POST /api/testimonials - Submit a new testimony
router.post('/', createTestimonial);

// DELETE /api/testimonials/:id - Delete a testimony
router.delete('/:id', deleteTestimonial);

export default router;

