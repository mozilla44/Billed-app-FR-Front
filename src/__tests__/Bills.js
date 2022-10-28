/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store";
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect (windowIcon.classList.contains("active-icon"))

    })
    test("Then bills should be ordered from earliest to latest", async() => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const bills = new Bills({
        document, onNavigate, store: mockStore, localStorage: null
      })
       let result = await bills.getBills()
       let dates = result.map(bill =>bill.dates)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe("When i click on eye icon", () => {
    test("then a modal should display an image", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
     const billsContainer = new Bills({
      document, onNavigate, store: null, localStorage: null
     })
     document.body.innerHTML = BillsUI({data:bills})
     const icon = document.createElement("div");
     icon.setAttribute("data-bill-url", "img.png");
     billsContainer.handleClickIconEye(icon);
     const img = document.querySelector(".bill-proof-container img")

     expect(img.src).toBe("http://localhost/img.png")
     
    })
  })
})



// test d'intégration GET WIP
describe("Given I am a user connected as employe", () => {
  describe("When I am on bills page", () => {
    test("fetches bills from mock API GET", async () => {
      
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Dashboard)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
    
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur/)
      expect(message).toBeTruthy()
    })
  })

  })
})



