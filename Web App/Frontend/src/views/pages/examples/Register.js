/*!

=========================================================
* Argon Dashboard PRO React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import AuthHeader from "components/Headers/AuthHeader.js";
import { useDispatch } from "react-redux";
import { signUp } from "../../../Redux/actions/auth.actions";
import { useHistory } from "react-router";

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [focusedName, setfocusedName] = useState(false);
  const [focusedEmail, setfocusedEmail] = useState(false);
  const [focusedPassword, setfocusedPassword] = useState(false);
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const formValues = {
      fullName: fullName,
      email: email,
      password: password,
    };
    const res = await dispatch(signUp(formValues));
    console.log(res);
    if (!res) {
      history.push("/login");
    }
  };
  return (
    <>
      <AuthHeader title='Create an account' lead='' />
      <Container className='mt--8 pb-5'>
        <Row className='justify-content-center'>
          <Col lg='6' md='8'>
            <Card className='bg-secondary border-0'>
              {/* <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-4">
                  <small>Sign up with</small>
                </div>
                <div className="text-center">
                  <Button
                    className="btn-neutral btn-icon mr-4"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon mr-1">
                      <img
                        alt="..."
                        src={
                          require("assets/img/icons/common/github.svg").default
                        }
                      />
                    </span>
                    <span className="btn-inner--text">Github</span>
                  </Button>
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon mr-1">
                      <img
                        alt="..."
                        src={
                          require("assets/img/icons/common/google.svg").default
                        }
                      />
                    </span>
                    <span className="btn-inner--text">Google</span>
                  </Button>
                </div>
              </CardHeader> */}
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <large>Sign up with credentials</large>
                </div>
                <Form role='form'>
                  <FormGroup
                    className={classnames({
                      focused: focusedName,
                    })}>
                    <InputGroup className='input-group-merge input-group-alternative mb-3'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-hat-3' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Full Name'
                        type='text'
                        onChange={(e) => {
                          setFullname(e.target.value);
                        }}
                        onFocus={() => setfocusedName(true)}
                        onBlur={() => setfocusedName(false)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedEmail,
                    })}>
                    <InputGroup className='input-group-merge input-group-alternative mb-3'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-email-83' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Email'
                        type='email'
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        onFocus={() => setfocusedEmail(true)}
                        onBlur={() => setfocusedEmail(false)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}>
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-lock-circle-open' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Password'
                        type='password'
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        onFocus={() => setfocusedPassword(true)}
                        onBlur={() => setfocusedPassword(false)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className='text-muted font-italic'>
                    <small>
                      password strength:{" "}
                      {password?.length > 5 ? (
                        <span className='text-success font-weight-700'>
                          strong
                        </span>
                      ) : (
                        <span className='text-warning font-weight-700'>
                          weak
                        </span>
                      )}
                    </small>
                  </div>
                  {/* <Row className='my-4'>
                    <Col xs='12'>
                      <div className='custom-control custom-control-alternative custom-checkbox'>
                        <input
                          className='custom-control-input'
                          id='customCheckRegister'
                          type='checkbox'
                        />
                        <label
                          className='custom-control-label'
                          htmlFor='customCheckRegister'>
                          <span className='text-muted'>
                            I agree with the{" "}
                            <a
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}>
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    </Col>
                  </Row> */}
                  <div className='text-center'>
                    <Button
                      onClick={handleSubmit}
                      className='mt-4'
                      color='info'
                      type='button'>
                      Create account
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Register;
