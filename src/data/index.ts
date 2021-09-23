// MODEL
import { PriceRule, Product, Hash } from "../model";

const products: Hash<Product> = {
  1: {
    id: 1,
    name: "Small Pizza",
    price: 12,
  },
  2: {
    id: 2,
    name: "Medium Pizza",
    price: 16,
  },
  3: {
    id: 3,
    name: "Large Pizza",
    price: 22,
  },
};

const productArr = [1, 2, 3];

const priceRules: Hash<PriceRule> = {
  1: {
    id: 1,
    name: "Give away 1 small pizza",
    rules: {
      // Key of Rule is product ID
      1: {
        type: "give_away",
        productId: 1, // Cos Product Id of large pizza is 1
        minQuantity: 2,
        receivedProductId: 1,
        receivedQuantity: 1,
      },
    },
  },
  2: {
    id: 2,
    name: "Give away 1 small Pizza And discount 10% for Large Pizza",
    rules: {
      // Key of Rule is product ID
      1: {
        type: "give_away",
        productId: 1, // Cos Product Id of large pizza is 1
        minQuantity: 2,
        receivedProductId: 1,
        receivedQuantity: 1,
      },
      // Key of Rule is product ID
      3: {
        type: "discount",
        productId: 3, // Cos Product Id of large pizza is 3
        discountPercent: 10,
      },
    },
  },
  3: {
    id: 3,
    name: "Discout 10% for large pizza",
    rules: {
      // Key of Rule is product ID
      3: {
        type: "discount",
        productId: 3, // Cos Product Id of large pizza is 3
        discountPercent: 10,
      },
    },
  },
};

const priceRulesArr = [1, 2, 3];

export { priceRules, products, productArr, priceRulesArr };
