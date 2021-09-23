import React, { useState, useMemo, useCallback } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Container,
  StackDivider,
  HStack,
  Button,
  Input,
  Select,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";

// COLOR MODE SWITCHER
import { ColorModeSwitcher } from "./ColorModeSwitcher";

// DATA
import { productArr, products, priceRules, priceRulesArr } from "./data";

// MODEL
import { OrderDetail } from "./model";

export const App = () => {
  const [priceRule, setPriceRule] = useState<string>();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  // Generate list products
  const listProducts = useMemo<number[]>(() => {
    const ordersProducts = orderDetails.map((v) => v.productId);

    const remainingProduct = productArr.filter(
      (x) => !ordersProducts.includes(x)
    );

    return remainingProduct;
  }, [orderDetails]);

  // Filter out price rule based on what product has been orderred
  const filterPriceRuleByOrdered = useMemo<number[]>(() => {
    const result: number[] = [];
    const orderedProductId = orderDetails.map((v) => `${v.productId}`);

    if (orderedProductId.length === 0) return [];

    priceRulesArr.forEach((v) => {
      const priceRuleProducts = Object.keys(priceRules[v].rules);

      if (priceRuleProducts.every((e) => orderedProductId.includes(e))) {
        result.push(v);
      }
    });

    return result;
  }, [orderDetails]);

  // Add item from arr order details
  const addProduct = () => {
    setOrderDetails(
      orderDetails.concat({ productId: listProducts[0], quantity: 0 })
    );
  };

  // Edit item from arr order details
  const editOrderDetail = (
    index: number,
    field: "productId" | "quantity",
    value: number
  ) => {
    const cloneOrderDetails = orderDetails.map((v) => {
      return {
        ...v,
      };
    });

    const orderDetail = cloneOrderDetails[index];
    orderDetail[field] = value;
    setOrderDetails(cloneOrderDetails);
  };

  // Delete item from arr order details
  const handleDelete = (index: number) => {
    const newArrOrders = orderDetails.filter((v, i) => i !== index);
    setOrderDetails(newArrOrders);

    if (newArrOrders.length === 0) {
      setPriceRule("");
    }
  };

  // calculate amount for particular product
  const calculateFinalAmount = useCallback(
    (orderDetail: OrderDetail, withPriceRule: boolean) => {
      const productDetail = products[orderDetail.productId];
      const originalPrice = productDetail.price * orderDetail.quantity;

      if (!priceRule || !withPriceRule) return originalPrice;

      const priceRuleDetail = priceRules[Number(priceRule)];

      const ruleForProduct = priceRuleDetail.rules[orderDetail.productId];

      if (!ruleForProduct || ruleForProduct.type === "give_away")
        return originalPrice;

      if (orderDetail.quantity === 0) return originalPrice;

      return (
        originalPrice - (originalPrice * ruleForProduct.discountPercent) / 100
      );
    },
    [priceRule]
  );

  // calculate quantity for particular product
  const calculateFinalQuantity = useCallback(
    (orderDetail: OrderDetail, withPriceRule: boolean) => {
      const originalQuantity = orderDetail.quantity;
      if (!priceRule || !withPriceRule) return originalQuantity;

      const priceRuleDetail = priceRules[Number(priceRule)];

      const ruleForProduct = priceRuleDetail.rules[orderDetail.productId];

      if (!ruleForProduct || ruleForProduct.type === "discount")
        return originalQuantity;

      if (originalQuantity < ruleForProduct.minQuantity)
        return originalQuantity;

      return originalQuantity + ruleForProduct.receivedQuantity;
    },
    [priceRule]
  );

  // Calculate quantity
  const totalQuantity = useCallback(
    (withPriceRule: boolean) => {
      let result = 0;
      if (orderDetails.length === 0) return result;

      orderDetails.forEach((v) => {
        result += calculateFinalQuantity(v, withPriceRule);
      });

      return result;
    },
    [orderDetails, calculateFinalQuantity]
  );

  // Calculate amount
  const totalAmount = useCallback(
    (withPriceRule: boolean) => {
      let result = 0;
      if (orderDetails.length === 0) return result;

      orderDetails.forEach((v) => {
        result += calculateFinalAmount(v, withPriceRule);
      });

      return result;
    },
    [orderDetails, calculateFinalAmount]
  );

  return (
    <ChakraProvider>
      <ColorModeSwitcher position="fixed" />
      <Container maxW="container.lg" paddingTop={100}>
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
        >
          <Box h="40px">
            <HStack h="100%" spacing="24px">
              <Box flex={2}>
                <Text fontSize="md" fontWeight="bold">
                  Product
                </Text>
              </Box>
              <Box flex={1}>
                <Text fontSize="md" fontWeight="bold">
                  Quantity
                </Text>
              </Box>
              <Box flex={1}>
                <Text fontSize="md" fontWeight="bold">
                  Amount
                </Text>
              </Box>
              <Box w="100px" />
            </HStack>
          </Box>

          {orderDetails.map((orderDetail, idx) => (
            <Box key={idx} h="40px">
              <HStack h="100%" spacing="24px">
                <Box flex={2}>
                  <Select
                    value={`${orderDetail.productId}`}
                    onChange={(v) => {
                      editOrderDetail(idx, "productId", Number(v.target.value));
                    }}
                  >
                    {listProducts.concat(orderDetail.productId).map(
                      (v) =>
                        products[v] && (
                          <option key={v} value={`${v}`}>
                            {products[v].name} - ${products[v].price} per pizza
                          </option>
                        )
                    )}
                  </Select>
                </Box>
                <Box flex={1}>
                  <Input
                    type="number"
                    placeholder="Input Quantity"
                    value={orderDetail.quantity}
                    onChange={(v) =>
                      editOrderDetail(idx, "quantity", Number(v.target.value))
                    }
                  />
                </Box>
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    {products[orderDetail.productId]
                      ? orderDetail.quantity *
                        products[orderDetail.productId].price
                      : ""}
                  </Text>
                </Box>
                <Box w="100px">
                  <Button
                    leftIcon={<CloseIcon fontSize="sm" />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </Button>
                </Box>
              </HStack>
            </Box>
          ))}

          {listProducts.length > 0 && (
            <Box h="40px">
              <Button
                leftIcon={<AddIcon fontSize="sm" />}
                colorScheme="teal"
                variant="outline"
                onClick={addProduct}
              >
                Add Product
              </Button>
            </Box>
          )}

          {filterPriceRuleByOrdered.length > 0 && (
            <Box h="40px">
              <HStack h="100%" spacing="24px">
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    Applicable Price Rule
                  </Text>
                </Box>
                <Box flex={1}>
                  <Select
                    placeholder="Select Price Rule"
                    value={priceRule}
                    onChange={(v) => setPriceRule(v.target.value)}
                  >
                    {filterPriceRuleByOrdered.map((v) => (
                      <option key={v} value={`${v}`}>
                        {priceRules[v] && priceRules[v].name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </HStack>
            </Box>
          )}

          {orderDetails.length > 0 && (
            <Box h="40px">
              <HStack h="100%" spacing="24px">
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    Product
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    Quantity
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    Amount
                  </Text>
                </Box>
              </HStack>
            </Box>
          )}

          {orderDetails.length > 0 && (
            <Box h="40px">
              <HStack h="100%" spacing="24px">
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    Total ( Before Appiled Price Rule)
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    {totalQuantity(false)}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    {totalAmount(false)}
                  </Text>
                </Box>
              </HStack>
            </Box>
          )}

          {orderDetails.length > 0 && priceRule && (
            <Box h="40px">
              <HStack h="100%" spacing="24px">
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    Total ( After Appiled Price Rule)
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    {totalQuantity(true)}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="md" fontWeight="bold">
                    {totalAmount(true)}
                  </Text>
                </Box>
              </HStack>
            </Box>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
};
