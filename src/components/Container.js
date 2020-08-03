import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';

const Container = (props) => {
  return (
    <View style={{...styles.container, ...props.style}}>
      {props.children}
      <SafeAreaView />
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});
