import React, {useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Input, Button, Divider, colors, CheckBox} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {createUser} from '../../store/ducks/users';

const AddUser = () => {
  const {userIsCreating} = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const {control, handleSubmit, errors, watch} = useForm();
  const onSubmit = (data) => {
    dispatch(createUser(data.email, data.password, selectedUserType));
  };
  const [selectedUserType, setSelectedUserType] = useState('ordinary');
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
          <View style={styels.checkBoxesWrapper}>
            <CheckBox
              center
              title="ordinary"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={selectedUserType === 'ordinary'}
              onPress={() => setSelectedUserType('ordinary')}
            />
            <CheckBox
              center
              title="manager"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={selectedUserType === 'manager'}
              onPress={() => setSelectedUserType('manager')}
            />
          </View>
          <Divider />
          <Button
            title="add user"
            onPress={handleSubmit(onSubmit)}
            disabled={userIsCreating}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AddUser;

const styels = StyleSheet.create({
  conatiner: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  checkBoxesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
