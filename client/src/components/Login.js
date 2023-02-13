import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/esm/Container';
import { useNavigate } from 'react-router-dom'

function Login(){
    const navigate = useNavigate();
    let [email, setEmail] = useState('')

    useEffect(() => {
      localStorage.setItem('email', JSON.stringify(email));
    }, [email]);

    return (
      <Row className='vh-100 justify-content-center' >
        <Form className='w-50 mx-auto p-5 m-5'>
            <h3>Login</h3>
          <Form.Group className="mb-3 align-middle" controlId="formBasicEmail" >
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="email"  onChange={(e)=>setEmail(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={()=> {navigate('/profile');window.location.reload()}}>Login</Button>
        </Form>
        </Row>
      );
}

export default Login