import LoginUI from "../views/LoginUI"
import Login from '../containers/Login.js'
import { ROUTES } from "../constants/routes"
import { fireEvent, screen } from "@testing-library/dom"

describe("Given I am a user on the login page", () => {
  describe("When I do not fill any fields and click the Employee Login button", () => {
    test("Then it should render the login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("employee-email-input")
      expect(inputEmailUser.value).toBe("")

      const inputPasswordUser = screen.getByTestId("employee-password-input")
      expect(inputPasswordUser.value).toBe("")

      const form = screen.getByTestId("form-employee")
      const handleSubmit = jest.fn(e => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-employee")).toBeTruthy()
    })
  })

  describe("When I fill fields in an incorrect format and click the Employee Login button", () => {
    test("Then it should render the login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("employee-email-input")
      fireEvent.change(inputEmailUser, { target: { value: "notanemail" } })
      expect(inputEmailUser.value).toBe("notanemail")

      const inputPasswordUser = screen.getByTestId("employee-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } })
      expect(inputPasswordUser.value).toBe("azerty")

      const form = screen.getByTestId("form-employee")
      const handleSubmit = jest.fn(e => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-employee")).toBeTruthy()
    })
  })

  describe("When I fill fields in the correct format and click the Employee Login button", () => {
    test("Then I should be identified as an Employee in the app", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty"
      }

      const inputEmailUser = screen.getByTestId("employee-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)

      const inputPasswordUser = screen.getByTestId("employee-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-employee")

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ''

      const firebase = jest.fn()

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        firebase
      })

      const handleSubmit = jest.fn(login.handleSubmitEmployee)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected"
        })
      )
    })

    test("It should render the Bills page", () => {
      expect(screen.getAllByText('My expense reports')).toBeTruthy()
    })
  })
})

describe("Given I am a user on the login page", () => {
  describe("When I do not fill any fields and click the Admin Login button", () => {
    test("Then it should render the login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("admin-email-input")
      expect(inputEmailUser.value).toBe("")

      const inputPasswordUser = screen.getByTestId("admin-password-input")
      expect(inputPasswordUser.value).toBe("")

      const form = screen.getByTestId("form-admin")
      const handleSubmit = jest.fn(e => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-admin")).toBeTruthy()
    })
  })

  describe("When I fill fields in an incorrect format and click the Admin Login button", () => {
    test("Then it should render the login page", () => {
      document.body.innerHTML = LoginUI()

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: "notanemail" } })
      expect(inputEmailUser.value).toBe("notanemail")

      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } })
      expect(inputPasswordUser.value).toBe("azerty")

      const form = screen.getByTestId("form-admin")
      const handleSubmit = jest.fn(e => e.preventDefault())

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-admin")).toBeTruthy()
    })
  })

  describe("When I fill fields in the correct format and click the Admin Login button", () => {
    test("Then I should be identified as an Admin in the app", () => {
      document.body.innerHTML = LoginUI()
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected"
      }

      const inputEmailUser = screen.getByTestId("admin-email-input")
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } })
      expect(inputEmailUser.value).toBe(inputData.email)

      const inputPasswordUser = screen.getByTestId("admin-password-input")
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } })
      expect(inputPasswordUser.value).toBe(inputData.password)

      const form = screen.getByTestId("form-admin")

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let PREVIOUS_LOCATION = ''

      const firebase = jest.fn()

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        firebase
      })

      const handleSubmit = jest.fn(login.handleSubmitAdmin)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalled()
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected"
        })
      )
    })

    test("It should render the HR dashboard page", () => {
      expect(screen.queryByText('Approvals')).toBeTruthy()
    })
  })
})


















