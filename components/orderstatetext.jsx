import React from 'react';
import { Text } from 'react-native';
import styles from '../styles.js';

const OrderStateText = ({ orderState }) => {
  const getResponseStyle = (state) => {
    switch (state) {
      case 'Entregado':
        return styles.delivered;
      case 'En busca de recolector':
        return styles.pending;
      case 'Cancelado':
        return styles.cancelled;
      default:
        return null;
    }
  };

  return (
    <Text style={[styles.response, getResponseStyle(orderState)]}>
      {orderState}
    </Text>
  );
};

export default OrderStateText;
