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
// nodejs library to set properties for components
import React from "react";
import PropTypes from "prop-types";
// reactstrap components
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  DropdownItem,
  UncontrolledDropdown,
  Media,
  DropdownToggle,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  DropdownMenu,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { signOut } from "Redux/actions/auth.actions";

function CardsHeader({ name, parentName, cardsData }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const logOut = () => {
    dispatch(signOut());
    history.push("/auth");
  };
  return (
    <>
      <div className='header bg-primary pb-6'>
        <Container fluid>
          <div className='header-body'>
            <Row className='align-items-center py-4'>
              <Col lg='6' xs='7'>
                <h6 className='h2 text-white d-inline-block mb-0'>{name}</h6>{" "}
                <Breadcrumb
                  className='d-none d-md-inline-block ml-md-4'
                  listClassName='breadcrumb-links breadcrumb-dark'>
                  <BreadcrumbItem>
                    <a href='#pablo' onClick={(e) => e.preventDefault()}>
                      <i className='fas fa-home' />
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <a href='#pablo' onClick={(e) => e.preventDefault()}>
                      {parentName}
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current='page' className='active'>
                    {name}
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>
              <Col className='text-right' lg='6' xs='5'>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className='nav-link pr-0'
                    color='#ffff'
                    hover='white'
                    tag='a'>
                    <Media className='align-items-center'>
                      <span className='avatar avatar-sm rounded-circle'>
                        <img
                          alt='...'
                          src={require("assets/img/theme/avatar.png").default}
                        />
                      </span>
                      <Media className='ml-2 d-none d-lg-block'>
                        <span
                          className='mb-0 text-sm font-weight-bold '
                          style={{ color: "white" }}>
                          {authState.fullName}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem className='noti-title' header tag='div'>
                      <h6 className='text-overflow m-0'>Welcome!</h6>
                    </DropdownItem>

                    <DropdownItem
                      href=''
                      onClick={(e) => history.push("/admin/profile")}>
                      <i className='ni ni-settings-gear-65' />
                      <span>Settings</span>
                    </DropdownItem>

                    <DropdownItem divider />
                    <DropdownItem onClick={() => logOut()}>
                      <i className='ni ni-user-run' />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
            </Row>

            <Row>
              <Col md='6' xl='3'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'>
                          {cardsData?.card1Name}
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>
                          {cardsData?.card1Count}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                          <i className='ni ni-active-40' />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className='mt-3 mb-0 text-sm'>
                      <span className='text-success mr-2'>
                        <i className='fa fa-arrow-up' /> 3.48%
                      </span>{" "}
                      <span className='text-nowrap'>Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col md='6' xl='3'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'>
                          {cardsData?.card2Name}
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>
                          {cardsData?.card2Count}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-gradient-orange text-white rounded-circle shadow'>
                          <i className='ni ni-chart-pie-35' />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className='mt-3 mb-0 text-sm'>
                      <span className='text-success mr-2'>
                        <i className='fa fa-arrow-up' /> 3.48%
                      </span>{" "}
                      <span className='text-nowrap'>Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col md='6' xl='3'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'>
                          {cardsData?.card3Name}
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>
                          {cardsData?.card3Count}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-gradient-green text-white rounded-circle shadow'>
                          <i className='ni ni-money-coins' />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className='mt-3 mb-0 text-sm'>
                      <span className='text-success mr-2'>
                        <i className='fa fa-arrow-up' /> 3.48%
                      </span>{" "}
                      <span className='text-nowrap'>Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col md='6' xl='3'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'>
                          {cardsData?.card4Name}
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>
                          {" "}
                          {cardsData?.card4Count}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-gradient-primary text-white rounded-circle shadow'>
                          <i className='ni ni-chart-bar-32' />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className='mt-3 mb-0 text-sm'>
                      <span className='text-success mr-2'>
                        <i className='fa fa-arrow-up' /> 3.48%
                      </span>{" "}
                      <span className='text-nowrap'>Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

CardsHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
};

export default CardsHeader;
