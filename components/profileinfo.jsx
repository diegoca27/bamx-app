import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Icon } from 'react-native-elements';

const ProfileInfo = ({ email, phone }) => (
  <View style={styles.infoContainer}>
    <View style={styles.infoRow}>
      <Icon
        name="email"
        iconStyle={styles.icon}
      />
      <Text style={styles.infoText}>{email}</Text>
    </View>
    <View style={styles.infoRow}>
      <Icon
        name="phone"
        iconStyle={styles.icon}
      />
      <Text style={styles.infoText} onPress={() => Linking.openURL(`tel:${phone}`)}>
        {phone}
      </Text>
    </View>
    {/* ... otras filas de información que necesites */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  emailColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  emailIcon: {
    color: 'gray',
    fontSize: 30,
  },
  emailNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  emailNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  emailRow: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 16,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  smsIcon: {
    color: 'darkgray',
    fontSize: 30,
  },
  smsRow: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  telIcon: {
    color: 'gray',
    fontSize: 30,
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  telNumberColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    fontSize: 16,
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 20, 
    backgroundColor: '#FFF', 
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    color: 'gray',
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
  },
});

export default ProfileInfo;