import React, { useState, useEffect } from "react";

import ReactBSTables from "./tables/ReactBSTables";
import SimpleHeader from "components/Headers/SimpleHeader.js";

import { Card, CardBody, CardTitle, Col, Row, Container } from "reactstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationAlert from "react-notification-alert";
import { Card as ANTD_CARD } from "antd";
import {
  statusUpdate,
  userScannedData,
  getOneUser,
} from "../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const { Meta } = ANTD_CARD;
const UsersDetails = (props) => {
  const [tableData, setTableData] = useState({});
  // const [userId, setUserId] = useState("");

  const {
    isLoading: loading,
    data,
    isFetching,
  } = useQuery(["getOneUser", props.location.state._id], () =>
    getOneUser({ id: props.location.state._id })
  );

  useEffect(() => {
    setTableData(data?.data);
  }, [loading, data?.data]);
  const override = css`
    display: block;
    margin: 0 auto;
  `;
  console.log(tableData);
  return (
    <>
      <SimpleHeader name='Admin' parentName='Tables' />

      <Container className='mt--6' fluid>
        <Row>
          <Col className=''>
            <Row>
              <Col lg='4'>
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
                          {tableData?.scanCount === 0
                            ? "No Scanned Barcodes"
                            : tableData?.scanCount}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-white text-dark rounded-circle shadow'>
                          <i className='ni ni-active-40' />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='bg-gradient-danger border-0' tag='h5'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle className='text-uppercase text-muted mb-0 text-white'>
                          Total Claims
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0 text-white'>
                          {tableData?.claimCount === 0
                            ? "No Claims"
                            : tableData?.claimCount}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-white text-dark rounded-circle shadow'>
                          <i className='ni ni-spaceship' />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='bg-gradient-danger border-0' tag='h5'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle className='text-uppercase text-muted mb-0 text-white'>
                          Assigned Insurances
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0 text-white'>
                          <small>
                            {tableData?.user?.assignedButtons.length
                              ? tableData?.user?.assignedButtons?.map((d) => {
                                  console.log(d.value);
                                  return d.value + ", ";
                                })
                              : "No Assigned Insurances"}
                          </small>
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-white text-dark rounded-circle shadow'>
                          <i className='ni ni-spaceship' />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {loading ? (
              <HashLoader
                color={"#5e72e4"}
                loading={loading}
                css={override}
                size={50}
              />
            ) : (
              <div
                style={{
                  marginTop: 5,
                  display: "flex",
                  justifyContent: "center",
                }}>
                <ANTD_CARD
                  title={`User Name: ${tableData?.user?.fullName?.toUpperCase()}`}
                  style={{ width: 500 }}>
                  <p>
                    <strong>Company Name:</strong>{" "}
                    {tableData?.user?.companyName}
                  </p>
                  <p>
                    <strong>Contact person</strong>{" "}
                    {tableData?.user?.contactPerson}
                  </p>
                  <p>
                    <strong>Address:</strong> {tableData?.user?.address}
                  </p>
                  <p>
                    <strong>Website:</strong> {tableData?.user?.website}
                  </p>
                </ANTD_CARD>
                <ANTD_CARD
                  title={`Status: ${tableData?.user?.status?.toUpperCase()}`}
                  style={{ width: 500 }}>
                  <p>
                    <strong>Email:</strong> {tableData?.user?.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {tableData?.user?.phoneNumber}
                  </p>
                  <p>
                    <strong>How many shipments per year:</strong>{" "}
                    {tableData?.user?.shipmentsPerYear}
                  </p>
                </ANTD_CARD>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UsersDetails;
