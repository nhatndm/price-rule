export interface Hash<M> {
  [key: number]: M;
}

// PRICE RULE
// Key of rule is product ID
export interface PriceRule {
  id: number;
  name: string;
  rules: Hash<PriceRuleDetailGiveAway | PriceRuleDetailDiscount>;
}

export interface PriceRuleDetail {
  type: "give_away" | "discount";
  productId: number;
}

// min quantity is a condition for this rule
export interface PriceRuleDetailGiveAway extends PriceRuleDetail {
  type: "give_away";
  minQuantity: number;
  receivedProductId: number;
  receivedQuantity: number;
}

export interface PriceRuleDetailDiscount extends PriceRuleDetail {
  type: "discount";
  discountPercent: number;
}

// PRODUCT
export interface Product {
  id: number;
  name: string;
  price: number;
}

// ORDER
export interface Order {
  customer: string;
  priceRuleId?: number;
  orderDetails: Hash<OrderDetail>;
  amount: number;
}

export interface OrderDetail {
  productId: number;
  quantity: number;
}
