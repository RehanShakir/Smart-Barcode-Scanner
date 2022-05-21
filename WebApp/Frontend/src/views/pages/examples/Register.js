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
import { Modal, Radio, notification } from "antd";

function Register() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const [focusedName, setfocusedName] = useState(false);
  const [focusedEmail, setfocusedEmail] = useState(false);
  const [focusedPassword, setfocusedPassword] = useState(false);
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [value, setValue] = React.useState(true);

  const handleSubmit = async () => {
    setIsModalVisible(true);
  };

  const onChange = async (e) => {
    console.log("radio checked", e.target.value);
    // setValue(e.target.value);
    if (e.target.value === true) {
      setIsModalVisible(false);
      const formValues = {
        fullName: fullName,
        email: email,
        password: password,
      };
      const res = await dispatch(signUp(formValues));
      if (!res) {
        history.push("/login");
      }
    } else {
      setIsModalVisible(false);
      notification["error"]({
        message: "Sign Up Failed! You disagreed to our terms and conditions.",
      });
    }
  };
  const handleOk = async () => {};

  const handleCancel = () => {};
  return (
    <>
      <AuthHeader title='Create an account' lead='' />
      <Container className='mt--8 pb-5'>
        <Row className='justify-content-center'>
          <Col lg='6' md='8'>
            <Card className='bg-secondary border-0'>
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
        <Modal
          title='Terms And Conditions'
          visible={isModalVisible}
          // onOk={handleOk}
          // onCancel={handleCancel}
          footer={null}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque vestibulum viverra elit, congue tincidunt tellus
            volutpat eu. Nulla mi odio, luctus vel metus id, vestibulum sagittis
            quam. Nulla facilisi. Nunc eu tristique orci, vel facilisis leo.
            Maecenas aliquam tortor quis sagittis gravida. Vestibulum efficitur
            mattis purus, eu efficitur quam tincidunt a. Fusce risus mauris,
            sollicitudin tempus feugiat ut, tempor eu est. Vivamus bibendum
            elementum nunc, eu gravida lorem faucibus quis. Etiam sed iaculis
            enim. Ut auctor pretium sapien ut lobortis. Vestibulum sit amet
            tellus ut mi fringilla porta. Suspendisse tellus ipsum, bibendum
            quis purus quis, semper gravida neque. Etiam egestas hendrerit
            mauris id ullamcorper. Morbi et rhoncus nisi, eget placerat odio.
            Nullam rutrum sodales leo non vehicula. Suspendisse elementum congue
            felis, eu commodo nisl commodo eu. In egestas urna et ultrices
            imperdiet. Nam sit amet vulputate velit, non dictum diam. Donec
            efficitur mauris tortor. Donec pharetra ligula at magna egestas, sit
            amet sollicitudin ligula porttitor. Ut consequat iaculis nisi, eu
            fermentum odio pulvinar quis. Praesent in lorem porttitor, fringilla
            arcu sit amet, blandit massa. Aenean vel ante ac sapien placerat
            dictum. Vestibulum mollis consectetur nibh tristique sodales. Sed
            sit amet ante rutrum, fermentum mi id, hendrerit augue. Phasellus
            non scelerisque arcu. Nam fermentum arcu metus. Nulla hendrerit et
            risus et sodales. Sed dapibus mattis metus non ornare. Vivamus
            fringilla cursus nunc, vel sagittis elit sagittis ac. Aliquam tempus
            interdum bibendum. Vivamus vitae porta enim. Pellentesque habitant
            morbi tristique senectus et netus et malesuada fames ac turpis
            egestas. Mauris et lacinia nunc. Nulla accumsan vel lorem non
            auctor. Vestibulum iaculis lectus non diam venenatis, non auctor
            augue tristique. Cras in semper ipsum, et faucibus massa. Nullam sed
            convallis arcu, ac volutpat arcu. Donec eu augue dignissim, dictum
            mi ut, pharetra massa. Sed viverra sem vulputate bibendum facilisis.
            Duis posuere, leo sit amet venenatis accumsan, ligula massa
            convallis ipsum, sed lacinia purus quam interdum nisl. Nam eget
            lobortis sem, id tempor ex.
          </p>
          <Radio.Group onChange={onChange}>
            <Radio value={true}>I agreed to the terms and conditions</Radio>
            <Radio value={false}>I disagree</Radio>
          </Radio.Group>
        </Modal>
      </Container>
    </>
  );
}

export default Register;
