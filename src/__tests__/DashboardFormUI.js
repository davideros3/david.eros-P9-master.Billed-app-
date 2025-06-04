import { screen } from "@testing-library/dom"
import DashboardFormUI from "../views/DashboardFormUI.js"
import { formatDate } from "../app/format.js"

const bill = {
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "accepted",
  "type": "Hôtel et logement",
  "commentAdmin": "ok",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": 400,
  "email": "a@a",
  "pct": 20
}

const billAccepted = {
  ...bill,
  "status": "accepted"
}

const billPending = {
  ...bill,
  "status": "pending"
}

const billRefused = {
  ...bill,
  "status": "refused"
}

describe('Given I am connected as an Admin and I am on the Dashboard Page', () => {
  describe('When bill data is passed to DashboardUI', () => {
    test('Then, it should display the bill data on the page', () => {
      const html = DashboardFormUI(bill)
      document.body.innerHTML = html
      expect(screen.getByText(bill.vat)).toBeTruthy()
      expect(screen.getByText(bill.type)).toBeTruthy()
      expect(screen.getByText(bill.commentary)).toBeTruthy()
      expect(screen.getByText(bill.name)).toBeTruthy()
      expect(screen.getByText(bill.fileName)).toBeTruthy()
      expect(screen.getByText(formatDate(bill.date))).toBeTruthy()
      expect(screen.getByText(bill.amount.toString())).toBeTruthy()
      expect(screen.getByText(bill.pct.toString())).toBeTruthy()
    })
  })

  describe('When a pending bill is passed to DashboardUI', () => {
    test('Then, it should show Accept and Refuse buttons and the text area', () => {
      const html = DashboardFormUI(billPending)
      document.body.innerHTML = html
      expect(screen.getByText("Accept")).toBeTruthy()
      expect(screen.getByText("Refuse")).toBeTruthy()
      expect(screen.getByTestId("commentary2")).toBeTruthy()
    })
  })

  describe('When an accepted bill is passed to DashboardUI', () => {
    test('Then, it should show the admin commentary', () => {
      const html = DashboardFormUI(billAccepted)
      document.body.innerHTML = html
      expect(screen.getByText(bill.commentAdmin)).toBeTruthy()
    })
  })

  describe('When a refused bill is passed to DashboardUI', () => {
    test('Then, it should show the admin commentary', () => {
      const html = DashboardFormUI(billRefused)
      document.body.innerHTML = html
      expect(screen.getByText(bill.commentAdmin)).toBeTruthy()
    })
  })
})
























































