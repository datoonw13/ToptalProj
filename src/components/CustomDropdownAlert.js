import React from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import {setRef} from '../services/notificationService';

const CustomDropdownAlert = () => {
  return (
    <DropdownAlert
      ref={(ref) => {
        setRef(ref);
      }}
      updateStatusBar={false}
      closeInterval={1000}
    />
  );
};
export default CustomDropdownAlert;
