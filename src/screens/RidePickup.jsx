import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Close from '../assets/batteries/Icons/Close';
import RideAdd from '../assets/batteries/Icons/RideAdd';
import SearchIcon from '../assets/batteries/Icons/ride/SearchIcon';
import SearchInputMap from '../assets/batteries/Icons/ride/SearchInputMap';
import LocationUnSelect from '../assets/batteries/Icons/ride/LocationUnSelect';
import CurrentLocation from '../assets/batteries/Icons/ride/CurrentLocation';
import responsive from '../utils/responsive';
import {useNavigation} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GOOGLE_API_KEY = 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0';

const RidePickup = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message:
            'We need access to your location to provide a better experience.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location access is required to fetch your position.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        console.log('Lat:', latitude, 'Lng:', longitude);
        setLocation({latitude, longitude});
        fetchAddress(latitude, longitude);
      },
      error => {
        console.log('Geolocation error:', error);
        Alert.alert('Error', 'Failed to fetch location. Please try again.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`,
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        console.log('Address:', formattedAddress);
      } else {
        setAddress('No address found');
      }
    } catch (error) {
      console.log('Geocoding Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Close width={30} height={30} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Your route</Text>
          </View>
          <RideAdd width={23} height={23} />
        </View>

        {/* Pickup Location Input */}
        <View style={styles.inputContainer}>
          <SearchIcon />
          <GooglePlacesAutocomplete
            placeholder="From"
            fetchDetails={true}
            enablePoweredByContainer={false}
            debounce={300}
            styles={{
              textInputContainer: {
                flex: 1,
                backgroundColor: 'transparent',
              },
              textInput: {
                marginTop: responsive.margin(5),
                height: responsive.height(40),
                fontSize: 16,
                backgroundColor: 'transparent',
                borderBottomWidth: 0,
              },
              listView: {
                position: 'absolute',
                top: responsive.height(54),
                width: '100%',
                backgroundColor: 'white',
                zIndex: 999,
                borderRadius: 8,
              },
            }}
            onPress={(data, details = null) => {
              console.log('Selected Place:', data, details);
            }}
            query={{
              key: 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0',
              language: 'en',
            }}
          />
          <SearchInputMap style={styles.searchInputIcon} />
        </View>

        {/* Destination Card */}
        <TouchableOpacity
          style={styles.destinationContainer}
          onPress={() => {
            if (address) {
              navigation.navigate('Ride', {location, address});
            } else {
              Alert.alert('Error', 'Please select a valid destination first.');
            }
          }}>
          <LocationUnSelect />
          <Text style={styles.destinationText} numberOfLines={1}>
            {address ? address : 'Destination'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Section */}
      <TouchableOpacity style={styles.locationContainer} onPress={getLocation}>
        <View style={styles.locationRow}>
          <CurrentLocation />
          <Text style={styles.locationText}>
            {location ? 'Location fetched' : 'My location'}
          </Text>
        </View>

        {/* Background Image */}
        <ImageBackground
          source={require('../../src/assets/logo.png')}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default RidePickup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(8),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsive.padding(8),
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 5,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Outfit-SemiBold',
    fontSize: responsive.fontSize(17),
  },
  inputContainer: {
    width: '100%',
    borderRadius: responsive.borderRadius(9),
    height: responsive.height(47),
    borderWidth: responsive.width(1),
    borderColor: '#B8292999',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(8),
  },
  inputField: {
    flex: 1,
    marginHorizontal: responsive.width(5),
  },
  searchInputIcon: {
    width: responsive.width(20),
    height: responsive.height(20),
  },
  destinationContainer: {
    width: '100%',
    backgroundColor: '#F1F1F1',
    height: responsive.height(47),
    marginVertical: responsive.margin(10),
    borderRadius: responsive.borderRadius(9),
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingLeft: responsive.padding(10),
  },
  destinationText: {
    color: '#7B7A7A',
    fontSize: responsive.fontSize(14),
    fontFamily: 'Outfit-Regular',
  },
  locationContainer: {
    paddingHorizontal: responsive.padding(10),
    flex: 1,
  },
  locationRow: {
    width: '100%',
    height: responsive.height(68),
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationText: {
    fontFamily: 'Outfit-Regular',
    fontSize: responsive.fontSize(16),
    color: '#161616',
  },
  backgroundImage: {
    opacity: 0.3,
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: responsive.height(20),
  },
});
