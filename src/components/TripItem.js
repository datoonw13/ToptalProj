import React from 'react';
import {ListItem} from 'react-native-elements';
import {Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {colors} from '../theme';
import {navigate} from '../services/navigationService';
import {setSelectedTrip} from '../store/ducks/trips';

// ამოიღე ჩაჰარდკოდებული ტექსტი
const TripItem = ({trip, editable = true}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {destination, daysLeft} = trip;
  const onPressHandler = () => {
    if (editable) {
      dispatch(setSelectedTrip(trip));
      navigate('Trip Tetails');
    }
  };
  // კომენტარია სწორი
  return (
    <ListItem
      title={destination}
      subtitle={daysLeft >= 0 ? `Left ${daysLeft} days:` : 'past'}
      subtitleStyle={styles.subtitle}
      leftElement={
        <View style={styles.lElCon}>
          <Text style={styles.lElConText}>{user.name[0]}</Text>
        </View>
      }
      bottomDivider
      chevron={editable}
      onPress={onPressHandler}
    />
  );
};

export default TripItem;

const styles = StyleSheet.create({
  lElCon: {
    width: 26,
    height: 26,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  lElConText: {
    color: colors.white,
    fontSize: 18,
  },
  subtitle: {
    fontSize: 12,
  },
});
