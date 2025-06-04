import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import Router from "../app/Router";
import Bills from "../containers/Bills";
import userEvent from "@testing-library/user-event";
import firebase from "../__mocks__/firebase";
import DashboardUI from "../views/DashboardUI";
import Firestore from "../app/Firestore";

describe("Given I am connected as an employee", () => {

  describe("When I am on the bills page", () => {
    test("Then the bill icon in the vertical layout should be highlighted", () => {
      jest.mock("../app/Firestore")
      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() })
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const pathname = ROUTES_PATH["Bills"]
      window.location.hash = pathname
      document.body.innerHTML = `<div id="root"></div>`
      Router()
      expect(screen.getByTestId("icon-window").classList.contains("active-icon")).toBe(true)
    })

    test("Then the bills should be ordered from latest to earliest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I click on the eye icon", () => {
    test("Then a modal should open", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))

      const billsContainer = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      })

      $.fn.modal = jest.fn()

      const eyeIcon = screen.getAllByTestId("icon-eye")[0]
      fireEvent.click(eyeIcon)

      expect($.fn.modal).toHaveBeenCalled()
    })
  })

  describe("When I click on the New Bill button", () => {
    test("Then the new bill form should display", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      const html = BillsUI({ data: [] })
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const bills = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })

      const button = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill(e))
      button.click('click', handleClickNewBill)
      fireEvent.click(button)

      expect(screen.getAllByText("Submit an expense report")).toBeTruthy()
    })
  })

  // Integration GET
  describe("Given I am connected as an admin", () => {

    test("Fetches bills from mock API (GET)", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })

    test("Fetches bills and fails with 404 error message", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Error 404"))
      )
      const html = BillsUI({ error: "Error 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Error 404/)
      expect(message).toBeTruthy()
    })

    test("Fetches bills and fails with 500 error message", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Error 500"))
      )
      const html = BillsUI({ error: "Error 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Error 500/)
      expect(message).toBeTruthy()
    })
  })
})







































































