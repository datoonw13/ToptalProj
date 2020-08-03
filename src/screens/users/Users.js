import React, {useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {UserItem, Loader} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {getUsers, setSelectedUser} from '../../store/ducks/users';
import {navigate} from '../../services/navigationService';
import {Button} from 'react-native-elements';

const Users = () => {
  const {users, usersAreLoading} = useSelector((state) => state.users);
  const {role} = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const userPressHandler = (user) => {
    dispatch(setSelectedUser(user));
    navigate('User Details');
  };

  const renderTrip = ({item}) => (
    <UserItem user={item} onPress={userPressHandler} />
  );

  return (
    <>
      {usersAreLoading && (
        <View style={styles.loader}>
          <Loader />
        </View>
      )}
      <View>
        <View>
          {role.match('admin', 'manager') && (
            <Button
              title="add user"
              style={styles.button}
              onPress={() => navigate('Add User')}
            />
          )}
        </View>
        <FlatList
          data={Object.values(users)}
          renderItem={renderTrip}
          keyExtractor={(item) => `${item.uid}`}
        />
      </View>
    </>
  );
};
export default Users;

const styles = StyleSheet.create({
  button: {
    width: 100,
  },
  loader: {
    position: 'absolute',
    flex: 1,
    zIndex: 10,
    height: '100%',
    width: '100%',
  },
});
