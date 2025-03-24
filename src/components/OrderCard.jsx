import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const OrderCard = ({
  orderId,
  bookingDate,
  vehicle,
  status,
  selected,
  onPress,
}) => {
  return (
    <View
      style={[
        styles.card,
        {backgroundColor: selected ? '#B8292933' : '#F9F9F9'},
      ]}
      onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.orderTitle}>Order ID</Text>
          <Text style={styles.orderValue}>{orderId}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.orderTitle}>Booking Date</Text>
          <Text style={styles.orderValue}>{bookingDate}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.orderTitle}>Vehicle</Text>
          <Text style={styles.orderValue}>{vehicle}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.orderTitle}>Status</Text>
          <Text style={styles.orderValue}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 10,
    paddingVertical: 14,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: 117,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  orderValue: {
    fontSize: 14,
    color: '#555',
  },
});

export default OrderCard;
