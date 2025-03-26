import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import responsive from '../utils/responsive';
import {Icon} from 'react-native-elements';
import OrderCard from '../components/OrderCard';
import VerticalStepsIndicator from '../components/VerticalStepIndicator';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {getAllOrders, uploadCarImage} from '../api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';

const OrderStatus = () => {
  const navigation = useNavigation();
  const [carImage, setCarImage] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [uid, setUid] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    getOrders();
  }, []);

  console.log('sele', selectedOrder?.orderId);

  const pickImage = async (setImage, imageName) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        const selectedImage = result.assets[0];

        if (!selectedImage.uri || !selectedImage.type) {
          console.error('Invalid Image Format:', selectedImage);
          return;
        }

        const base64String = await RNFS.readFile(selectedImage.uri, 'base64');

        const imageData = {
          name: imageName || selectedImage.fileName || 'image.jpg',
          file: base64String,
          type: selectedImage.type,
        };

        setImage(imageData);
        console.log('Image Set:', imageData);
      } else {
        console.warn('No Image Selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const getOrders = async () => {
    try {
      const auth = await getData('auth');
      console.log('auth uid', auth.uid);
      const response = await getAllOrders(auth.uid);
      setUid(auth.uid);
      console.log('ordersList', response);

      setOrdersList(response);

      if (response.length > 0) {
        setSelectedOrder(response[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async key => {
    try {
      const value = await AsyncStorage.getItem('auth');
      return JSON.parse(value);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const uploadingCarImage = async () => {
    console.log('Car Image Upload Started');

    try {
      if (!selectedOrder?.orderId || !carImage) {
        console.error('Order ID and Image are required');
        return;
      }

      if (!carImage.file) {
        console.error('Provided image is missing a valid Base64 string');
        return;
      }

      const requestData = {
        orderId: selectedOrder.orderId,
        carImage: JSON.stringify(carImage),
      };

      console.log('Final Request Data:', requestData);

      console.log('Calling API...');
      const response = await uploadCarImage(requestData);
      console.log('Car Image Uploaded Successfully', response);

      Toast.show({
        type: 'success',
        text1: 'Car Image Uploaded Successfully',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
    } catch (error) {
      console.error('API Call Failed:', error.response?.data || error.message);
    } finally {
      setCarImage(null); // Reset car image after upload
    }
  };

  return (
    <>
      {ordersList.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.flexContainer}>
            <Icon
              onPress={() => navigation.goBack()}
              size={responsive.fontSize(25)}
              color={'#000'}
              name="keyboard-backspace"
            />
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.orderStatusText}>Order Status</Text>

            {selectedOrder && (
              <>
                <View style={styles.orderDetailsContainer}>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.orderTitle}>Order ID</Text>
                      <Text style={styles.orderValue}>
                        {selectedOrder.orderId}
                      </Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.orderTitle}>Payment Amount</Text>
                      <Text style={styles.orderValue}>N/A</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.orderDetailsContainer}>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.orderTitle}>Vehicle</Text>
                      <Text style={styles.orderValue}>
                        {selectedOrder?.vehicleNumber}
                      </Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.orderTitle}>Service</Text>
                      <Text style={styles.orderValue}>N/A</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View style={styles.rowBetween}>
              {selectedOrder && (
                <VerticalStepsIndicator currentStatus={selectedOrder.status} />
              )}

              {carImage ? (
                <View style={styles.imageUploadContainer}>
                  <Ionicons
                    style={styles.icon}
                    color="#B82929"
                    name="checkmark-circle"
                    size={60}
                  />
                  <TouchableOpacity
                    onPress={uploadingCarImage}
                    style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => pickImage(setCarImage)}
                  style={styles.imagePickerContainer}>
                  <Image
                    source={require('../assets/uploadImage.png')}
                    style={styles.icon2}
                  />
                  <Text>Upload Image (optionally)</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Your Orders Section */}
            <View>
              <Text style={styles.yourOrdersText}>Your Orders</Text>
              <FlatList
                contentContainerStyle={styles.ordersListContainer}
                data={ordersList}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => setSelectedOrder(item)}>
                    <OrderCard
                      orderId={item.orderId}
                      bookingDate={item.bookingDate}
                      vehicle={item.vehicleNumber}
                      status={item.status}
                      selected={selectedOrder?.orderId === item?.orderId}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.flexContainer}>
            <Icon
              onPress={() => navigation.goBack()}
              size={responsive.fontSize(25)}
              color={'#000'}
              name="keyboard-backspace"
            />
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>
          <View style={{justifyContent: 'center', flex: 1}}>
            <Text
              style={{
                color: '#B82929',
                fontFamily: 'Outfit-Black',
                fontSize: responsive.fontSize(18),
                textAlign: 'center',
                marginBottom: responsive.margin(30),
              }}>
              No Orders Have Been Placed
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate()}></TouchableOpacity>
            <Text
              style={{
                color: '#B82929',
                fontFamily: 'Outfit-Black',
                fontSize: responsive.fontSize(16),
                textAlign: 'center',
                marginBottom: responsive.margin(30),
              }}>
              Go to Services
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsive.padding(8),
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsive.padding(15),
  },
  logo: {
    width: responsive.width(100),
    height: responsive.height(30),
  },
  contentContainer: {
    paddingHorizontal: responsive.padding(10),
  },
  orderStatusText: {
    color: '#B82929',
    fontFamily: 'Outfit-Bold',
    fontSize: responsive.fontSize(20),
  },
  ordersListContainer: {
    marginBottom: responsive.margin(200),
    gap: 5,
  },
  orderDetailsContainer: {
    gap: responsive.padding(10),
    paddingVertical: responsive.padding(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: responsive.width(117),
  },
  orderTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: responsive.fontSize(14),
    color: '#161616',
  },
  orderValue: {
    color: '#161616',
    fontFamily: 'Outfit-Light',
    fontSize: responsive.fontSize(10),
  },
  yourOrdersText: {
    color: '#B82929',
    fontSize: responsive.fontSize(20),
    fontFamily: 'Outfit-Bold',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginHorizontal: responsive.margin(35),
    marginTop: responsive.margin(30),
    gap: responsive.margin(5),
  },
  uploadButton: {
    backgroundColor: '#B82929',
    width: responsive.width(80),
    height: responsive.height(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsive.borderRadius(8),
  },
  uploadButtonText: {
    fontFamily: 'Outfit-Bold',
    fontSize: responsive.fontSize(11),
    color: '#fff',
  },
  imagePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive.margin(30),
    gap: responsive.margin(5),
  },
  icon2: {},
});
