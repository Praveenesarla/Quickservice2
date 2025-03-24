import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import responsive from '../utils/responsive';

const orderSteps = ['Enquiry Placed', 'Processing', 'Shipped', 'Completed'];

const VerticalStepsIndicator = ({currentStatus}) => {
  const currentStepIndex = orderSteps.indexOf(currentStatus);

  return (
    <View style={styles.container}>
      {orderSteps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          {/* Circle with Tick or Step Number */}
          <View
            style={[
              styles.circle,
              {
                backgroundColor:
                  index <= currentStepIndex ? '#B82929' : '#B82929',
              },
            ]}>
            {index <= currentStepIndex ? (
              <Icon
                name="check"
                type="material"
                color="#fff"
                size={responsive.fontSize(14)}
              />
            ) : (
              <Text style={styles.stepNumber}>{index + 1}</Text>
            )}
          </View>

          {/* Step Label */}
          <Text
            style={[
              styles.stepText,
              {
                color: index <= currentStepIndex ? '#B82929' : '#888',
                fontWeight: index === currentStepIndex ? 'bold' : 'normal',
              },
            ]}>
            {step}
          </Text>

          {/* Vertical Connector Line */}
          {index < orderSteps.length - 1 && (
            <View
              style={[
                styles.line,
                {
                  backgroundColor:
                    index < currentStepIndex ? '#B82929' : '#ccc',
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default VerticalStepsIndicator;

const styles = StyleSheet.create({
  container: {
    paddingVertical: responsive.padding(10),
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.height(20),
    position: 'relative',
  },
  circle: {
    width: responsive.width(24),
    height: responsive.width(24),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#fff',
    fontSize: responsive.fontSize(12),
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: responsive.fontSize(14),
    marginLeft: responsive.width(12),
  },
  line: {
    position: 'absolute',
    width: 2,
    height: responsive.height(40),
    left: responsive.width(12),
    top: responsive.height(24),
  },
});
