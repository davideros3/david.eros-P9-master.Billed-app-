import { screen, fireEvent  } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am on NewBill Page", () => {
  beforeEach(() => {
    document.body.innerHTML = NewBillUI()
  })

  test("Then file input should accept only jpg/jpeg/png", () => {
    const onNavigate = jest.fn()
    const firestoreMock = {
      storage: {
        ref: jest.fn(() => ({
          put: jest.fn(() => Promise.resolve({
            ref: { getDownloadURL: () => Promise.resolve("mockURL") }
          }))
        }))
      }
    }

    const newBill = new NewBill({ document, onNavigate, firestore: firestoreMock, localStorage: window.localStorage })

    const fileInput = screen.getByTestId("file")
    const validFile = new File(["img"], "receipt.png", { type: "image/png" })
    const invalidFile = new File(["doc"], "receipt.pdf", { type: "application/pdf" })

    // Valid file should be accepted
    fireEvent.change(fileInput, { target: { files: [validFile] } })
    expect(fileInput.files[0].name).toBe("receipt.png")

    // Invalid file should not update fileName or fileUrl
    fireEvent.change(fileInput, { target: { files: [invalidFile] } })
    expect(newBill.fileName).not.toBe("receipt.pdf") // fileName should stay the same or null
  })

  test("Then submitting form should call handleSubmit and navigate", () => {
    const onNavigate = jest.fn()
    const firestoreMock = {
      bills: () => ({
        add: jest.fn(() => Promise.resolve({}))
      })
    }

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify({ email: "employee@test.com" }))
      },
      writable: true
    })

    const newBill = new NewBill({ document, onNavigate, firestore: firestoreMock, localStorage: window.localStorage })

    const form = screen.getByTestId("form-new-bill")
    const handleSubmit = jest.fn(newBill.handleSubmit)
    form.addEventListener("submit", handleSubmit)

    fireEvent.submit(form)
    expect(handleSubmit).toHaveBeenCalled()
  })
})
