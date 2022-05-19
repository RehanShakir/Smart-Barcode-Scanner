import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

import { useSelector, useDispatch } from "react-redux";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import {
  getScannedCountLoggedInUser,
  getCounts,
} from "../../../Axios/apiFunctions";
import { useQuery } from "react-query";
import { updateUserProfile } from "Redux/actions/auth.actions";
import { notification } from "antd";

// core components
// import ProfileHeader from "components/Headers/ProfileHeader.js";

function Profile() {
  const [disabled, setDisabled] = useState(true);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [fullName, setFullname] = useState(authState.fullName);
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [email, setEmail] = useState(authState.email);

  const { data } = useQuery(
    authState.role === "admin" ? "getCount" : "getScannedCountLoggedInUser",
    () =>
      authState.role === "admin" ? getCounts() : getScannedCountLoggedInUser()
  );

  const handleSubmit = async () => {
    if (!oldPassword) {
      notification["error"]({
        message: "Old Password is required to update your account",
      });
      return;
    }
    await dispatch(
      updateUserProfile({
        fullName: fullName ? fullName : authState.fullName,
        email: email ? email : authState.email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
    );
  };

  return (
    <>
      <SimpleHeader
        name={authState.role === "admin" ? "Admin" : "Client"}
        parentName='Settings'
      />

      <Container className='mt--6' fluid>
        <Row>
          <Col className='order-xl-2' xl='4'>
            <Card className='card-profile'>
              <CardImg
                alt='...'
                src={require("assets/img/theme/img-1-1000x600.jpg").default}
                top
              />
              <Row className='justify-content-center'>
                <Col className='order-lg-2' lg='3'>
                  <div className='card-profile-image'>
                    <a href='#pablo' onClick={(e) => e.preventDefault()}>
                      <img
                        alt='...'
                        className='rounded-circle'
                        src={require("assets/img/theme/avatar.png").default}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className='text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4'>
                {/* <div className='d-flex justify-content-between'>
                  <Button
                    className='mr-4'
                    color='info'
                    href='#pablo'
                    onClick={(e) => e.preventDefault()}
                    size='sm'>
                    Connect
                  </Button>
                  <Button
                    className='float-right'
                    color='default'
                    href='#pablo'
                    onClick={(e) => e.preventDefault()}
                    size='sm'>
                    Message
                  </Button>
                </div> */}
              </CardHeader>
              <CardBody className='pt-0'>
                <Row>
                  <div className='col'>
                    <div className='card-profile-stats d-flex justify-content-center'>
                      {/* <div>
                        <span className='heading'>22</span>
                        <span className='description'>Friends</span>
                      </div>
                      <div>
                        <span className='heading'>10</span>
                        <span className='description'>Photos</span>
                      </div>
                      <div>
                        <span className='heading'>89</span>
                        <span className='description'>Comments</span>
                      </div> */}
                    </div>
                  </div>
                </Row>
                <div className='text-center'>
                  <h5 className='h3'>
                    {authState.fullName}
                    {/* <span className='font-weight-light'>, 27</span> */}
                  </h5>
                  <div className='h5 font-weight-300'>
                    <i className='ni location_pin mr-2' />
                    {authState.email}
                  </div>
                  <div className='h5 mt-4'>
                    <i className='ni business_briefcase-24 mr-2' />
                    {authState.role === "client"
                      ? "Assigned Insurances" +
                        " " +
                        authState.assignedButtons?.map((d) => {
                          return d.value;
                        })
                      : ""}
                  </div>
                  <div className='h5 mt-4'>
                    <i className='ni business_briefcase-24 mr-2' />
                    {authState.role.toUpperCase()} ACCOUNT
                  </div>
                  {/* <div>
                    <i className='ni education_hat mr-2' />
                    University of Computer Science
                  </div> */}
                </div>
              </CardBody>
            </Card>

            {/* <Card>
              <CardHeader>
                <h5 className='h3 mb-0'>Progress track</h5>
              </CardHeader>

              <CardBody>
                <ListGroup className='list my--3' flush>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}>
                          <img
                            alt='...'
                            src={
                              require("assets/img/theme/bootstrap.jpg").default
                            }
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Argon Design System</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='60'
                          color='warning'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}>
                          <img
                            alt='...'
                            src={
                              require("assets/img/theme/angular.jpg").default
                            }
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Angular Now UI Kit PRO</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='100'
                          color='success'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}>
                          <img
                            alt='...'
                            src={require("assets/img/theme/sketch.jpg").default}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Black Dashboard</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='72'
                          color='danger'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}>
                          <img
                            alt='...'
                            src={require("assets/img/theme/react.jpg").default}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>React Material Dashboard</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='90'
                          color='info'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}>
                          <img
                            alt='...'
                            src={require("assets/img/theme/vue.jpg").default}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Vue Paper UI Kit PRO</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='100'
                          color='success'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card> */}
          </Col>
          <Col className='order-xl-1' xl='8'>
            <Row>
              <Col lg='6'>
                <Card className='bg-gradient-success border-0'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          className='text-uppercase text-muted mb-0 text-white'
                          tag='h5'>
                          Total Scanned Barcodes
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0 text-white'>
                          {authState.role === "admin"
                            ? data?.data?.scannedBarcodes
                            : data?.data?.count}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-white text-dark rounded-circle shadow'>
                          <i className='ni ni-active-40' />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className='mt-3 mb-0 text-sm'>
                      <span className='text-white mr-2'>
                        <i className='fa fa-arrow-up' />
                        3.48%
                      </span>
                      <span className='text-nowrap text-light'>
                        Since last month
                      </span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col lg='6'>
                <Card className='bg-gradient-danger border-0' tag='h5'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle className='text-uppercase text-muted mb-0 text-white'>
                          Account Status
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0 text-white'>
                          Approved
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-white text-dark rounded-circle shadow'>
                          <i className='ni ni-spaceship' />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className='mt-3 mb-0 text-sm'>
                      <span className='text-white mr-2'>
                        <i className='fa fa-arrow-up' />
                        3.48%
                      </span>
                      <span className='text-nowrap text-light'>
                        Since last month
                      </span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Card>
              <CardHeader>
                <Row className='align-items-center'>
                  <Col xs='8'>
                    <h3 className='mb-0'>Edit profile</h3>
                  </Col>
                  <Col className='text-right' xs='4'>
                    <Button
                      color='primary'
                      onClick={() =>
                        disabled ? setDisabled(false) : setDisabled(true)
                      }
                      size='sm'>
                      Edit
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className='heading-small text-muted mb-4'>
                    User information
                  </h6>
                  <div className='pl-lg-4'>
                    <Row>
                      <Col lg='6'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-username'>
                            Username
                          </label>
                          <Input
                            defaultValue={authState.fullName}
                            id='input-username'
                            placeholder='Username'
                            type='text'
                            disabled={disabled}
                            onChange={(e) => setFullname(e.target.value)}
                          />
                        </FormGroup>
                      </Col>

                      <Col lg='6'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-email'>
                            Email address
                          </label>
                          <Input
                            defaultValue={authState.email}
                            id='input-email'
                            placeholder='jesse@example.com'
                            type='email'
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            disabled={disabled}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg='6'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-email'>
                            Old Password
                          </label>
                          <Input
                            // defaultValue={authState.email}
                            id='input-email'
                            placeholder='*****'
                            type='password'
                            disabled={disabled}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg='6'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-email'>
                            New Password
                          </label>
                          <Input
                            // defaultValue={authState.email}
                            id='input-email'
                            placeholder='*****'
                            type='password'
                            disabled={disabled}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <Button
                          color='primary'
                          type='button'
                          onClick={handleSubmit}
                          disabled={disabled}>
                          Update
                        </Button>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col lg='6'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-first-name'>
                            First name
                          </label>
                          <Input
                            defaultValue='Lucky'
                            id='input-first-name'
                            placeholder='First name'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                      <Col lg='6'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-last-name'>
                            Last name
                          </label>
                          <Input
                            defaultValue='Jesse'
                            id='input-last-name'
                            placeholder='Last name'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                  </div>
                  <hr className='my-4' />

                  {/* <h6 className='heading-small text-muted mb-4'>
                    Contact information
                  </h6>
                  <div className='pl-lg-4'>
                    <Row>
                      <Col md='12'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-address'>
                            Address
                          </label>
                          <Input
                            defaultValue='Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09'
                            id='input-address'
                            placeholder='Home Address'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg='4'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-city'>
                            City
                          </label>
                          <Input
                            defaultValue='New York'
                            id='input-city'
                            placeholder='City'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                      <Col lg='4'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-country'>
                            Country
                          </label>
                          <Input
                            defaultValue='United States'
                            id='input-country'
                            placeholder='Country'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                      <Col lg='4'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-country'>
                            Postal code
                          </label>
                          <Input
                            id='input-postal-code'
                            placeholder='Postal code'
                            type='number'
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className='my-4' />

                  <h6 className='heading-small text-muted mb-4'>About me</h6>
                  <div className='pl-lg-4'>
                    <FormGroup>
                      <label className='form-control-label'>About Me</label>
                      <Input
                        placeholder='A few words about you ...'
                        rows='4'
                        type='textarea'
                        defaultValue='A beautiful premium dashboard for Bootstrap 4.'
                      />
                    </FormGroup>
                  </div> */}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
