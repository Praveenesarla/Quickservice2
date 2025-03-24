import React from 'react';
import {View, StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import SearchLocation from '../../assets/ride/SearchLocation';
import responsive from '../../utils/responsive';

const GoogleLocationSearch = ({
  placeholder = 'Where to?',
  googleApiKey,
  onPlaceSelected,
  containerStyle,
  inputStyle,
  listStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <SearchLocation />

      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails={true}
        enablePoweredByContainer={false}
        debounce={300}
        styles={{
          textInputContainer: [styles.textInputContainer, inputStyle],
          textInput: styles.textInput,
          listView: [styles.listView, listStyle],
        }}
        onPress={(data, details = null) => onPlaceSelected?.(data, details)}
        query={{
          key: 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0',
          language: 'en',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    width: '98%',
    height: responsive.height(54),
    marginVertical: responsive.margin(10),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(7),
    borderWidth: 1,
  },
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
});

export default GoogleLocationSearch;
