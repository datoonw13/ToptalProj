import React from 'react';
import {Container} from '../../components';
import {Button, Divider} from 'react-native-elements';
import {StyleSheet} from 'react-native';
const GetStarted = ({navigation}) => {
  return (
    <Container style={styles.container}>
      <Button title="Sign In" onPress={() => navigation.navigate('SignIn')} />
      <Divider />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </Container>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});
