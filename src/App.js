import React from 'react';
import {Navigation} from './navigation';
import {CustomDropdownAlert} from './components';
import {ThemeProvider} from 'react-native-elements';
import {theme} from './theme';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import storeRegistry from './store/storeRegistry';
import db from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Axios from 'axios';
const store = configureStore();
storeRegistry.register(store);
// var RNFS = require('react-native-fs');

// auth()
//   .signInWithEmailAndPassword('123456@gmail.com', '123456')
//   .then((user) => {
//     console.log(user);
//     auth()
//       .currentUser.getIdTokenResult()
//       .then((res) => {
//         console.log(res.token);
//       })
//       .catch((e) => console.error(e));
//   })
//   .catch((e) => console.error(e));
// db()
//   .collection('trips')
//   .get()
//   .then((r) => console.log(r))
//   .catch((e) => console.error(e));
// db.collect
// აუცილებლად: დაამატე react-native-screens
// დაამატე ლოადერი სქრინებზე
// გატესტე ყველა ინფუთი გრძელ ტექსტზე
// პროპთაიფების ბიბლიოთეკა ჩატენე
// ფორმების მგონი ვალოდაცია უფრო მოკლედ იწერება
// ახალ იუზერს როლი უნდა მიერტყას ორდინარი
// ლისენერი უნდა დააენი იუზერის ცვლილების
// დაადისეიბლე როტაცია
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
      <CustomDropdownAlert />
    </Provider>
  );
};

export default App;
