import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

const ProfileHeader = ({ avatar, avatarBackground, name, location }) => (
  <View style={styles.headerContainer}>
    <ImageBackground
      style={styles.headerBackgroundImage}
      blurRadius={10}
      source={{ uri: avatarBackground }}
    >
      <View style={styles.headerColumn}>
        <Image
          style={styles.userImage}
          source={{ uri: avatar }}
        />
        <Text style={styles.userNameText}>{name}</Text>
        <View style={styles.locationRow}>
          <Icon
            name="place"
            underlayColor="transparent"
            iconStyle={styles.locationIcon}
          />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationIcon: {
    color: 'white',
    fontSize: 20,
    marginRight: 5,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileHeader;