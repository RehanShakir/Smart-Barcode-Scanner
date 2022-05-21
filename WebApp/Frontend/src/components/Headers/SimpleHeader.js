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
import PropTypes from "prop-types";
// reactstrap components
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Container,
  Row,
  Col,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "Redux/actions/auth.actions";
import { useHistory } from "react-router-dom";

function TimelineHeader({ name, parentName }) {
  const history = useHistory();

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(signOut());
    history.push("/auth");
  };
  return (
    <>
      <div className='header header-dark bg-primary pb-6 content__title content__title--calendar'>
        <Container fluid>
          <div className='header-body'>
            <Row className='align-items-center py-4'>
              <Col lg='6' xs='7'>
                <h6 className='fullcalendar-title h2 text-white d-inline-block mb-0'>
                  {name}
                </h6>{" "}
                <Breadcrumb
                  className='d-none d-md-inline-block ml-lg-4'
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
              <Col className='mt-3 mt-md-3 text-md-right' lg='6' xs='5'>
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
                      onClick={(e) => history.push("/client/profile")}>
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
          </div>
        </Container>
      </div>
    </>
  );
}

TimelineHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
};

export default TimelineHeader;
