import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Button,
} from 'react-native';
import {CFPaymentGatewayService} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
import auth from '@react-native-firebase/auth';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {usePlacesAutocomplete} from 'react-native-google-places-sdk';

import responsive from '../utils/responsive';
import SearchLocation from '../assets/ride/SearchLocation';
import FloatingMenu from '../assets/ride/FloatingMenu';
import LocationDot from '../assets/ride/LocationDot';
import MotorBike from '../assets/ride/MotorBike';
import Capacity from '../assets/ride/Capacity';
import Message from '../assets/ride/Message';
import Call from '../assets/ride/Call';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import QuickMotoCard from '../components/MapViewBody/QuickMoto';
import QuickMoto from '../components/MapViewBody/QuickMoto';
import firestore from '@react-native-firebase/firestore';
import FullScreenModal from '../components/RideLoader';
import RiderRating from '../assets/ride/RiderRating';
import RideDetailsCard from '../components/MapViewBody/RideDetailsCard';
import GoogleLocationSearch from '../components/MapViewBody/GoogleLocationSearch';
import RiderDetails from '../components/MapViewHeader/RiderDetails';
import AddressView from '../components/MapViewHeader/AddressView';
import OTPDisplay from '../components/MapViewHeader/OTPDisplay';
import BackButton from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {
  bookRide,
  cancelRide,
  createOrder,
  getVehicleRides,
  payRide,
  ridePaymentSuccess,
} from '../api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PayRideCard from '../components/MapViewBody/PayRide';
import PayNowModal from '../components/MapViewBody/PayNowModal';

const {height} = Dimensions.get('window');

