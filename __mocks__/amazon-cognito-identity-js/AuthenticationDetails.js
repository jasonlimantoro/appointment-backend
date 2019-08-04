export default class AuthenticationDetails {
  constructor(authDetails = {}) {
    const { Username, Password } = authDetails;
    this.username = Username;
    this.password = Password;
  }
}
