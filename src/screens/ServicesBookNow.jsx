import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon} from 'react-native-elements';
import responsive from '../utils/responsive';
import CustomInput from '../components/CustomInput';
import ServiceBox from '../components/ServiceBox';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getQuote} from '../api';
import Toast from 'react-native-toast-message';

const ServicesBookNow = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [carImage, setCarImage] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('auth');
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setUid(parsedValue.uid);
          console.log('uid', parsedValue.uid);
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    getData();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    const userDocRef = firestore().collection('users').doc(uid);

    const unsubscribe = userDocRef.onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        console.log('userData', userData);
        setCart(userData?.services || []);
      } else {
        console.log('User document does not exist.');
      }
    });

    return () => unsubscribe();
  }, [uid]);

  const selectServices = [
    {id: 1, title: 'MRF tyre'},
    {id: 2, title: 'Okaya Battery'},
    {id: 3, title: 'Exide Battery'},
    {id: 4, title: 'Car Cleaning'},
  ];

  // Function to handle image selection
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

  const orderNow = async () => {
    console.log('Order Process Started');

    try {
      if (!uid || !vehicleNumber) {
        console.error('UID and Vehicle Number are required');
        return;
      }

      if (carImage && !carImage.file) {
        console.error('Provided image is missing a valid Base64 string');
        return;
      }

      const requestData = {
        uid,
        vehicleNumber,
        address,
        message,
        image: carImage ? JSON.stringify(carImage) : undefined,
      };

      console.log('Final Request Data:', requestData);

      console.log('Calling API...');
      const response = await getQuote(requestData);
      console.log('Order placed successfully', response);
      Toast.show({
        type: 'success',
        text1: 'Order Placed Successfully',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
      navigation.navigate('OrderStatus');
    } catch (error) {
      console.error('API Call Failed:', error);
    } finally {
      setAddress('');
      setCarImage('');
      setMessage('');
      setVehicleNumber('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.flexContainer}>
          <Icon
            onPress={() => navigation.goBack()}
            size={responsive.fontSize(25)}
            color={'#000'}
            name="keyboard-backspace"
          />
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.bookNow}>Book Now</Text>
      </View>

      {/* Image Picker */}

      <View style={styles.uploadContainer}>
        {carImage ? (
          <View style={{alignItems: 'center'}}>
            <Ionicons
              style={styles.icon}
              color="#B82929"
              name="checkmark-circle"
              size={60}
            />
            <Text style={{fontFamily: 'Outfit-Regular', color: '#000'}}>
              Image Selected
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.centerAlign}
            onPress={() => pickImage(setCarImage)}>
            <Image
              source={require('../assets/uploadImage.png')}
              style={styles.icon2}
            />
            <Text style={{fontFamily: 'Outfit-Regular', color: '#000'}}>
              Upload the car image (optional)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Details Box */}
      <View style={styles.detailsContainer}>
        <CustomInput
          label="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          type="text"
          placeholder="EX: 58963"
        />
        <CustomInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          type="text"
          placeholder="EX: 46650 Bennie Forks, Lake Alexandreborough 58963"
        />
        <CustomInput
          label="Mention Anything"
          value={message}
          onChangeText={setMessage}
          type="textarea"
          placeholder="EX: Lorem ipsum dolor sit amet consectetur."
        />
      </View>

      {/* Bottom View */}
      <View style={styles.bottomContainer}>
        <View style={styles.serviceHeader}>
          <Text style={styles.selectedService}>Selected Service</Text>
        </View>
      </View>

      {/* Services List */}
      <FlatList
        ListEmptyComponent={
          <View>
            <Text style={[styles.bookNow, {textAlign: 'center'}]}>
              Cart is Empty!!
            </Text>
          </View>
        }
        contentContainerStyle={styles.flatListContainer}
        columnWrapperStyle={styles.flatListColumn}
        numColumns={2}
        data={cart}
        renderItem={({item}) => <ServiceBox text={item.name} />}
        keyExtractor={item => item.id.toString()}
      />

      {/* Book Now Button */}
      <TouchableOpacity
        style={[
          styles.bookNowButton,
          {backgroundColor: cart.length === 0 && '#ccc'},
        ]}
        onPress={orderNow}
        disabled={cart.length === 0 ? true : false}>
        <Text
          style={[styles.bookNowText, {color: cart.length === 0 && '#777'}]}>
          Book Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ServicesBookNow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsive.padding(8),
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookNow: {
    fontSize: responsive.fontSize(20),
    fontFamily: 'Outfit-Bold',
    color: '#B82929',
    paddingHorizontal: responsive.padding(14),
  },
  headerContainer: {
    borderBottomWidth: responsive.width(0.5),
    paddingVertical: responsive.padding(10),
    gap: 10,
  },
  logo: {
    width: responsive.width(100),
    height: responsive.height(30),
  },
  centerAlign: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  uploadContainer: {
    alignItems: 'center',
    marginTop: responsive.margin(14),
    gap: 5,
  },
  uploadText: {
    color: '#281B1B',
    fontFamily: 'Outfit-Regular',
    fontSize: responsive.fontSize(13),
  },
  selectedImage: {
    width: responsive.width(100),
    height: responsive.height(100),
    borderRadius: responsive.borderRadius(4),
  },
  detailsContainer: {
    alignItems: 'center',
    paddingVertical: responsive.padding(35),
    paddingBottom: responsive.padding(40),
    borderBottomWidth: responsive.width(0.5),
  },
  bottomContainer: {
    paddingHorizontal: responsive.padding(10),
    paddingVertical: responsive.padding(15),
    gap: 14,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedService: {
    fontSize: responsive.fontSize(17),
    color: '#B82929',
    fontFamily: 'Outfit-Regular',
  },
  editText: {
    color: '#B82929',
    fontSize: responsive.fontSize(13),
    fontFamily: 'Outfit-Light',
  },
  flatListContainer: {
    gap: 10,
    paddingHorizontal: responsive.padding(10),
  },
  flatListColumn: {
    justifyContent: 'space-between',
  },
  bookNowButton: {
    marginVertical: responsive.margin(10),
    width: responsive.width(118),
    height: responsive.height(27),
    backgroundColor: '#B82929',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsive.borderRadius(4),
    alignSelf: 'flex-end',
  },
  bookNowText: {
    color: '#FAFAFA',
    fontFamily: 'Outfit-Regular',
    fontSize: responsive.fontSize(12),
  },
});
