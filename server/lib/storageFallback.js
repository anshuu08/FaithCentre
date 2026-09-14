import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');
const dataFile = path.resolve(dataDir, 'testimonials.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure data file exists with empty array
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2), 'utf8');
}

export const getLocalTestimonials = (includeHash = false) => {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items = JSON.parse(raw);
    if (includeHash) return items;
    return items.map(({ delete_token_hash, ...rest }) => rest);
  } catch (err) {
    console.error('Error reading local fallback testimonials:', err);
    return [];
  }
};

export const saveLocalTestimonial = (testimonial) => {
  try {
    const current = getLocalTestimonials(true);
    current.unshift(testimonial);
    fs.writeFileSync(dataFile, JSON.stringify(current, null, 2), 'utf8');
    return testimonial;
  } catch (err) {
    console.error('Error saving local fallback testimonial:', err);
    throw err;
  }
};

export const deleteLocalTestimonial = (id, tokenHash) => {
  try {
    const current = getLocalTestimonials(true);
    const target = current.find((item) => item.id === id);
    if (!target) return { found: false, deleted: false };
    if (target.delete_token_hash && tokenHash && target.delete_token_hash !== tokenHash) {
      return { found: true, deleted: false, unauthorized: true };
    }
    const filtered = current.filter((item) => item.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify(filtered, null, 2), 'utf8');
    return { found: true, deleted: true };
  } catch (err) {
    console.error('Error deleting local fallback testimonial:', err);
    return { found: false, deleted: false };
  }
};


