import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Input, Button, Divider, colors} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {signIn} from '../store/ducks/auth';

const SignIn = ({navigation}) => {
  const {authIsInProgress} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const onSubmit = (data) => dispatch(signIn(data.email, data.password));
  const {control, handleSubmit, errors} = useForm();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styels.conatiner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View>
          <Controller
            name="email"
            control={control}
            render={({onChange, onBlur, value}) => (
              <Input
                autoCapitalize="none"
                placeholder="email"
                leftIcon={
                  <AntDesign name="user" size={22} color={colors.grey2} />
                }
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                errorMessage={errors.email && 'Please enter valid email'}
              />
            )}
            rules={{
              required: true,
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            }}
          />
          <Controller
            name="password"
            control={control}
            render={({onChange, onBlur, value}) => (
              <Input
                secureTextEntry={true}
                placeholder="password"
                leftIcon={
                  <AntDesign name="unlock" size={22} color={colors.grey2} />
                }
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                errorMessage={errors.password && 'Please enter password'}
              />
            )}
            rules={{
              required: true,
            }}
          />
          <Divider />
          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            disabled={authIsInProgress}
            disabledTitleStyle={{color: colors.primary}}
          />
          <Divider />
          <Button
            title="Sign Up"
            onPress={() => navigation.push('SignUp')}
            disabled={authIsInProgress}
            disabledTitleStyle={{color: colors.primary}}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;

// ყველგან ან სტილები მაღლა ან ეხპორტი
const styels = StyleSheet.create({
  conatiner: {
    paddingTop: 24,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
