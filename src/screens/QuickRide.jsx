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
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
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
import {bookRide, cancelRide, getVehicleRides} from '../api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height} = Dimensions.get('window');

const QuickRide = ({route}) => {
  const user = auth().currentUser;
  const {location, address} = route.params;
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

  const [destinationPlace, setDestination] = useState('');
  const [fromLocationString, setFromLocationString] = useState('');
  const [rideDetails, setRideDetails] = useState('');
  const [riderId, setRiderId] = useState('VWi9S6aB6QNSB0AqGJiQKszAjby1');
  const [status, setStatus] = useState('places');
  const [vehicles, setVehilces] = useState({});
  const [toLocation, setToLocation] = useState({});
  const [userData, setUserData] = useState(null);
  const [isRideBooked, setIsRideBooked] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideData, setRideData] = useState('');
  const ref = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [header, setHeader] = useState('rider');
  const [rideOptions2, ssetRideOptions] = useState([]);
  const [distance, setDistance] = useState('');

  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);

  useEffect(() => {
    if (!riderId) return;
    console.log('Searching for ride with rider_id:', riderId);

    const ridesCollectionRef = firestore()
      .collection('all_rides')
      .doc('Active')
      .collection('rides');

    const unsubscribe = ridesCollectionRef
      .where('rider_id', '==', riderId)
      .limit(1)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const rideData = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          };
          setRideData(rideData);
          console.log('Ride found:', rideData);
        } else {
          console.log('No ride found for this rider_id');
        }
      });

    return () => unsubscribe();
  }, [riderId]);

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
      }
    });

    return () => unsubscribe();
  }, [rideData.id]);

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

  const handleBackPress = () => {
    if (status === 'places') {
      navigation.goBack();
    } else if (status === 'List') {
      setStatus('places');
    } else if (status === 'rider' || 'otp') {
      setStatus('List');
    }
  };

  useEffect(() => {
    if (location) {
      let stringLocation = formatLatLong(location.latitude, location.longitude);
      setFromLocationString(stringLocation);
    }
  }, [location]);

  useEffect(() => {
    if (fromLocationString && toLocationString) {
      console.log('FromString', fromLocationString);
      console.log('ToString', toLocationString);
      const fetchDistance = async () => {
        try {
          const finalDistance = await getDistanceFromGoogle(
            fromLocationString,
            toLocationString,
          );
          console.log('data from googleApi', finalDistance);
          setDistance(finalDistance);
        } catch (error) {
          console.error('Error fetching distance:', error);
        }
      };
      fetchDistance();
    }
  }, [fromLocationString, toLocationString]);

  const firstViewInitialHeight = height * 0.3;
  const secondViewInitialHeight = height * 0.7;
  const firstViewExpandedHeight = height * 0.62;
  const secondViewCollapsedHeight = height * 0.38;
  const expandedPosition = firstViewExpandedHeight - firstViewInitialHeight;

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

  // const handleBookRide = () => {
  //   setModalVisible(true);
  //   setTimeout(() => {
  //     setModalVisible(false);
  //     setStatus('rider');
  //   }, 2000);
  // };

  const handleBookRide = (vehicle, price) => {
    console.log(`Booking ride for: ${vehicle} at ₹${price}`);
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
            price: vehicleResponse.data[key].cost, // Cost from API
            originalPrice: vehicleResponse.data[key].strike_cost, // Strike-through price from API
          }),
        );

        setVehilces(ridevehicle);
        setStatus('list');

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
    console.log('Selected Vehicle:', vehicle);
    console.log('Price:', price);
    const getAuthInfo = await getData();
    console.log('authInfo', getAuthInfo);
    setSelectedRide(vehicle);
    gettingBookRide(vehicle, price, userData);
  };

  const getData = async key => {
    try {
      const value = await AsyncStorage.getItem('auth');
      const convert = JSON.parse(value);
      setUserData(value);
      console.log('userData', convert);
      return convert;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const onPressPlaces = async (data, details) => {
    console.log('Selected Place Data:', data.description);
    setDestination(data.description);
    console.log('To:', details.geometry.location);
    setToLocation(details.geometry.location);
    const stringFormLocation = formatLatLong(
      details.geometry.location.lat,
      details.geometry.location.lng,
    );
    console.log('toStringHere', stringFormLocation);
    setToLocationString(stringFormLocation);
    setStatus('List');
  };

  const gettingBookRide = async (vehicle, price, UserData) => {
    console.log('place', destinationPlace);
    console.log('Fromlocation', location);
    console.log('Tolocation', toLocation);
    console.log(userData);
    const data = {
      pick: {
        latitude: location.latitude,
        longitude: location.longitude,
        place: address,
      },
      drop: {
        latitude: toLocation.lat,
        longitude: toLocation.lng,
        place: destinationPlace,
      },
      name: user.displayName,
      phone: user.phoneNumber,
      rate: price,
      uid: user.uid,
      vehicleType: vehicle,
    };
    try {
      const response = await bookRide(data);
      riderId(response.rideId);
      console.log('gettingBookRide', response);
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
              key={'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0'}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: 16.43815,
                longitude: 81.0934,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />

            <TouchableOpacity style={styles.floatingButton2}>
              <BackButton
                onPress={handleBackPress}
                name="arrow-back-circle-outline"
                size={40}
                color="#000000"
              />
              <View>
                <Text
                  style={{
                    fontSize: responsive.fontSize(12),
                    fontFamily: 'Outfit-Regular',
                    color: '#000000',
                  }}>
                  355 Mills Extension, Emmetcester 18477
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
              <AddressView />
            ) : status === 'rider' ? (
              <RiderDetails />
            ) : status === 'otp' ? (
              <OTPDisplay />
            ) : null}

            {status === 'places' ? (
              <GoogleLocationSearch onPlaceSelected={onPressPlaces} />
            ) : status === 'List' ? (
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
            ) : status === 'Accepted' ? (
              <RideDetailsCard
                driverName="John Doe"
                driverRole="Driver"
                fare="₹120"
                vehicleNumber="MH 12 AB 3456"
                vehicleName="Toyota Innova"
                isRideBooked={true}
                onPressBookRide={handleCancelRide}
              />
            ) : (
              <RideDetailsCard
                driverName="John Doe"
                driverRole="Driver"
                fare="₹120"
                vehicleNumber="MH 12 AB 3456"
                vehicleName="Toyota Innova"
                isRideBooked={true}
                onPressBookRide={handleCancelRide}
              />
            )}
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
