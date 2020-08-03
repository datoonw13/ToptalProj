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
import {signUp} from '../store/ducks/auth';
import {useDispatch, useSelector} from 'react-redux';

const SignUp = () => {
  const {authIsInProgress} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const onSubmit = (data) => dispatch(signUp(data.email, data.password));
  const {control, handleSubmit, errors, watch} = useForm();
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
                errorMessage={
                  errors.password && 'Password must be at least 6 symbols'
                }
              />
            )}
            rules={{
              required: true,
              validate: (value) => value?.length >= 6,
            }}
          />
          <Controller
            name="repeatePassword"
            control={control}
            render={({onChange, onBlur, value}) => {
              return (
                <Input
                  secureTextEntry={true}
                  placeholder="repeate password"
                  leftIcon={
                    <AntDesign name="unlock" size={22} color={colors.grey2} />
                  }
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value}
                  errorMessage={
                    errors.repeatePassword && "passwords doesn't match"
                  }
                />
              );
            }}
            rules={{
              validate: (value) =>
                value === watch('password') && value?.length >= 6,
              required: true,
            }}
          />
          <Divider />
          <Button
            title="Sign Up"
            onPress={handleSubmit(onSubmit)}
            disabled={authIsInProgress}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;

const styels = StyleSheet.create({
  conatiner: {
    flex: 1,
    paddingTop: 24,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
