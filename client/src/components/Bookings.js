import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { useNavigate } from "react-router-dom"
import Container from "react-bootstrap/esm/Container"
import Modal from "react-bootstrap/Modal"
function Bookings() {
  const navigate = useNavigate()
  let [bookingId, setbookingId] = useState("")
  let [email, setEmail] = useState(
    JSON.parse(localStorage.getItem("email")) || ""
  )
  const [userBookings, setUserBookings] = useState([])

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  let getAllUserBookings = async () => {
    try {
      const res = await fetch(`/api/booking?customer_email=${email}`)
      const userBookings = await res.json()
      setUserBookings(userBookings)
      return userBookings
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    email && getAllUserBookings()
  }, [email, show])

  async function generateInvoice(e) {
    try {
      const bookingId = e.target.name
      const res = await fetch(`/api/invoice?id=${bookingId}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      )
      window.open(url, "_blank")
    } catch (e) {
      console.log(e)
    }
  }

  async function cancelBooking() {
    try {
      const res = await fetch(`/api/booking`, {
        method: "PUT",
        body: JSON.stringify({ id: bookingId }),
        headers: { "Content-type": "application/json charset=UTF-8" },
      })
      const msg = await res.json()
      handleClose()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container className="w-75">
      <Row className="my-2 px-3 h-50">
        <Col className="fs-3 text-center font-weight-bold ">
          <span>Your Bookings</span>
        </Col>
        <h4 className="my-3 text-center">CURRENT</h4>
        {userBookings.length ? (
          userBookings.map((item, idx) => {
            if (
              Date.parse(item.check_out.$date) > Date.now() &&
              !item.isCancelled
            ) {
              return (
                <Card
                  className="my-2 bg-light  mx-auto"
                  height="2rem"
                  key={idx}
                >
                  <Card.Body>
                    <Row>
                      <Col sm={9}>
                        <Card.Title>Guest Name: {item.guest_name}</Card.Title>
                        <p className="my-1">
                          <span>Registered Email: </span>
                          {item.customer_email}
                        </p>
                        <p className="my-1">
                          <span>Date: </span>
                          {new Date(item.check_in.$date.split("T")[0]).toDateString()}{" "}
                          <span>To</span>{" "}
                          {new Date(item.check_out.$date.split("T")[0]).toDateString()}
                        </p>
                        <p className="my-1">
                          <span>Total Amount: ₹ </span>
                          {item.total_amount}/-
                        </p>
                      </Col>
                      <Col>
                        <Button
                          className="my-3"
                          name={item._id["$oid"]}
                          onClick={generateInvoice}
                        >
                          Invoice
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="danger"
                          name={item._id["$oid"]}
                          className="my-3"
                          onClick={(e) => {
                            setbookingId(e.target.name)
                            handleShow()
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )
            }
          })
        ) : (
          <p className="text-center">None</p>
        )}

        <h4 className="my-3 text-center">PREVIOUS</h4>
        {userBookings.length ? (
          userBookings.map((item, idx) => {
            if (
              Date.parse(item.check_out.$date) < Date.now() ||
              item.isCancelled
            ) {
              return (
                <Card
                  className="my-2 bg-light  mx-auto"
                  height="2rem"
                  key={idx}
                >
                  <Card.Body>
                    <Row>
                      <Col sm={9}>
                        <Card.Title>Guest Name: {item.guest_name}</Card.Title>
                        <p className="my-1">
                          <span>Registered Email: </span>
                          {item.customer_email}
                        </p>
                        <p className="my-1">
                          <span>Date: </span>
                          {new Date(item.check_in.$date.split("T")[0]).toDateString()}{" "}
                          <span>To</span>{" "}
                          {new Date(item.check_out.$date.split("T")[0]).toDateString()}
                        </p>
                        <p className="my-1">
                          <span>Total Amount: ₹ </span>
                          {item.total_amount}/-
                        </p>
                      </Col>
                      <Col>
                        {!item.isCancelled ? (
                          <Button
                            variant="info"
                            onClick={() =>
                              navigate(`/review/${item._id["$oid"]}`)
                            }
                          >
                            Review
                          </Button>
                        ) : (
                          <Button
                            role="button"
                            variant="secondary"
                            disabled
                            className="align-middle"
                          >
                            Cancelled
                          </Button>
                        )}
                      </Col>
                      <Col>
                        <Button
                          name={item._id["$oid"]}
                          onClick={generateInvoice}
                        >
                          Invoice
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )
            }
          })
        ) : (
          <p className="text-center">None</p>
        )}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm cancel</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel? </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={cancelBooking}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Bookings
