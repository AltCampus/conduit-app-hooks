export default function validate(errors, name, value) {
  switch (name) {
    case 'email':
      let emailError = '';
      if (value.indexOf('@') === -1) {
        emailError = 'Email should contain @';
      }
      if (!value) {
        emailError = 'Email cant be empty';
      }
      errors.email = emailError;
      break;
    case 'username':
      let usernameError = '';
      if (value.length < 6) {
        usernameError = 'username should contain 6 charachter';
      }
      if (!value) {
        usernameError = 'Email cant be empty';
      }
      errors.username = usernameError;
      break;
    case 'password':
      let passwordError = '';
      var numeric_alpha = /^(?=.*[a-zA-Z])(?=.*[0-9])/;

      if (!value) {
        passwordError = "Password can't be empty";
      } else if (!numeric_alpha.test(value)) {
        passwordError = 'Password should contain one alphabet and one number';
      } else if (value.length < 7) {
        passwordError = 'Password should contain atleast 6 character';
      }
      errors.password = passwordError;
      break;
    default:
      break;
  }
}
