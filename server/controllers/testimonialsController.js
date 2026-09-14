import { supabase } from '../lib/supabase.js';
import { getLocalTestimonials, saveLocalTestimonial, deleteLocalTestimonial } from '../lib/storageFallback.js';
import crypto from 'crypto';

// In-memory cache for recent submissions to prevent duplicate accidental submissions
const recentSubmissions = new Map();

// Helper to sanitize text and prevent script injection
const sanitizeText = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Strip brackets to neutralize html tags
    .replace(/javascript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '');
};

// Sync fallback items to Supabase if table is now available
let isSyncing = false;
const syncFallbackToSupabase = async () => {
  if (isSyncing || !supabase) return;
  try {
    isSyncing = true;
    const localItems = getLocalTestimonials(true);
    if (localItems.length === 0) return;

    // Check if table exists
    const { error: testErr } = await supabase.from('testimonials').select('id').limit(1);
    if (testErr) return;

    // Insert pending items
    for (const item of localItems) {
      if (!item.delete_token_hash) continue;
      await supabase.from('testimonials').upsert([
        {
          id: item.id,
          name: item.name,
          testimony: item.testimony,
          promise: item.promise || null,
          message_details: item.message_details || null,
          created_at: item.created_at,
          delete_token_hash: item.delete_token_hash
        }
      ], { onConflict: 'id' });
    }
  } catch (err) {
    // Silent catch on background sync
  } finally {
    isSyncing = false;
  }
};

