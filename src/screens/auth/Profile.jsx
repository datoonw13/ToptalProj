import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Input, Button, Divider, colors, Text} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {editProfile} from '../../store/ducks/auth';

const Profile = () => {
  const {profileUpdateInProgress, user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    dispatch(editProfile(user, data.newPassword));
    control.setValue('newPassword', '');
  };
  const {control, handleSubmit, errors} = useForm();
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.conatiner}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View>
            <Text style={styles.headerText}>{user.email}</Text>
            <Controller
              name="newPassword"
              control={control}
              render={({onChange, onBlur, value}) => (
                <Input
                  secureTextEntry={true}
                  placeholder="new password"
                  leftIcon={
                    <AntDesign name="unlock" size={22} color={colors.grey2} />
                  }
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value}
                  errorMessage={
                    errors.newPassword && 'password must be at least 6 symbols'
                  }
                />
              )}
              rules={{
                required: true,
                minLength: 6,
              }}
            />
            <Divider />
            <Button
              title="edit profile"
              onPress={handleSubmit(onSubmit)}
              disabled={profileUpdateInProgress}
              disabledTitleStyle={{color: colors.primary}}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  conatiner: {
    paddingTop: 24,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerText: {
    fontSize: 17,
    textAlign: 'center',
    color: colors.grey1,
  },
});
