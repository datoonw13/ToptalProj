let ref;
export function setRef(dropdownAlertRef) {
  ref = dropdownAlertRef;
}
export function notify(status, title, message) {
  console.log(status, title, message);
  ref.alertWithType(status, title, message);
}
