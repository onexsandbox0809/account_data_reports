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

    // Build response
    const response = {
      success: true,
      catalog_id: orderJson.catalog_id,
      total_items: orderJson.product_items.length
    };

    let cartTotal = 0;
    let currency = "";

    orderJson.product_items.forEach((item, index) => {
      const prefix = `Product_${index + 1}`;

      // Product details
      response[`${prefix}_retail_id`] = item.product_retailer_id;
      response[`${prefix}_quantity`] = item.quantity;
      response[`${prefix}_price`] = item.item_price;
      response[`${prefix}_currency`] = item.currency;

      // Calculate line total
      const lineTotal = Number(item.quantity) * Number(item.item_price);

      // Store line total (optional)
      response[`${prefix}_total`] = lineTotal;

      // Add to cart total
      cartTotal += lineTotal;

      // Capture currency
      if (!currency) {
        currency = item.currency;
      }
    });

    // Overall totals
    response.cart_total = cartTotal;
    response.currency = currency;

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
