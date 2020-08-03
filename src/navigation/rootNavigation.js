import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  SignInScreen,
  SignUpScreen,
  SplashScreen,
  TripsScreen,
  TripDetailsScreen,
  GetStartedScreen,
  ProfileScreen,
  CreateTripScreen,
  EditTripScreen,
  NextMonthTrips,
  UsersScreen,
  UserDetailsScreen,
  EditUserScreen,
  AddUserScreen,
} from '../screens';
import {Burger, Drawer as DrawerContent} from '../components';
import {navigationRef} from '../services/navigationService';
import {useSelector, useDispatch} from 'react-redux';
import {ping} from '../store/ducks/auth';

const TabNav = createBottomTabNavigator();
const Tabs = () => (
  <TabNav.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused}) => {
        let iconName, color;
        color = focused ? colors.blue : colors.gray;
        switch (route.name) {
          case 'Trips':
            iconName = 'home';
            break;
          case 'Users':
            iconName = 'minuscircle';
            break;
          case 'Profile':
            iconName = 'profile';
            break;
          default:
            iconName = '';
        }
        return <AntDesign name={iconName} size={25} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: colors.blue,
      inactiveTintColor: colors.gray,
    }}>
    <TabNav.Screen name="Trips" component={TripsScreen} />
    <TabNav.Screen name="Users" component={UsersScreen} />
    <TabNav.Screen name="Profile" component={ProfileScreen} />
  </TabNav.Navigator>
);

const MainStackNav = createStackNavigator();
const MainStack = () => (
  <MainStackNav.Navigator>
    <MainStackNav.Screen
      name="Trips"
      component={Tabs}
      options={({navigation}) => ({
        headerLeft: () => {
          return <Burger navigation={navigation} />;
        },
      })}
    />
    <MainStackNav.Screen name="Create Trip" component={CreateTripScreen} />
    <MainStackNav.Screen name="Trip Tetails" component={TripDetailsScreen} />
    <MainStackNav.Screen name="Edit Trip" component={EditTripScreen} />
    <MainStackNav.Screen name="Next Month" component={NextMonthTrips} />
    <MainStackNav.Screen name="User Details" component={UserDetailsScreen} />
    <MainStackNav.Screen name="Edit User" component={EditUserScreen} />
    <MainStackNav.Screen name="Add User" component={AddUserScreen} />
  </MainStackNav.Navigator>
);

const DrawerNav = createDrawerNavigator();
const Drawer = () => (
  <DrawerNav.Navigator drawerContent={() => <DrawerContent />}>
    <DrawerNav.Screen name="MainStack" component={MainStack} />
  </DrawerNav.Navigator>
);

const AuthStackNav = createStackNavigator();
const AuthStack = () => (
  <AuthStackNav.Navigator
    screenOptions={{headerStyle: {backgroundColor: colors.blue}}}>
    {/* ამოიღე ეს ბოზი სქრინი */}
    {/* <AuthStackNav.Screen name="GetStarted" component={GetStartedScreen} /> */}
    <AuthStackNav.Screen name="SignIn" component={SignInScreen} />
    <AuthStackNav.Screen name="SignUp" component={SignUpScreen} />
  </AuthStackNav.Navigator>
);

export default function Navigation() {
  const {isLoading, user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ping());
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      {user ? <Drawer /> : <AuthStack />}
    </NavigationContainer>
  );
}
