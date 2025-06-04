import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import DashboardFormUI from "../views/DashboardFormUI.js"
import DashboardUI from "../views/DashboardUI.js"
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import { bills } from "../fixtures/bills"

describe('Given I am connected as an Admin', () => {
  describe('When I am on the Dashboard page, there are bills, and one is pending', () => {
    test('Then, filteredBills by "pending" status should return 1 bill', () => {
      const filtered_bills = filteredBills(bills, "pending")
      expect(filtered_bills.length).toBe(1)
    })
  })

  describe('When I am on the Dashboard page, there are bills, and one is accepted', () => {
    test('Then, filteredBills by "accepted" status should return 1 bill', () => {
      const filtered_bills = filteredBills(bills, "accepted")
      expect(filtered_bills.length).toBe(1)
    })
  })

  describe('When I am on the Dashboard page, there are bills, and two are refused', () => {
    test('Then, filteredBills by "refused" status should return 2 bills', () => {
      const filtered_bills = filteredBills(bills, "refused")
      expect(filtered_bills.length).toBe(2)
    })
  })

  describe('When I am on the Dashboard page and it is loading', () => {
    test('Then, the Loading page should be displayed', () => {
      const html = DashboardUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })

  describe('When I am on the Dashboard page and the back-end sends an error message', () => {
    test('Then, the Error page should be displayed', () => {
      const html = DashboardUI({ error: 'Some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Error')).toBeTruthy()
    })
  })

  describe('When I am on the Dashboard page and I click on an arrow icon', () => {
    test('Then, the tickets list should expand and the cards should contain first and last names', async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const dashboard = new Dashboard({
        document, onNavigate, firestore: null, bills, localStorage: window.localStorage
      })
      const html = DashboardUI({ data: bills })
      document.body.innerHTML = html

      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
      const handleShowTickets2 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 2))
      const handleShowTickets3 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 3))

      const icon1 = screen.getByTestId('arrow-icon1')
      const icon2 = screen.getByTestId('arrow-icon2')
      const icon3 = screen.getByTestId('arrow-icon3')

      icon1.addEventListener('click', handleShowTickets1)
      userEvent.click(icon1)
      expect(handleShowTickets1).toHaveBeenCalled()
      userEvent.click(icon1)

      icon2.addEventListener('click', handleShowTickets2)
      userEvent.click(icon2)
      expect(handleShowTickets2).toHaveBeenCalled()

      icon3.addEventListener('click', handleShowTickets3)
      userEvent.click(icon3)
      expect(handleShowTickets3).toHaveBeenCalled()
    })
  })

  describe('When I click on the edit icon of a card', () => {
    test('Then, the correct form should be filled', () => {
      const html = cards(bills)
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleEditTicket = jest.fn((e) => dashboard.handleEditTicket(e, bills[0], bills))
      const iconEdit = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      iconEdit.addEventListener('click', handleEditTicket)
      userEvent.click(iconEdit)
      expect(handleEditTicket).toHaveBeenCalled()
      userEvent.click(iconEdit)
      expect(handleEditTicket).toHaveBeenCalled()
    })
  })

  describe('When there are no bills on the Dashboard page', () => {
    test('Then, no cards should be shown', () => {
      const html = cards([])
      document.body.innerHTML = html

      const iconEdit = screen.queryByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      expect(iconEdit).toBeNull()
    })
  })
})

describe('Given I am connected as Admin and on Dashboard page and clicked a pending bill', () => {
  describe('When I click the accept button', () => {
    test('Then I should be redirected to the Dashboard and see the big billed icon instead of the form', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Admin' }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleAcceptSubmit = jest.fn((e) => dashboard.handleAcceptSubmit(e, bills[0]))
      const acceptButton = screen.getByTestId("btn-accept-bill-d")
      acceptButton.addEventListener("click", handleAcceptSubmit)
      fireEvent.click(acceptButton)
      expect(handleAcceptSubmit).toHaveBeenCalled()

      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })

  describe('When I click the refuse button', () => {
    test('Then I should be redirected to the Dashboard and see the big billed icon instead of the form', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Admin' }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleRefuseSubmit = jest.fn((e) => dashboard.handleRefuseSubmit(e, bills[0]))
      const refuseButton = screen.getByTestId("btn-refuse-bill-d")
      refuseButton.addEventListener("click", handleRefuseSubmit)
      fireEvent.click(refuseButton)
      expect(handleRefuseSubmit).toHaveBeenCalled()

      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
})

describe('Given I am connected as Admin and on Dashboard page and I clicked a bill', () => {
  describe('When I click the eye icon', () => {
    test('Then a modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Admin' }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye)
      const eye = screen.getByTestId('icon-eye-d')
      $.fn.modal = jest.fn() // required for Bootstrap modal mocking
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modal = screen.getByTestId('modaleFileAdmin')
      expect(modal).toBeTruthy()
    })
  })
})

// Integration test - GET
describe("Given I am connected as Admin", () => {
  describe("When I navigate to the Dashboard", () => {
    test("It fetches bills from the mock API (GET)", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })

    test("It fetches bills and fails with a 404 error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Error 404"))
      )
      const html = DashboardUI({ error: "Error 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Error 404/)
      expect(message).toBeTruthy()
    })

    test("It fetches bills and fails with a 500 error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Error 500"))
      )
      const html = DashboardUI({ error: "Error 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Error 500/)
      expect(message).toBeTruthy()
    })
  })
})











































































