import React from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import responsive from '../utils/responsive';

const FullScreenModal = ({isVisible, onClose}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.container}>
          <View style={styles.overlay} />

          <View style={styles.content}>
            <Image
              source={require('../assets/ride/loader.gif')}
              style={styles.gif}
            />
            <Text style={styles.loadingText}>
              Your <Text style={{color: '#B82929'}}>Quick Ride</Text> is
              loading...
            </Text>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  gif: {
    width: responsive.width(300),
    height: responsive.height(200),
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: responsive.fontSize(16),
    fontFamily: 'Outfit-SemiBold',
    color: '#000000',
    marginBottom: responsive.margin(60),

    textAlign: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: responsive.margin(20),
    width: '90%',
    height: responsive.height(50),
    backgroundColor: '#B82929',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelText: {
    fontSize: responsive.fontSize(20),
    fontFamily: 'Outfit-SemiBold',
    color: '#fff',
  },
});

export default FullScreenModal;
