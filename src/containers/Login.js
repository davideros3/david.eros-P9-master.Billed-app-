import { ROUTES_PATH } from '../constants/routes.js';
export let PREVIOUS_LOCATION = '';

// We use a class so as to test its methods in e2e tests
export default class Login {
  constructor({ document, localStorage, onNavigate, PREVIOUS_LOCATION, firestore }) {
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION;
    this.firestore = firestore;

    const formEmployee = this.document.querySelector(`form[data-testid="form-employee"]`);
    if (formEmployee) formEmployee.addEventListener("submit", this.handleSubmitEmployee);

    const formAdmin = this.document.querySelector(`form[data-testid="form-admin"]`);
    if (formAdmin) formAdmin.addEventListener("submit", this.handleSubmitAdmin);
  }

  handleSubmitEmployee = (e) => {
    e.preventDefault();

    const emailInput = e.target.querySelector(`input[data-testid="employee-email-input"]`);
    const passwordInput = e.target.querySelector(`input[data-testid="employee-password-input"]`);

    if (!emailInput || !passwordInput) return; // Prevents errors if elements are missing

    const user = {
      type: "Employee",
      email: emailInput.value,
      password: passwordInput.value,
      status: "connected",
    };

    this.localStorage.setItem("user", JSON.stringify(user));
    const userExists = this.checkIfUserExists(user);
    if (!userExists) this.createUser(user);

    this.onNavigate(ROUTES_PATH['Bills']);
    this.PREVIOUS_LOCATION = ROUTES_PATH['Bills'];
    PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
    this.document.body.style.backgroundColor = "#fff";
  };

  handleSubmitAdmin = (e) => {
    e.preventDefault();

    const emailInput = e.target.querySelector(`input[data-testid="admin-email-input"]`);
    const passwordInput = e.target.querySelector(`input[data-testid="admin-password-input"]`);

    if (!emailInput || !passwordInput) return // Prevents errors if elements are missing

    const user = {
      type: "Admin",
      email: emailInput.value,
      password: passwordInput.value,
      status: "connected",
    };

    this.localStorage.setItem("user", JSON.stringify(user));
    const userExists = this.checkIfUserExists(user);
    if (!userExists) this.createUser(user);

    this.onNavigate(ROUTES_PATH['Dashboard']);
    this.PREVIOUS_LOCATION = ROUTES_PATH['Dashboard'];
    PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
    document.body.style.backgroundColor = "#fff";
  };

  // No need to cover this function by tests
  checkIfUserExists = (user) => {
    if (this.firestore) {
      return this.firestore
        .user(user.email)
        .get()
        .then((doc) => doc.exists)
        .catch((error) => {
          console.error(error);
          return false;
        });
    } else {
      return false;
    }
  };

  // No need to cover this function by tests
  createUser = (user) => {
    if (this.firestore) {
      return this.firestore
        .users()
        .doc(user.email)
        .set({
          type: user.type,
          name: user.email.split('@')[0],
        })
        .then(() => console.log(`User with ${user.email} is created`))
        .catch((error) => console.error(error));
    }
  };
}