/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";


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

      const newNewBill = new NewBill({
        document, onNavigate, store: null, localStorage: null
      })


      let fileFixture = new File(["img"], "image.png", {
        type: "image/png",
      });
      let fileInput = screen.getAllByTestId("file");
      let fileInputFilesGet = jest.fn().mockReturnValue([fileFixture]);
      Object.defineProperty(fileInput, 'files', {
        get: fileInputFilesGet
      });

      newNewBill.handleChangeFile(new Event("change"));


      expect(handleChangeFile).toHaveBeenBeCalled();


    })
    test("Then file is sent to server", () => {
    });
  })
})