export const createTestimonial = async (req, res) => {
  try {
    let { name, testimony, promise, message_details, delete_token_hash } = req.body;

    // 1. Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Your name is required.'
      });
    }

    if (!testimony || typeof testimony !== 'string' || !testimony.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Your testimony is required.'
      });
    }

    // Validate ownership token hash (64-character SHA-256 hex string)
    if (!delete_token_hash || typeof delete_token_hash !== 'string' || !/^[a-f0-9]{64}$/i.test(delete_token_hash.trim())) {
      return res.status(400).json({
        success: false,
        error: 'A valid 64-character deletion token hash is required for secure anonymous ownership.'
      });
    }

    // 2. Sanitize inputs
    const sanitizedName = sanitizeText(name);
    const sanitizedTestimony = sanitizeText(testimony);
    const sanitizedPromise = promise ? sanitizeText(promise) : null;
    const sanitizedMessageDetails = message_details ? sanitizeText(message_details) : null;
    const normalizedTokenHash = delete_token_hash.trim().toLowerCase();

    // 3. Length validations
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Name must be between 2 and 100 characters.'
      });
    }

    if (sanitizedTestimony.length < 10 || sanitizedTestimony.length > 2500) {
      return res.status(400).json({
        success: false,
        error: 'Testimony must be between 10 and 2500 characters.'
      });
    }

    if (sanitizedPromise && sanitizedPromise.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Promise scripture or text must not exceed 500 characters.'
      });
    }

    if (sanitizedMessageDetails && sanitizedMessageDetails.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Message details must not exceed 500 characters.'
      });
    }

    // 4. Prevent duplicate accidental submissions within 60 seconds
    const submissionHash = crypto
      .createHash('md5')
      .update(`${sanitizedName.toLowerCase()}-${sanitizedTestimony.toLowerCase()}`)
      .digest('hex');

    const now = Date.now();
    if (recentSubmissions.has(submissionHash)) {
      const prevTime = recentSubmissions.get(submissionHash);
      if (now - prevTime < 60000) {
        return res.status(429).json({
          success: false,
          error: 'This testimony was recently submitted. Thank you!'
        });
      }
    }
    recentSubmissions.set(submissionHash, now);

    // Clean up old submission hashes
    for (const [key, timestamp] of recentSubmissions.entries()) {
      if (now - timestamp > 120000) {
        recentSubmissions.delete(key);
      }
    }

    const newTestimonial = {
      id: crypto.randomUUID(),
      name: sanitizedName,
      testimony: sanitizedTestimony,
      promise: sanitizedPromise || null,
      message_details: sanitizedMessageDetails || null,
      created_at: new Date().toISOString(),
      delete_token_hash: normalizedTokenHash
    };

    // 5. Try inserting into Supabase
    let supabaseSuccess = false;
    if (supabase) {
      const { error } = await supabase
        .from('testimonials')
        .insert([newTestimonial]);

      if (!error) {
        supabaseSuccess = true;
      } else {
        console.warn('⚠️ Supabase insert note:', error.message, '(Falling back to local persistence)');
      }
    }

    // If Supabase table is not yet migrated, persist in storage fallback
    if (!supabaseSuccess) {
      saveLocalTestimonial(newTestimonial);
    }

    return res.status(201).json({
      success: true,
      id: newTestimonial.id,
      message: 'Testimony submitted successfully'
    });
  } catch (err) {
    console.error('Error submitting testimony:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while saving your testimony. Please try again.'
    });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    // First attempt to read from Supabase
    if (supabase) {
      // Explicitly select only public columns - NEVER expose delete_token_hash
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, testimony, promise, message_details, created_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Trigger background sync if there are any lingering fallback items
        syncFallbackToSupabase().catch(() => {});
        return res.json({
          success: true,
          data
        });
      } else {
        console.warn('⚠️ Supabase get note:', error?.message);
      }
    }

    // Fallback to local storage if Supabase is temporarily unconfigured or table pending
    const localData = getLocalTestimonials(false);
    return res.json({
      success: true,
      data: localData
    });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve testimonies at this time.'
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A valid testimony ID is required.'
      });
    }

    const trimmedId = id.trim();

    // 1. Extract ownership token (from custom header or body)
    const rawToken = req.headers['x-delete-token'] || req.body?.delete_token;
    const suppliedHash = req.body?.delete_token_hash;

    if (!rawToken && !suppliedHash) {
      return res.status(403).json({
        success: false,
        error: 'Deletion forbidden: You can only delete your own testimonial. A private deletion token is required.'
      });
    }

    // 2. Compute/validate SHA-256 hash of the deletion token
    let tokenHash = suppliedHash;
    if (rawToken && typeof rawToken === 'string') {
      tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');
    }

    if (!tokenHash || !/^[a-f0-9]{64}$/i.test(tokenHash)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid deletion token format.'
      });
    }
    tokenHash = tokenHash.toLowerCase();

    let deleted = false;
    let unauthorized = false;

    // 3. Attempt deletion in Supabase using the secure RPC or token-matching query
    if (supabase) {
      try {
        // Prefer PostgreSQL RPC delete_testimonial_with_token (SECURITY DEFINER)
        const { data: rpcData, error: rpcError } = await supabase.rpc('delete_testimonial_with_token', {
          p_id: trimmedId,
          p_token_hash: tokenHash
        });

        if (!rpcError && rpcData) {
          if (rpcData.success) {
            deleted = true;
          } else {
            unauthorized = true;
          }
        } else {
          // Fallback to direct DELETE where both id AND delete_token_hash match
          const { error: directErr, count } = await supabase
            .from('testimonials')
            .delete({ count: 'exact' })
            .eq('id', trimmedId)
            .eq('delete_token_hash', tokenHash);

          if (!directErr && count && count > 0) {
            deleted = true;
          } else if (!directErr && count === 0) {
            unauthorized = true;
          } else if (directErr) {
            console.warn('⚠️ Supabase delete error:', directErr.message);
          }
        }
      } catch (err) {
        console.warn('⚠️ Supabase delete exception:', err.message);
      }
    }

    // 4. Handle fallback local storage
    const localResult = deleteLocalTestimonial(trimmedId, tokenHash);
    if (localResult.deleted) {
      deleted = true;
    } else if (localResult.unauthorized) {
      unauthorized = true;
    }

    // 5. Return result
    if (deleted) {
      return res.json({
        success: true,
        message: 'Testimony deleted successfully.',
        id: trimmedId
      });
    }

    if (unauthorized) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: You can only delete testimonies that you submitted.'
      });
    }

    return res.status(404).json({
      success: false,
      error: 'Testimony not found or unauthorized deletion request.'
    });
  } catch (err) {
    console.error('Error deleting testimony:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while deleting the testimony.'
    });
  }
};


