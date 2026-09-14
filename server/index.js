import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import testimonialsRouter from './routes/testimonials.js';
import { checkSupabaseConnection } from './lib/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api/testimonials', testimonialsRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const supabaseStatus = await checkSupabaseConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      supabaseConfigured: !!supabaseStatus.connected,
      tableReady: !!supabaseStatus.tableExists,
      note: supabaseStatus.tableExists 
        ? 'Connected to Supabase testimonials table.' 
        : 'Supabase table pending migration. Fallback store active.'
    }
  });
});

// Serve static assets in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Also serve public assets folder directly if needed
app.use('/assets', express.static(path.resolve(__dirname, '../public/assets')));

// React Router SPA fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.resolve(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In dev mode when dist doesn't exist yet, return helpful json
      res.status(200).json({
        message: 'Faith Centre API Server is running. In dev mode, please view frontend on Vite dev server.'
      });
    }
  });
});

app.listen(PORT, async () => {
  console.log(`\n==================================================`);
  console.log(`✨ FAITH CENTRE — Server running on port ${PORT}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
  
  // Asynchronously check Supabase connection
  const conn = await checkSupabaseConnection();
  if (conn.connected && conn.tableExists) {
    console.log(`✅ Supabase Database: Connected and 'testimonials' table is ready.`);
  } else if (conn.connected && !conn.tableExists) {
    console.log(`ℹ️ Supabase connected. 'testimonials' table not found yet.`);
    console.log(`📄 Run the SQL script in 'supabase/schema.sql' in your Supabase SQL Editor to enable full PostgreSQL persistence.`);
    console.log(`🛡️ Fallback storage active in the meantime.`);
  } else {
    console.log(`⚠️ Supabase connection note: ${conn.error || 'Check environment variables'}`);
  }
});
