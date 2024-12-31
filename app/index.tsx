import React, { useEffect, useState } from 'react';
import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native';
import MapboxGL, { Camera, UserLocation } from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';

const MAPBOX_ACCESS_TOKEN= "pk.eyJ1Ijoic29yZXc0MzczMSIsImEiOiJjbTNmcjRnN2MwOXdqMm1zZTl1NW9uZmhhIn0.wpiRyJZb0CpKdKpCRUu3VA" 

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MapComponent = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }
      getCurrentLocation();
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <Camera
          zoomLevel={14}
          centerCoordinate={location}
        />
        {location && (
          <UserLocation visible={true} showsUserHeadingIndicator={true}/>
        )}
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapComponent;
