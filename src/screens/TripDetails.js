import React, {useEffect} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Container} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {getDateString} from '../utils/date';
import {Text, Button, Divider} from 'react-native-elements';
import {colors} from '../theme';
import {deleteTrip, setSelectedTrip} from '../store/ducks/trips';

// კომენტარია სწორი
const TripDetails = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {destination, daysLeft, startDate, endDate, comment, id} = useSelector(
    (state) => state.trips.selectedTrip,
  );

  console.log('render');

  useEffect(() => {
    return () => {
      dispatch(setSelectedTrip(null));
    };
  }, [dispatch]);

  const editHandler = () => {
    navigation.push('Edit Trip');
  };

  const deleteHandler = () =>
    Alert.alert('Delete', 'Delete the trip', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(deleteTrip(id));
        },
      },
    ]);

  return (
    <Container style={styles.container}>
      <View style={styles.itemContainer}>
        <Text>{`${user.name}'s trip`}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text>{destination}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text>{`${getDateString(startDate)} - ${getDateString(endDate)}`}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text>{daysLeft >= 0 ? `${daysLeft} days left` : 'past'}</Text>
      </View>
      <View style={styles.commentWrapper}>
        <Text>{comment ? comment : 'no comment'}</Text>
      </View>
      <View style={styles.divider}>
        <Button title="edit" onPress={editHandler} />
        <Divider />
        <Button title="delete" onPress={deleteHandler} />
      </View>
    </Container>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemContainer: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    height: 40,
  },
  commentWrapper: {
    paddingTop: 10,
  },
  divider: {
    paddingBottom: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
});
