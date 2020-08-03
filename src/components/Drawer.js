import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Container from './Container';
import {Button, Text} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {resetStore} from '../store/ducks/main';
import {SafeAreaView, View, StyleSheet} from 'react-native';
const Drawer = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(resetStore());
  };
  return (
    <Container>
      <SafeAreaView />
      <Text h3 style={styles.text}>
        {user.name}
      </Text>
      <View style={styles.buttonWrapper}>
        <Button title="Sing Out" onPress={signoutHandler} />
      </View>
      <SafeAreaView />
    </Container>
  );
};
export default Drawer;
const styles = StyleSheet.create({
  buttonWrapper: {
    marginBottom: 30,
  },
  text: {
    flex: 1,
    textAlign: 'center',
  },
});
