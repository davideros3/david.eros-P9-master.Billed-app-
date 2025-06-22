import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage";
import firebase from "../__mocks__/firebase";
import DashboardUI from "../views/DashboardUI";
import BillsUI from "../views/BillsUI";

jest.mock("../app/Firestore");

describe("Given that I am logged in as an employee", () => {
  describe("When I am on the NewBill page", () => {
    describe("And I choose a file to upload", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      jest.spyOn(window, "alert").mockImplementation(() => {});
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      let firestore = null;
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const input = screen.getByTestId("file");
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      input.addEventListener("change", handleChangeFile);
      const falseAlert = jest.fn(newBill.alertExtension);

      test("should be retained after upload if the format is correct", async () => {
        const file = new File(["test file"], "testFile.jpg", {
          type: "image/jpg",
        });
        fireEvent.change(input, { target: { files: [file] } });
        await handleChangeFile;
        expect(handleChangeFile).toHaveBeenCalled();
        expect(input.files[0]).toStrictEqual(file);
        expect(falseAlert).not.toHaveBeenCalled();
      });

      test("should not be retained after upload and trigger an alert if the format is incorrect", async () => {
        const file = new File(["test file"], "testFile.txt", {
          type: "text/plain",
        });
        const spy = jest.spyOn(newBill, "alertExtension");

        fireEvent.change(input, { target: { files: [file] } });
        await handleChangeFile;

        expect(handleChangeFile).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(input.value).toBe("");
      });
    });

    describe("When I click on the Submit button with valid input", () => {
      test("should default to 20 if the pct field is empty", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee" })
        );

        const newBill = new NewBill({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        });

        screen.getByTestId("expense-name").value = "test";
        screen.getByTestId("datepicker").value = "2020-12-01";
        screen.getByTestId("amount").value = "100";
        screen.getByTestId("vat").value = "10";
        screen.getByTestId("pct").value = ""; 
        screen.getByTestId("commentary").value = "Test comment";

        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn(newBill.handleSubmit);
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalled();
        
      });

      test("my new Bill should be submitted and I should be navigated back to the Bills page", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const inputData = {
          type: "Transports",
          name: "test",
          amount: "100",
          date: "2020-12-01",
          vat: "10",
          pct: "20",
          commentary: "ok",
          fileURL: "thisURL",
          fileName: "thisName",
        };
        const type = screen.getByTestId("expense-type");
        userEvent.selectOptions(type, screen.getAllByText("Transports"));
        expect(type.value).toBe(inputData.type);

        const name = screen.getByTestId("expense-name");
        fireEvent.change(name, { target: { value: inputData.name } });
        expect(name.value).toBe(inputData.name);

        const date = screen.getByTestId("datepicker");
        fireEvent.change(date, { target: { value: inputData.date } });
        expect(date.value).toBe(inputData.date);

        const vat = screen.getByTestId("vat");
        fireEvent.change(vat, { target: { value: inputData.vat } });
        expect(vat.value).toBe(inputData.vat);

        const pct = screen.getByTestId("pct");
        fireEvent.change(pct, { target: { value: inputData.pct } });
        expect(pct.value).toBe(inputData.pct);

        const comment = screen.getByTestId("commentary");
        fireEvent.change(comment, { target: { value: inputData.commentary } });
        expect(comment.value).toBe(inputData.commentary);

        const submitNewBill = screen.getByTestId("form-new-bill");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const firestore = null;
        const newBill = new NewBill({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage,
        });
        const handleSubmit = jest.fn(newBill.handleSubmit);
        submitNewBill.addEventListener("submit", handleSubmit);
        fireEvent.submit(submitNewBill);
        expect(handleSubmit).toHaveBeenCalled();
        expect(screen.getAllByText("New expense report")).toBeTruthy();
      });
    });
  });
});

// POST integration test

describe("Given that I am logged in as an Employee", () => {
  describe("When I create a new Bill", () => {
    test("Add bill to mock API POST", async () => {
      const getSpyPost = jest.spyOn(firebase, "post");
      const newBill = {
        id: "hkdfshfJHJHjdkaJHD",
        status: "refused",
        pct: 15,
        amount: 400,
        email: "john@doe.com",
        name: "number 5",
        vat: "60",
        fileName: "pdf-1.jpg",
        date: "2021-03-13",
        commentAdmin: "Valid",
        commentary: "Meeting",
        type: "Restaurants",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3",
      };
      const bills = await firebase.post(newBill);
      expect(getSpyPost).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(5);
    });

    test("Add bill to API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Error 404"))
      );
      const html = BillsUI({ error: "Error 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Error 404/);
      expect(message).toBeTruthy();
    });

    test("Add bill to API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Error 500")) //
      );
      const html = BillsUI({ error: "Error 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Error 500/);
      expect(message).toBeTruthy();
    });
  });
});
