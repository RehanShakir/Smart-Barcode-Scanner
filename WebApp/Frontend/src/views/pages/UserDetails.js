import React, { useState, useEffect } from "react";

import ReactBSTables from "./tables/ReactBSTables";
import SimpleHeader from "components/Headers/SimpleHeader.js";

import { Card, CardBody, CardTitle, Col, Row, Container } from "reactstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationAlert from "react-notification-alert";
import { statusUpdate, userScannedData } from "../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const UsersDetails = (props) => {
  const notificationAlertRef = React.useRef(null);
  const notify = (type, title, message) => {
    let options = {
      place: "tc",
      message: (
        <div className='alert-text'>
          <span className='alert-title' data-notify='title'>
            {" "}
          </span>
          <span data-notify='message'>{message}</span>
        </div>
      ),
      type: type,
      icon: "ni ni-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  const [tableData, setTableData] = useState({});

  const { isLoading: loading, data } = useQuery("userScannedData", () =>
    userScannedData({ id: props.location.state._id })
  );
  console.log(data);

  const queryClient = useQueryClient();
  // const getDataMutation = useMutation(userScannedData, {
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries("userScannedData");
  //   },
  // });

  useEffect(() => {
    setTableData(data?.data?.data);
  }, [loading, data?.data?.data]);

  const columns = [
    {
      dataField: "barcode",
      text: "Scanned Barcodes",
      sort: true,
    },
    {
      dataField: "selectedInsurance",
      text: "Choosed Insurance",
      sort: true,
    },
    {
      dataField: "companyName",
      text: "Company Name",
      sort: true,
    },
    {
      dataField: "contactPerson",
      text: "Contact Person",
      sort: true,
    },
    {
      dataField: "address",
      text: "Address",
      sort: true,
    },
    {
      dataField: "website",
      text: "Website",
      sort: true,
    },
    {
      dataField: "phoneNumber",
      text: "Phone Number",
      sort: true,
    },
    {
      dataField: "shipments",
      text: "Shipments Per Year",
      sort: true,
    },
  ];
  const override = css`
    display: block;
    margin: 0 auto;
  `;
  let tableRows;
  if (tableData?.length) {
    tableRows = tableData?.map((data, index) => {
      return {
        barcode: data.barcode,
        selectedInsurance: data.buttons,
      };
    });
  }

  return (
    <>
      <NotificationAlert ref={notificationAlertRef} />

      <SimpleHeader name='Admin' parentName='Tables' />

      <Container className='mt--6' fluid>
        <Row>
          <Col className='order-xl-1'>
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
                          {tableData?.length}
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
              <Col lg='6'>
                <Card className='bg-gradient-danger border-0' tag='h5'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle className='text-uppercase text-muted mb-0 text-white'>
                          Assigned Insurances
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0 text-white'>
                          <small>
                            {tableData?.length
                              ? tableData[0]?.userId?.assignedButtons?.map(
                                  (d) => {
                                    return d.value + ", ";
                                  }
                                )
                              : "No Assigned Insurance"}
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
            <div style={{ marginTop: 50 }}>
              {tableData?.length > 0 ? (
                <ReactBSTables
                  columns={columns}
                  dataTable={tableRows}
                  tableTitle={`User Name: ${tableData[0]?.userId?.fullName}`}
                />
              ) : <HashLoader
                  color={"#5e72e4"}
                  loading={loading}
                  css={override}
                  size={50}
                /> ? (
                loading === false
              ) : (
                "No Scanned Barcodes"
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UsersDetails;
