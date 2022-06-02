import React, { useState, useEffect } from "react";

import ReactBSTables from "./tables/ReactBSTables";
import SimpleHeader from "components/Headers/SimpleHeader.js";

import { Card, CardBody, CardTitle, Col, Row, Container } from "reactstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationAlert from "react-notification-alert";
import { Card as ANTD_CARD, Image, DatePicker, Form } from "antd";
import { formattedDate } from "config/config";

import {
  statusUpdate,
  userScannedData,
  getOneUser,
} from "../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import moment, { isMoment } from "moment";

const { Meta } = ANTD_CARD;
const { RangePicker } = DatePicker;

const UsersDetails = (props) => {
  const [tableData, setTableData] = useState({});
  const [scannedData, setScannedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [counts, setCounts] = useState(null);

  if (props.location.state._id) {
    console.log(props.location.state._id);
  }

  localStorage.setItem("UserDetialsID", props.location.state._id);

  // const [userId, setUserId] = useState("");

  const barcodeData3 = (data, index) => {
    return {
      barcode: data.barcode,
      buttons: data.buttons + ",",
      claimStatus: data.claimStatus,
      photos: data?.productPhotos.map((photo, index) => {
        return (
          <Image.PreviewGroup key={index + "prImg"}>
            <Image key={index + "Img"} width={50} height={50} src={photo} />
          </Image.PreviewGroup>
        );
      }),

      scanDate: formattedDate(data.createdAt),
    };
  };
  const {
    isLoading: loading,
    data,
    isFetching,
  } = useQuery(
    [
      "getOneUser",
      !props.location.state._id
        ? localStorage.getItem("UserDetialsID")
        : props.location.state._id,
    ],
    () =>
      getOneUser({
        id: !props.location.state._id
          ? localStorage.getItem("UserDetialsID")
          : props.location.state._id,
      })
  );

  const dateRange = (e) => {
    if (isMoment(e?.[0]) && isMoment(e?.[1])) {
      let start = moment(e[0]).format("YYYY-MM-DD");
      let end = moment(e[1]).format("YYYY-MM-DD");
      setFilteredData(
        scannedData.filter((res) => {
          let sd = new Date(start).getTime();
          let ed = new Date(end).getTime();
          let tbldate = formattedDate(res.createdAt);
          let dataD = new Date(tbldate).getTime();
          if (start === end) return dataD === sd;
          return dataD >= sd && dataD <= ed;
        })
      );
    } else setFilteredData(scannedData);
  };

  useEffect(() => {
    setTableData(data?.data);
    setScannedData(data?.data?.user);
    setFilteredData(data?.data?.user);
  }, [loading, data?.data]);

  const override = css`
    display: block;
    margin: 0 auto;
  `;
  const columns = [
    {
      dataField: "barcode",
      text: "Bar Code",
      sort: true,
    },
    {
      dataField: "buttons",
      text: "Choosed Insurances",
      sort: true,
    },

    {
      dataField: "claimStatus",
      text: "Claim Status",
      sort: true,
    },

    {
      dataField: "scanDate",
      text: "Date",
      sort: true,
    },

    {
      dataField: "photos",
      text: "Photos",
      sort: true,
    },
  ];
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
                            {tableData?.userId?.assignedButtons.length
                              ? tableData?.userId?.assignedButtons?.map((d) => {
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
                  marginBottom: 45,
                  display: "flex",
                  justifyContent: "center",
                }}>
                <ANTD_CARD
                  title={`User Name: ${
                    tableData?.user &&
                    tableData?.user[0]?.userId?.fullName?.toUpperCase()
                  }`}
                  style={{ width: 500 }}>
                  <p>
                    <strong>Company Name:</strong>{" "}
                    {tableData?.user && tableData?.user[0]?.userId?.companyName}
                  </p>
                  <p>
                    <strong>Contact person</strong>{" "}
                    {tableData?.user &&
                      tableData?.user[0]?.userId?.contactPerson}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {tableData?.user && tableData?.user[0]?.userId?.address}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    {tableData?.user && tableData?.user[0]?.userId?.website}
                  </p>
                </ANTD_CARD>
                <ANTD_CARD
                  title={`Status: ${
                    tableData?.user &&
                    tableData?.user[0]?.userId?.status?.toUpperCase()
                  }`}
                  style={{ width: 500 }}>
                  <p>
                    <strong>Email:</strong>{" "}
                    {tableData?.user && tableData?.user[0]?.userId?.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {tableData?.user && tableData?.user[0]?.userId?.phoneNumber}
                  </p>
                  <p>
                    <strong>How many shipments per year:</strong>{" "}
                    {tableData?.user &&
                      tableData?.user[0]?.userId?.shipmentsPerYear}
                  </p>
                </ANTD_CARD>
              </div>
            )}
          </Col>
        </Row>

        {scannedData && (
          <ReactBSTables
            style={{ zIndex: -1 }}
            dateRange={dateRange}
            showDateRange={true}
            columns={columns}
            disabled={false}
            dataTable={filteredData?.map(barcodeData3)}
            name='Client'
            tableTitle='Scanned Barcode Data'
          />
        )}
      </Container>
    </>
  );
};

export default UsersDetails;
