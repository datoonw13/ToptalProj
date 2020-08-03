import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import {colors} from '../theme';

const UserIteim = ({user, onPress}) => {
  const {displayName} = user;
  return (
    <ListItem
      title={displayName}
      leftElement={
        <View style={styles.lElCon}>
          <Text style={styles.lElConText}>{displayName[0]}</Text>
        </View>
      }
      bottomDivider
      chevron
      onPress={() => onPress(user)}
    />
  );
};

export default UserIteim;

const styles = StyleSheet.create({
  lElCon: {
    width: 26,
    height: 26,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  lElConText: {
    color: colors.white,
    fontSize: 18,
  },
  subtitle: {
    fontSize: 12,
  },
});
