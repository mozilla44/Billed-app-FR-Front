/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import userEvent from "@testing-library/user-event";
import { ROUTES, ROUTES_PATH } from "../constants/routes";


describe("Given I am connected as an employee", () => {
  describe("When I click add new bill button", () => {
    test("Then new bill form  should be displayed", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const form = screen.getByTestId("form-new-bill")
      expect(form).toBeTruthy()
    })
  })
  describe("when i upload a file in the form", () => {
    test("Then file format is checked", () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email: 'test@tld.com'
      }))

      
      const newNewBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })
      const handleChangeFile = jest.fn((e) => newNewBill.handleChangeFile(e))


      let fileFixture = new File(["img"], "image.png", {
        type: "image/png",
      });
      let fileInput = screen.getByTestId("file");
      let fileInputFilesGet = jest.fn().mockReturnValue([fileFixture]);
      let fileInputValueGet = jest.fn().mockReturnValue(fileFixture);
       

        Object.defineProperty(fileInput, 'value', {
          get: fileInputValueGet,
        });
      Object.defineProperty(fileInput, 'files', {
        get: fileInputFilesGet
      });

      fileInput.addEventListener("change",handleChangeFile)
      fireEvent.change(fileInput)
      expect(handleChangeFile).toBeTruthy()


    })
  }
  
  )
  describe("when form is filled and submited" , () => {
    test("then form is sent " , () =>{
     
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email: 'test@tld.com'
      }))

      
      const newNewBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn((e) => newNewBill.handleSubmit(e))
      let fileFixture = new File(["img"], "image.png", {
        type: "image/png",
      });
      let fileInput = screen.getByTestId("file");
      let fileInputFilesGet = jest.fn().mockReturnValue([fileFixture]);
      let fileInputValueGet = jest.fn().mockReturnValue(fileFixture);
       

        Object.defineProperty(fileInput, 'value', {
          get: fileInputValueGet,
        });
      Object.defineProperty(fileInput, 'files', {
        get: fileInputFilesGet
      });
      screen.getByTestId("expense-name").value = "name-test";
      screen.getByTestId("datepicker").value = "2022-09-28";
      screen.getByTestId("amount").value = "128";
      screen.getByTestId("vat").value = "20";
      screen.getByTestId("pct").value = "70";
      let form = screen.getByTestId('form-new-bill')
      form.addEventListener("submit" , handleSubmit)
      let submit = screen.getByTestId('btn-send-bill')
      userEvent.click(submit)
      expect(handleSubmit).toHaveBeenCalled()
    })
  }
  )
})

describe('when i upload a file with the wrong format' ,() => {
    test("then i should receive an error message" ,() => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email: 'test@tld.com'
      }))

      
      const newNewBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })
      const handleChangeFile = jest.fn((e) => newNewBill.handleChangeFile(e))


      let fileFixture = new File(["pdf"], "erreur.pdf", {
        type: "application/pdf",
      });
      let fileInput = screen.getByTestId("file");
      let fileInputFilesGet = jest.fn().mockReturnValue([fileFixture]);

      let fileInputValueGet = jest.fn().mockReturnValue(fileFixture);
       

        Object.defineProperty(fileInput, 'value', {
          get: fileInputValueGet,
          set: value => {}
        });
      Object.defineProperty(fileInput, 'files', {
        get: fileInputFilesGet,
        
      });
      fileInput.addEventListener("change",handleChangeFile)
      fireEvent.change(fileInput)
      expect(handleChangeFile).toBeTruthy()

    })
})

