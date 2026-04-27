import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {

    const type = req.query.type; // 🔥 KEY PARAM

    let table = '';
    let query = null;

    switch (type) {

      case 'mile1':
        table = 'acc_mile_1';
        query = supabase.from(table).select('*').order('date', { ascending: false });
        break;

      case 'mile2':
        table = 'acc_mile_2';
        query = supabase.from(table).select('*').order('created_at', { ascending: false });
        break;

      case 'mile3':
        table = 'acc_mile_3';
        query = supabase.from(table).select('*').order('created_at', { ascending: false });
        break;

      case 'mile4':
        table = 'acc_mile_4';
        query = supabase.from(table).select('*').order('created_at', { ascending: false });
        break;

      case 'final':
        table = 'final_account_details';
        query = supabase.from(table).select('*').order('created_at', { ascending: false });
        break;

      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
