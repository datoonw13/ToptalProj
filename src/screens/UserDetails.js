import React, {useEffect} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Container} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {Text, Button, Divider} from 'react-native-elements';
import {colors} from '../theme';
import {deleteUser, setSelectedUser} from '../store/ducks/users';

// კომენტარია სწორი
const UserDetails = ({navigation}) => {
  const dispatch = useDispatch();
  const {selectedUser} = useSelector((state) => state.users);
  const {role: currentUserRole} = useSelector((state) => state.auth.user);
  const {email, role} = selectedUser;

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  const editHandler = () => {
    navigation.push('Edit User');
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
          dispatch(deleteUser(selectedUser));
          navigation.goBack();
        },
      },
    ]);

  return (
    <Container style={styles.container}>
      <View style={styles.itemContainer}>
        <Text>{email}</Text>
      </View>
      <View style={styles.itemContainer}>
        {currentUserRole === 'admin' && <Text>{role}</Text>}
      </View>
      <View style={styles.divider}>
        <Button title="edit" onPress={editHandler} />
        <Divider />
        <Button title="delete" onPress={deleteHandler} />
      </View>
    </Container>
  );
};

export default UserDetails;

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
