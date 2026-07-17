export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST method is allowed."
    });
  }

  try {
    const { orderJson } = req.body;

    if (!orderJson) {
      return res.status(400).json({
        success: false,
        message: "Missing orderJson in request body."
      });
    }

    // Create products object
    const products = {};

    orderJson.product_items.forEach((item, index) => {
      products[`product_${index + 1}`] = {
        retail_id: item.product_retailer_id,
        quantity: item.quantity,
        price: item.item_price,
        currency: item.currency
      };
    });

    // Final response
    return res.status(200).json({
      success: true,
      catalog_id: orderJson.catalog_id,
      total_items: orderJson.product_items.length,
      products
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
