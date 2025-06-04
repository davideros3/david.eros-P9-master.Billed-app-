import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { screen } from "@testing-library/dom"

const data = []
const loading = false
const error = null

describe('Given I am connected and I am on some page of the app', () => {
  describe('When I navigate to the Login page', () => {
    test('Then it should render the Login page', () => {
      const pathname = ROUTES_PATH['Login']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
      })
      document.body.innerHTML = html
      expect(screen.getAllByText('Administration')).toBeTruthy()
    })
  })

  describe('When I navigate to the Bills page', () => {
    test('Then it should render the Bills page', () => {
      const pathname = ROUTES_PATH['Bills']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
      })
      document.body.innerHTML = html
      expect(screen.getAllByText('My expense reports')).toBeTruthy()
    })
  })

  describe('When I navigate to the NewBill page', () => {
    test('Then it should render the NewBill page', () => {
      const pathname = ROUTES_PATH['NewBill']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
      })
      document.body.innerHTML = html
      expect(screen.getAllByText('Submit an expense report')).toBeTruthy()
    })
  })

  describe('When I navigate to the Dashboard page', () => {
    test('Then it should render the Dashboard page', () => {
      const pathname = ROUTES_PATH['Dashboard']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
      })
      document.body.innerHTML = html
      expect(screen.getAllByText('Approvals')).toBeTruthy()
    })
  })

  describe('When I navigate to a non-existent route', () => {
    test('Then it should fallback to rendering the Login page', () => {
      const pathname = '/anywhere-else'
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
      })
      document.body.innerHTML = html
      expect(screen.getAllByText('Administration')).toBeTruthy()
    })
  })
})






