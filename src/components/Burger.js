import React from 'react';
import {StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../theme';

const Burger = ({navigation}) => {
  return (
    <AntDesign
      name="menu-unfold"
      color={colors.gray}
      size={25}
      style={styles.container}
      onPress={() => navigation.toggleDrawer()}
    />
  );
};

export default Burger;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});
