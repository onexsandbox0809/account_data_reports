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

    // Collect all non-empty product IDs
    const productIds = [];

    for (let i = 1; i <= 9; i++) {
      const id = req.body[`product_id_${i}`];

      if (id && id.trim() !== "") {
        productIds.push(id.trim());
      }
    }

    if (productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product_id is required."
      });
    }

    // Fetch products from Supabase
    const { data, error } = await supabase
      .from("product_lookup")
      .select("product_id, product_name, image_base64")
      .in("product_id", productIds);

    if (error) {
      throw error;
    }

    // Build lookup for preserving request order
    const lookup = {};
    data.forEach(product => {
      lookup[product.product_id] = product;
    });

    const response = {
      success: true,
      total_products: productIds.length
    };

    // Return products in the same order as received
    for (let i = 1; i <= 9; i++) {

      const requestedId = req.body[`product_id_${i}`];

      if (!requestedId || requestedId.trim() === "") {
        continue;
      }

      const product = lookup[requestedId];

      if (!product) {
        continue;
      }

      response[`Product_${i}_retail_id`] = product.product_id;
      response[`Product_${i}_product_name`] = product.product_name;
      response[`Product_${i}_image_base64`] = product.image_base64;
    }

    return res.status(200).json(response);

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}
