export default async function handler(req, res) {
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

    // Build flattened response
    const response = {
      success: true,
      catalog_id: orderJson.catalog_id,
      total_items: orderJson.product_items.length
    };

    orderJson.product_items.forEach((item, index) => {
      const prefix = `Product_${index + 1}`;

      response[`${prefix}.retail_id`] = item.product_retailer_id;
      response[`${prefix}.quantity`] = item.quantity;
      response[`${prefix}.price`] = item.item_price;
      response[`${prefix}.currency`] = item.currency;
    });

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
