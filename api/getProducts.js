import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Only POST method is allowed.'
    });
  }

  try {

    const { product_ids } = req.body;

    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'product_ids must be a non-empty array.'
      });
    }

    const { data, error } = await supabase
      .from('product_lookup')
      .select('product_id, product_name, image_url')
      .in('product_id', product_ids);

    if (error) {
      throw error;
    }

    const response = {
      success: true
    };

    data.forEach((product, index) => {

      const i = index + 1;

      response[`Product_${i}_retail_id`] = product.product_id;
      response[`Product_${i}_product_name`] = product.product_name;
      response[`Product_${i}_image_url`] = product.image_url;

    });

    return res.status(200).json(response);

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}
