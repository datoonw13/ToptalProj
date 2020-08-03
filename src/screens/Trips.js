import React, {useEffect, useState} from 'react';
import {Overlay, CheckBox} from 'react-native-elements';
import {Loader, TripsFilter} from '../components';
import {useSelector, useDispatch} from 'react-redux';
import {
  getTrips,
  getNextMonthTrips,
  toggleNextMonthCheckBox,
} from '../store/ducks/trips';
import {FlatList, StyleSheet, View} from 'react-native';
import TripItem from '../components/TripItem';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../theme';
import {TouchableOpacity, Platform} from 'react-native';
const LIMIT = 20;

let onEndReachedCalledDuringMomentum = true;

const Trips = ({navigation}) => {
  const flatListRef = React.useRef();
  const [isVisible, setIsVisible] = useState(false);
  const {
    tripDetailsAreLoading,
    tripDetailsforNextMonthAreLoading,
    trips,
    tripsFilter,
    nextMonthIsChecked,
  } = useSelector((state) => state.trips);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTrips());
  }, [dispatch]);
  const hideFiler = () => setIsVisible(false);
  const showFiler = () => setIsVisible(true);
  const toTop = () => {
    flatListRef.current.scrollToOffset({animated: true, offset: 0});
  };
  const onScrollEndHandler = () => {
    console.log('end reached');
    if (!onEndReachedCalledDuringMomentum) {
      nextMonthIsChecked
        ? dispatch(getNextMonthTrips(true, Object.values(trips).length, LIMIT))
        : dispatch(
            getTrips(tripsFilter, true, Object.values(trips).length, LIMIT),
          );
      onEndReachedCalledDuringMomentum = true;
    }
  };
  const nextMonthToggleHandler = () => {
    nextMonthIsChecked
      ? dispatch(getTrips(tripsFilter))
      : dispatch(getNextMonthTrips());
    dispatch(toggleNextMonthCheckBox(!nextMonthIsChecked));
    toTop();
  };
  const filterSubmitHandler = (filter) => {
    toTop();
    dispatch(getTrips(filter));
  };
  const renderTrip = ({item}) => <TripItem trip={item} />;
  const tripsAreLoading = () => {
    return tripDetailsAreLoading || tripDetailsforNextMonthAreLoading;
  };
  return (
    <>
      {tripsAreLoading() && (
        <View style={styles.loader}>
          <Loader />
        </View>
      )}
      <View style={styles}>
        <View style={styles.header}>
          <CheckBox
            center
            title="next month"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={nextMonthIsChecked}
            onPress={nextMonthToggleHandler}
          />
          <TouchableOpacity
            onPress={() => navigation.push('Create Trip')}
            style={styles.inconWrapper}>
            <AntDesign name="addfile" color={colors.blue} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showFiler}
            style={styles.inconWrapper}
            disabled={nextMonthIsChecked}>
            <AntDesign
              name="filter"
              color={nextMonthIsChecked ? colors.gray : colors.blue}
              size={30}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={Object.values(trips)}
          renderItem={renderTrip}
          keyExtractor={(item) => `${item.id}`}
          onEndReachedThreshold={Platform.OS === 'android' ? 0.2 : 0}
          onEndReached={onScrollEndHandler}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          bounces={true}
          scrollToOverflowEnabled={true}
        />

        <Overlay
          isVisible={isVisible}
          onBackdropPress={hideFiler}
          overlayStyle={styles.overlay}>
          <TripsFilter hide={hideFiler} onSubmit={filterSubmitHandler} />
        </Overlay>
      </View>
    </>
  );
};

export default Trips;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overlay: {
    marginTop: '-80%',
    width: '70%',
    height: 300,
  },
  inconWrapper: {
    padding: 10,
  },
  loader: {
    position: 'absolute',
    flex: 1,
    zIndex: 10,
    height: '100%',
    width: '100%',
  },
});
