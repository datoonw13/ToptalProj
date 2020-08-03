import React, {useState} from 'react';
import {StyleSheet, Keyboard, View, SafeAreaView} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Input, Button, Divider, colors} from 'react-native-elements';
import Textarea from 'react-native-textarea';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {updateTrip} from '../../store/ducks/trips';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getDateString, addDays, getUTC00ByDate} from '../../utils/date';

const EditTrip = ({navigation}) => {
  const dispatch = useDispatch();
  const {tripIsUpdating} = useSelector((state) => state.trips);
  const {destination, comment, id} = useSelector(
    (state) => state.trips.selectedTrip,
  );
  const {control, handleSubmit, errors} = useForm();
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    start: false,
    end: false,
  });

  const currentDate = new Date();

  const [date, setDate] = useState({
    start: currentDate,
    end: addDays(currentDate, 1),
  });

  const updateVisibility = (which, status) => {
    setDatePickerVisibility({
      ...isDatePickerVisible,
      [which]: status,
    });
  };

  const handleDateConfirm = (which, pickedDate) => {
    if (which === 'start' && pickedDate > date.end) {
      setDate({
        start: pickedDate,
        end: addDays(pickedDate, 1),
      });
    } else {
      setDate({
        ...date,
        [which]: pickedDate,
      });
    }

    updateVisibility(which, false);
  };

  const onSubmit = (data) => {
    Keyboard.dismiss();
    const tripData = {
      destination: data.destination,
      comment: data.comment ? data.comment : '',
      startDate: getUTC00ByDate(date.start),
      endDate: getUTC00ByDate(date.end),
    };
    dispatch(updateTrip(id, tripData));
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.contentContainerStyle}>
      <Divider />
      <Button
        title={getDateString(date.start)}
        onPress={() => updateVisibility('start', true)}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible.start}
        mode="date"
        onConfirm={(pickdeDate) => handleDateConfirm('start', pickdeDate)}
        onCancel={() => updateVisibility('start', false)}
        date={date.start}
        minimumDate={currentDate}
      />
      <Divider />
      <Button
        title={getDateString(date.end)}
        onPress={() => updateVisibility('end', true)}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible.end}
        mode="date"
        onConfirm={(pickdeDate) => handleDateConfirm('end', pickdeDate)}
        onCancel={() => updateVisibility('end', false)}
        date={date.end}
        minimumDate={date.start}
      />
      <Divider />
      <Controller
        name="comment"
        control={control}
        defaultValue={comment}
        render={({onChange, onBlur, value}) => (
          <Textarea
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
            onChangeText={(val) => onChange(val)}
            defaultValue={value}
            maxLength={150}
            placeholder={'add a comment'}
            placeholderTextColor={'#c7c7c7'}
            underlineColorAndroid={'transparent'}
          />
        )}
      />
      <Controller
        name="destination"
        control={control}
        defaultValue={destination}
        render={({onChange, onBlur, value}) => (
          <Input
            placeholder="destination"
            leftIcon={
              <EvilIcons name="location" size={22} color={colors.grey2} />
            }
            onBlur={onBlur}
            onChangeText={(val) => onChange(val)}
            value={value}
            errorMessage={errors.destination && 'Please enter destination'}
          />
        )}
        rules={{
          required: true,
          pattern: /^[A-Za-z0-9]+$/i,
        }}
      />
      <View style={styles.divider} />
      <Button
        title="edit trip"
        onPress={handleSubmit(onSubmit)}
        disabled={tripIsUpdating}
        disabledTitleStyle={{color: colors.primary}}
        style={styles.createTrip}
      />
      <SafeAreaView />
    </KeyboardAwareScrollView>
  );
};

export default EditTrip;

// ყველგან ან სტილები მაღლა ან ეხპორტი
const styles = StyleSheet.create({
  conatiner: {
    paddingTop: 24,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textareaContainer: {
    height: 80,
    padding: 5,
    backgroundColor: '#F5FCFF',
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 70,
    fontSize: 14,
    color: '#333',
  },
  divider: {
    flex: 1,
  },
  contentContainerStyle: {
    justifyContent: 'space-between',
    flexGrow: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  createTrip: {
    marginBottom: 10,
  },
});
