//მოაგვარე რომ ყველგან ეს ობჯეცტი იყოს, ეს ფერები
const colors = {
  blue: '#42a5f5',
  gray: '#62757f',
  white: '#fafafa',
};

const theme = {
  Divider: {
    height: 10,
    backgroundColor: 'transparent',
  },
  Input: {
    leftIcon: {
      color: colors.gray,
    },
  },
  Button: {
    disabledTitleStyle: {color: colors.gray},
  },
};

export {colors, theme};