const QuickRide = ({route}) => {
  const user = auth().currentUser;
  const {fromAddress, toAddress} = route.params;
  console.log('fromAddress', fromAddress);
  console.log('toAddress', toAddress);
  const navigation = useNavigation();
  const rideOptions = [
    {
      id: 1,
      vehicle: 'Quick Moto',
      time: '10:38',
      distance: '1 min away',
      price: 74,
      originalPrice: 80,
    },
    {
      id: 2,
      vehicle: 'Speed Bike',
      time: '10:45',
      distance: '2 min away',
      price: 85,
      originalPrice: 90,
    },
    {
      id: 3,
      vehicle: 'Fast Ride',
      time: '10:50',
      distance: '3 min away',
      price: 95,
      originalPrice: 100,
    },
  ];
  const [isFloatingViewVisible, setIsFloatingViewVisible] = useState(false);
  const [toLocationString, setToLocationString] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [destinationPlace, setDestination] = useState('');
  const [fromLocationString, setFromLocationString] = useState('');
  const [rideDetails, setRideDetails] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [rideId, setRideId] = useState('');
  const [status, setStatus] = useState('List');
  const [vehicles, setVehilces] = useState({});
  const [toLocation, setToLocation] = useState({});
  const [userData, setUserData] = useState(null);
  const [isRideBooked, setIsRideBooked] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideData, setRideData] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const ref = useRef();
  const [modalVisible, setModalVisible] = useState(true);
  const [header, setHeader] = useState('rider');
  const [rideOptions2, ssetRideOptions] = useState([]);
  const [distance, setDistance] = useState('');
  const [payModal, setPayModal] = useState(false);

  console.log('userDetails', userData);
  console.log('ride Data', rideData);
  console.log('fromAddress', fromAddress);
  console.log('toAddress', toAddress);
  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);

  // From Address to To Address Route

  useEffect(() => {
    if (fromAddress?.location && toAddress?.location) {
      const origin = `${fromAddress.location.latitude},${fromAddress.location.longitude}`;
      const destination = `${toAddress.location.latitude},${toAddress.location.longitude}`;

      fetchRouteCoordinates(origin, destination);
    }
  }, [fromAddress, toAddress]);

  const fetchRouteCoordinates = async (origin, destination) => {
    const API_KEY = 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0';
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        const points = response.data.routes[0].overview_polyline.points;
        const coordinates = decodePolyline(points);
        setRouteCoordinates(coordinates);
      } else {
        console.error('Error fetching route:', response.data.error_message);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const decodePolyline = (t, e = 5) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / Math.pow(10, e),
        longitude: lng / Math.pow(10, e),
      });
    }

    return points;
  };

  // From Address to To Address Route

  useEffect(() => {
    if (fromAddress?.location && toAddress?.location) {
      const origin = formatLatLong(
        fromAddress.location.latitude,
        fromAddress.location.longitude,
      );
      const destination = formatLatLong(
        toAddress.location.latitude,
        toAddress.location.longitude,
      );

      console.log('Formatted origin:', origin);
      console.log('Formatted destination:', destination);

      getDistanceFromGoogle(origin, destination);
    }
  }, [fromAddress, toAddress]);

  const updateStatus = (status, isSuccess = false) => {
    setPaymentStatus(status);
    console.log(
      `Payment ${isSuccess ? 'Successful' : 'Failed'}:`,
      JSON.stringify(status),
    );
  };

  // Added New UseEeffect

  useEffect(() => {
    const onReceivedEvent = (eventName, map) => {
      console.log(
        'Event received on screen: ' +
          eventName +
          ' map: ' +
          JSON.stringify(map),
      );
    };

    const onVerify = orderId => {
      console.log('userData4', userData);
      console.log('Payment Successful for Order ID:', orderId);
      updateStatus(`Payment Successful for Order ID: ${orderId}`, true);
      paymentSucess();
      // paymentOrderStatus(addAmount, walletData, uid, userData);
    };

    const onError = (error, orderId) => {
      console.log(
        'Payment Failed:',
        JSON.stringify(error),
        '\nOrder ID:',
        orderId,
      );
      updateStatus(`Payment Failed: ${error.message || JSON.stringify(error)}`);
    };

    CFPaymentGatewayService.setEventSubscriber({onReceivedEvent});
    CFPaymentGatewayService.setCallback({onVerify, onError});

    return () => {
      console.log('UNMOUNTED');
      CFPaymentGatewayService.removeCallback();
      CFPaymentGatewayService.removeEventSubscriber();
    };
  }, []);

  const paymentSucess = async () => {
    try {
      const response = await ridePaymentSuccess(user.uid, rideData.id);
      console.log('paymnet sucesss response', response.data);
      setStatus('Finished');
      setPayModal(false);
    } catch (error) {
      console.log('paynet success api', error);
    }
  };

  const startCreateOrder = async () => {
    try {
      const orderData = {
        amount: rideData.rate,
        uid: userData.uid,
        name: userData.displayName,
        email: userData.email || 'esarlapraveen@gmail.com',
        phone: '8186827673' || userData.phoneNumber,
      };

      console.log('createOrder', orderData);

      const response = await createOrder(orderData);

      console.log('responseOFOrder', response.data);
      setOrderData(response.data);
      _startCheckout();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const _startCheckout = async () => {
    try {
      const session = getSession();
      const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .add(CFPaymentModes.UPI)
        .add(CFPaymentModes.NB)
        .add(CFPaymentModes.WALLET)
        .add(CFPaymentModes.PAY_LATER)
        .build();

      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor('#94ee95')
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();

      const dropPayment = new CFDropCheckoutPayment(
        session,
        paymentModes,
        theme,
      );
      console.log(JSON.stringify(dropPayment));
      CFPaymentGatewayService.doPayment(dropPayment);
    } catch (e) {
      console.log(e);
    }
  };

  const getSession = () => {
    const sessionId = orderData.payment_session_id;
    const orderId = orderData.order_id;

    console.log('Session ID:', sessionId);
    console.log('Order ID:', orderId);

    return new CFSession(sessionId, orderId, CFEnvironment.SANDBOX);
  };

  useEffect(() => {
    if (!rideId) return;

    console.log('Fetching ride with rideId:', rideId);

    const rideDocRef = firestore()
      .collection('all_rides')
      .doc('Active')
      .collection('rides')
      .doc(rideId);

    const unsubscribe = rideDocRef.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        const rideDetails = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };
        setRideData(rideDetails);
        setStatus(rideDetails.status);
        console.log('Ride details:', rideDetails);
      } else {
        console.log('No ride found with this rideId');
        setRideData(null);
        setStatus(null);
      }
    });

    return () => unsubscribe();
  }, [rideId]);

  // Track ride status updates in real-time
  useEffect(() => {
    if (!rideData?.id) return;

    console.log('Setting up status listener for ride:', rideData.id);

    const rideDocRef = firestore()
      .collection('all_rides')
      .doc('Active')
      .collection('rides')
      .doc(rideData.id);

    const unsubscribe = rideDocRef.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        const updatedStatus = docSnapshot.data().status;
        setStatus(updatedStatus); // Store the updated status
        console.log(`Ride status updated: ${updatedStatus}`);

        if (updatedStatus === 'New') {
          setModalVisible(true);
        } else {
          setModalVisible(false);
        }
      }
    });

    return () => unsubscribe();
  }, [rideData?.id]);

  const handleCancelRide = () => {
    console.log('pressed');
    cancellingRide();
  };

  useEffect(() => {
    getData();
  }, []);

  const formatLatLong = (lat, lng) => {
    return `${lat},${lng}`;
  };

  const handleWallet = async () => {
    try {
      const response = await payRide(userData.uid, rideId);
      console.log('response of handle wallet', response);
      setPayModal(false);
    } catch (error) {
      console.log('Errror of handle wallet', error);
    }
  };

  const handleBackPress = () => {
    if (status === 'places') {
      navigation.goBack();
    } else if (status === 'List') {
      setStatus('places');
    } else if (status === 'rider' || 'otp') {
      setStatus('List');
    }
  };

  // useEffect(() => {
  //   if (fromLocationString && toLocationString) {
  //     console.log('FromString', fromLocationString);
  //     console.log('ToString', toLocationString);
  //     const fetchDistance = async () => {
  //       try {
  //         const finalDistance = await getDistanceFromGoogle(
  //           fromLocationString,
  //           toLocationString,
  //         );
  //         console.log('data from googleApi', finalDistance);
  //         setDistance(finalDistance);
  //       } catch (error) {
  //         console.error('Error fetching distance:', error);
  //       }
  //     };
  //     fetchDistance();
  //   }
  // }, [fromLocationString, toLocationString]);

  const firstViewInitialHeight = height * 0.3;
  const secondViewInitialHeight = height * 0.7;
  const firstViewExpandedHeight = height * 0.62;
  const secondViewCollapsedHeight = height * 0.38;
  const expandedPosition = firstViewExpandedHeight - firstViewInitialHeight;

  console.log('rideId', rideId);

  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateY.value = Math.max(
        0,
        Math.min(expandedPosition, event.translationY),
      );
    })
    .onEnd(() => {
      const expandThreshold = expandedPosition / 2;
      if (translateY.value > expandThreshold) {
        translateY.value = withSpring(expandedPosition, {
          damping: 20,
          stiffness: 100,
        });
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 100,
        });
      }
    });

  const animatedTopViewStyle = useAnimatedStyle(() => ({
    height: firstViewInitialHeight + translateY.value,
  }));

  const animatedBottomViewStyle = useAnimatedStyle(() => ({
    height: secondViewInitialHeight - translateY.value,
    top: firstViewInitialHeight + translateY.value,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }));

  const handlePayNow = () => {
    setPayModal(true);
  };

  const handleBookRide2 = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      setStatus('rider');
    }, 2000);
  };

  const handleBookRide = (vehicle, price) => {
    gettingBookRide(vehicle, price, userData);
  };

  const getVehicleRidesList = async () => {
    try {
      const response = await getVehicleRides(distance);
    } catch (error) {}
  };

  const cancellingRide = async () => {
    const data = {
      uid: user.uid,
      ride_id: rideData.id,
      rider_id: rideData.rider_id,
    };
    try {
      const response = await cancelRide(data);
      console.log('response', response);
    } catch (error) {
      console.log('Cancelling Ride', error);
    }
  };

  const getDistanceFromGoogle = async (origin, destination) => {
    console.log('Final strings passing:', origin, destination);
    const API_KEY = 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0';
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&units=metric&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        const distanceText = response.data.routes[0].legs[0].distance.text;
        let distanceValue = parseFloat(distanceText.replace(' km', ''));
        console.log(`Distance: ${distanceValue}`);

        const vehicleResponse = await getVehicleRides(distanceValue);
        console.log('Vehicle Response:', vehicleResponse);

        if (!vehicleResponse || !vehicleResponse.data) {
          throw new Error('Invalid vehicle response data');
        }

        const ridevehicle = Object.keys(vehicleResponse.data).map(
          (key, index) => ({
            id: index,
            vehicle: key,
            price: vehicleResponse.data[key].cost,
            originalPrice: vehicleResponse.data[key].strike_cost,
          }),
        );

        setVehilces(ridevehicle);
        setStatus('List');

        return distanceValue;
      } else {
        console.error('Error fetching distance:', response.data.error_message);
        throw new Error(response.data.error_message);
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const handleSelectRide = async (vehicle, price) => {
    // console.log('Selected Vehicle:', vehicle);
    // console.log('Price:', price);
    // const getAuthInfo = await getData();
    // console.log('authInfo', getAuthInfo);
    setSelectedRide(vehicle);
  };

  const getData = async key => {
    try {
      const value = await AsyncStorage.getItem('auth');
      const convert = JSON.parse(value);
      setUserData(convert);
      console.log('userData2', convert);
      return convert;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  // const onPressPlaces = async (data, details) => {
  //   console.log('Selected Place Data:', data.description);
  //   setDestination(data.description);
  //   console.log('To:', details.geometry.location);
  //   setToLocation(details.geometry.location);
  //   const stringFormLocation = formatLatLong(
  //     details.geometry.location.lat,
  //     details.geometry.location.lng,
  //   );
  //   console.log('toStringHere', stringFormLocation);
  //   setToLocationString(stringFormLocation);
  //   setStatus('List');
  // };

  const gettingBookRide = async (vehicle, price, UserData) => {
    // console.log('place', destinationPlace);
    // console.log('Fromlocation', fromAddress);
    // console.log('Tolocation', toLocation);
    console.log(userData);
    const data = {
      pick: {
        latitude: fromAddress.location.latitude,
        longitude: fromAddress.location.longitude,
        place: fromAddress.address,
      },
      drop: {
        latitude: toAddress.location.latitude,
        longitude: toAddress.location.longitude,
        place: toAddress.address,
      },
      name: user.displayName,
      phone: user.phoneNumber,
      rate: price,
      uid: user.uid,
      vehicleType: vehicle,
    };
    try {
      const response = await bookRide(data);
      const rideIdFromRes = response.rideId;
      setRideId(response.rideId);
    } catch (error) {
      console.log('RideBooking', error);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <FullScreenModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
        {/* First View (Map) */}
        <Animated.View style={[styles.topView, animatedTopViewStyle]}>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: fromAddress.location.latitude,
                longitude: fromAddress.location.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {/* Add Polyline to display the route */}
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeWidth={4}
                  strokeColor="blue"
                />
              )}

              {/* Add Marker for the starting point */}
              <Marker
                coordinate={{
                  latitude: fromAddress.location.latitude,
                  longitude: fromAddress.location.longitude,
                }}
                title="Start"
                description={fromAddress.address}
              />

              {/* Add Marker for the destination point */}
              <Marker
                coordinate={{
                  latitude: toAddress.location.latitude,
                  longitude: toAddress.location.longitude,
                }}
                title="Destination"
                description={toAddress.address}
              />
            </MapView>

            <TouchableOpacity style={styles.floatingButton2}>
              <BackButton
                onPress={handleBackPress}
                name="arrow-back-circle-outline"
                size={40}
                color="#000000"
              />
              <View style={{width: '95%'}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: responsive.fontSize(10),
                    fontFamily: 'Outfit-Regular',
                    color: '#000000',
                    width: '91%',
                  }}>
                  {fromAddress.address}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Floating View */}
          </View>
        </Animated.View>
        {/* Second View */}
        <Animated.View style={[styles.bottomView, animatedBottomViewStyle]}>
          {/* Draggable Top Bar */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.fixedTopView}>
              <View style={styles.dragIndicator} />
            </View>
          </GestureDetector>

          {/* Search Content */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {status === 'List' ? (
              <AddressView address={fromAddress.address} />
            ) : status === 'Accepted' ? (
              <OTPDisplay otp={rideData.otp} />
            ) : status === 'New' ? (
              <OTPDisplay />
            ) : null}

            {status === 'List' ? (
              <FlatList
                // ListHeaderComponent={
                //   <AddressView address={fromAddress.address} />
                // }
                contentContainerStyle={{
                  gap: 10,
                  paddingVertical: responsive.padding(10),
                }}
                data={vehicles}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <QuickMoto
                    vehicle={item.vehicle}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    isSelected={selectedRide === item.vehicle}
                    onPress={handleSelectRide}
                    onBookRide={handleBookRide}
                  />
                )}
              />
            ) : status === 'Accepted' ? (
              <RideDetailsCard
                driverName={rideData.rider_name}
                driverRole="Driver"
                fare={rideData.rate}
                vehicleNumber={rideData.rider_vehicleNumber}
                vehicleName={rideData.rider_vehicleName}
                isRideBooked={true}
                onPressBookRide={handleCancelRide}
              />
            ) : status === 'Started' ? (
              <PayRideCard
                driverName={rideData.rider_name}
                vehicleNumber={rideData.rider_vehicleNumber}
                vehicleName={rideData.rider_vehicleName}
                estimatedTime="10 min"
                onPressPayNow={handlePayNow}
              />
            ) : (
              <FlatList
                contentContainerStyle={{
                  gap: 10,
                  paddingVertical: responsive.padding(10),
                }}
                data={vehicles}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <QuickMoto
                    vehicle={item.vehicle}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    isSelected={selectedRide === item.vehicle}
                    onPress={handleSelectRide}
                    onBookRide={handleBookRide}
                  />
                )}
              />
            )}

            <PayNowModal
              visible={payModal}
              onClose={() => setPayModal(false)}
              onPayOnline={startCreateOrder}
              onPayWithWallet={handleWallet}
            />
          </ScrollView>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topView: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  bottomView: {
    width: '100%',
    // backgroundColor: '#fff',
    position: 'absolute',
    overflow: 'hidden',
  },
  fixedTopView: {
    width: '100%',
    height: responsive.height(20),
    backgroundColor: '#D5D5D5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIndicator: {
    width: responsive.width(80),
    height: responsive.height(5),
    backgroundColor: '#000',
    borderRadius: 5,
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    top: responsive.height(35),
    left: responsive.width(),
    width: responsive.width(355),
    height: responsive.height(43),
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: 'red',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    flexDirection: 'row',
    paddingLeft: responsive.padding(4),
  },
  floatingView: {
    position: 'absolute',
    top: responsive.height(80),
    left: responsive.width(15),
    width: responsive.width(200),
    height: responsive.height(100),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButton2: {
    backgroundColor: '#EBEBEB',
    borderWidth: 0.5,
    position: 'absolute',
    top: responsive.height(28),
    left: responsive.width(18),
    width: '90%',
    height: responsive.height(45),
    borderRadius: 25,
    alignItems: 'center',
    // alignItems: 'center',
    shadowOffset: {width: 0, height: 2},
    flexDirection: 'row',
    paddingHorizontal: responsive.padding(8),
    gap: 5,
  },
});

export default QuickRide;
