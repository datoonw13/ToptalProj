import React, {useEffect} from 'react';
import {Divider} from 'react-native-elements';
import {Container, Loader} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {getNextMonthTrips} from '../../store/ducks/trips';
import {FlatList} from 'react-native';
import TripItem from '../../components/trips/TripItem';

const NextMonthTrips = () => {
  const {tripDetailsforNextMonthAreLoading, tripsForNextMonth} = useSelector(
    (state) => state.trips,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNextMonthTrips());
  }, [dispatch]);
  const renderTrip = ({item}) => <TripItem trip={item} editable={false} />;
  return tripDetailsforNextMonthAreLoading ? (
    <Loader />
  ) : (
    <Container>
      <Divider />
      <FlatList
        data={Object.values(tripsForNextMonth)}
        renderItem={renderTrip}
        keyExtractor={(item) => `${item.id}`}
      />
    </Container>
  );
};

export default NextMonthTrips;
