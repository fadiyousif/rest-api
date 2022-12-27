process.env.NODE_ENV = "test"

const chai = require("chai")
const chaiHttp = require("chai-http")
const { expect } = require("chai")

const app = require("../app")
const employees = require("../data/employees.json")

chai.use(chaiHttp)

describe("Employees", () => {
  const url = "/api/employees"
  describe(`GET ${url}`, () => {
    it("returns a list of all employees\n", () => {
      chai
        .request(app)
        .get(url)
        .end((_err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.header["content-type"]).to.include("application/json")
          expect(res.body).to.be.an("array").with.lengthOf(employees.length)

          if (employees.length > 0) {
            res.body.forEach((employee) => {
              expect(employee)
                .to.have.property("firstName")
                .that.matches(/[a-z]/i)
                .but.not.match(/[0-9]/)
              expect(employee)
                .to.have.property("lastName")
                .that.matches(/[a-z]/i)
                .but.not.match(/[0-9]/)
              expect(employee)
                .to.have.property("email")
                .that.matches(/^\S+@\S+\.\S+$/)
              expect(employee)
                .to.have.property("id")
                .that.matches(/[0-9]/)
                .but.not.match(/[^0-9]/)
            })
          }
        })
    })
  })

  describe(`POST ${url}`, () => {
    describe("given an invalid payload", () => {
      it("validates payload, returns 400 status code + error message", () => {
        chai
          .request(app)
          .post(url)
          .send({ firstName: "Jason", lastName: "Green" })
          .end((_err, res) => {
            expect(res.statusCode).to.equal(400)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({
              error:
                "Invalid payload. Provide an object that strictly contains first name, last name, and email address",
            })
          })
      })
    })

    describe("given an invalid email address", () => {
      it("validates email, returns 400 status code + error message", () => {
        const email = "jasongreen@gmail."

        chai
          .request(app)
          .post(url)
          .send({
            firstName: "Jason",
            lastName: "Green",
            email,
          })
          .end((_err, res) => {
            expect(res.statusCode).to.equal(400)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({
              error: `${email} is invalid. Provide a valid email address.`,
            })
          })
      })
    })

    describe("given an already registered email address", () => {
      it("validates email, returns 403 status code + error message", () => {
        const email = employees[0].email

        chai
          .request(app)
          .post(url)
          .send({
            firstName: "Jason",
            lastName: "Green",
            email,
          })
          .end((_err, res) => {
            expect(res.statusCode).to.equal(403)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({ error: `${email} is already registered` })
          })
      })
    })

    describe("given a name that contains numbers", () => {
      it("validates name, returns 400 status code + error message", () => {
        chai
          .request(app)
          .post(url)
          .send({
            firstName: "Jason123",
            lastName: "Green",
            email: "jasongreen@gmail.com",
          })
          .end((_err, res) => {
            expect(res.statusCode).to.equal(400)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({
              error: "Invalid first or last name. Numbers are not allowed.",
            })
          })
      })
    })

    describe("given a name less than two characters long", () => {
      it("validates name, returns 400 status code + error message", () => {
        chai
          .request(app)
          .post(url)
          .send({
            firstName: "J",
            lastName: "Green",
            email: "jasongreen@gmail.com",
          })
          .end((_err, res) => {
            expect(res.statusCode).to.equal(400)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({
              error:
                "Invalid first or last name. Each name must be at least two characters long.",
            })
          })
      })
    })

    describe("given a valid payload", () => {
      it("creates a new employee\n", () => {
        const prevLength = employees.length

        chai
          .request(app)
          .post(url)
          .send({
            firstName: "Jason",
            lastName: "Green",
            email: "jasongreen@gmail.com",
          })
          .end((_err, res) => {
            expect(res.statusCode).to.equal(201)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body)
              .to.be.an("object")
              .which.has.all.keys("firstName", "lastName", "email", "id")
            expect(employees.length).to.equal(prevLength + 1)
          })
      })
    })
  })

  describe(`DELETE ${url}/:id`, () => {
    describe("given a non-integer id", () => {
      it("validates id and return 400 status code + error message", () => {
        const id = Math.random()

        chai
          .request(app)
          .delete(`${url}/${id}`)
          .end((_err, res) => {
            expect(res.statusCode).to.equal(400)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({
              error: `Invalid input. ID must be an integer.`,
            })
          })
      })
    })

    describe("given a non-existent id", () => {
      it("returns 404 status code + error message", () => {
        const id = employees[employees.length - 1]["id"] + 1

        chai
          .request(app)
          .delete(`${url}/${id}`)
          .end((_err, res) => {
            expect(res.statusCode).to.equal(404)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({ error: `Employee ${id} not found` })
          })
      })
    })

    describe("given a valid existing id", () => {
      it("deletes the employee", () => {
        const id = employees[employees.length - 1]["id"]
        const prevLength = employees.length

        chai
          .request(app)
          .delete(`${url}/${id}`)
          .end((_err, res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.header["content-type"]).to.include("application/json")
            expect(res.body).to.eql({
              success: `Employee ${id} has been deleted`,
            })
            expect(employees.length).to.equal(prevLength - 1)
          })
      })
    })
  })
})
