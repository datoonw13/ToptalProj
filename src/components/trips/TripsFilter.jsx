import React, {useState} from 'react';
import {StyleSheet, View, Keyboard, KeyboardAvoidingView} from 'react-native';
import {Input, Button, colors, Divider, CheckBox} from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setTripsFilterData} from '../../store/ducks/trips';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getDateString, addDays, getUTC00ByDate} from '../../utils/date';

const TripsFilter = ({hide, onSubmit}) => {
  const {tripsFilter, currentDate} = useSelector((state) => state.trips);
  const dispatch = useDispatch();
  const [destination, setDestination] = useState(
    tripsFilter.destination ? tripsFilter.destination : undefined,
  );

  const [startDateIsEnabled, setStartDateIsEnabled] = useState(
    !!tripsFilter.startDate,
  );

  const [endDateIsEnabled, setEndDateIsEnabled] = useState(
    !!tripsFilter.endDate,
  );

  const [date, setDate] = useState({
    start: tripsFilter.startDate ? tripsFilter.startDate : currentDate,
    end: tripsFilter.endDate ? tripsFilter.endDate : addDays(currentDate, 1),
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    start: false,
    end: false,
  });

  const submitHandler = () => {
    const filterData = {
      destination: destination,
      startDate: startDateIsEnabled ? getUTC00ByDate(date.start) : undefined,
      endDate: endDateIsEnabled ? getUTC00ByDate(date.end) : undefined,
    };
    dispatch(setTripsFilterData(filterData));
    onSubmit(filterData);
    hide();
  };

  const updateVisibility = (which, status) => {
    setDatePickerVisibility({
      ...isDatePickerVisible,
      [which]: status,
    });
  };

  const handleDateConfirm = (which, pickedDate) => {
    updateVisibility(which, false);
    pickedDate > date.end
      ? setDate({
          start: pickedDate,
          end: addDays(pickedDate, 1),
        })
      : setDate({
          ...date,
          [which]: pickedDate,
        });
    updateVisibility(which, false);
  };
  return (
    <KeyboardAvoidingView
      onTouchStart={Keyboard.dismiss}
      style={styles.container}>
      <View style={styles.container}>
        <Input
          placeholder="destination"
          leftIcon={
            <EvilIcons name="location" size={22} color={colors.grey2} />
          }
          onChangeText={(val) => setDestination(val)}
          value={destination}
        />
        <View style={styles.picker}>
          <CheckBox
            size={16}
            center
            title="start"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={startDateIsEnabled}
            onPress={() => setStartDateIsEnabled(!startDateIsEnabled)}
          />
          <Button
            title={getDateString(date.start)}
            onPress={() => updateVisibility('start', true)}
            disabled={!startDateIsEnabled}
          />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.start}
          mode="date"
          onConfirm={(pickdeDate) => handleDateConfirm('start', pickdeDate)}
          onCancel={() => updateVisibility('start', false)}
          date={date.start}
        />
        <Divider />
        <View style={styles.picker}>
          <CheckBox
            size={16}
            center
            title="end"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={endDateIsEnabled}
            onPress={() => setEndDateIsEnabled(!endDateIsEnabled)}
          />
          <Button
            title={getDateString(date.end)}
            onPress={() => updateVisibility('end', true)}
            disabled={!endDateIsEnabled}
          />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.end}
          mode="date"
          onConfirm={(pickdeDate) => handleDateConfirm('end', pickdeDate)}
          onCancel={() => updateVisibility('end', false)}
          date={date.end}
          minimumDate={date.start}
        />
        <View style={styles.divider} />
        <Button
          title="filter"
          onPress={submitHandler}
          disabledTitleStyle={{color: colors.primary}}
          style={styles.submitButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TripsFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    flex: 1,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    alignSelf: 'auto',
  },
});
