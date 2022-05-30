import React, { useState, useEffect } from "react";

import ReactBSTables from "./tables/ReactBSTables";
import SimpleHeader from "components/Headers/SimpleHeader.js";

import { Card, CardBody, CardTitle, Col, Row, Container } from "reactstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationAlert from "react-notification-alert";
import { Card as ANTD_CARD, Image } from "antd";
import {
  statusUpdate,
  userScannedData,
  getOneUser,
  getScannedData,
} from "../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const { Meta } = ANTD_CARD;
const UsersDetails = () => {
  const [tableData, setTableData] = useState({});

  const { isLoading: loading, data } = useQuery("getScannedData", () =>
    getScannedData()
  );

  useEffect(() => {
    setTableData(data?.data?.scannedData);
  }, [loading, data?.data?.scannedData]);

  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "address",
      text: "Address",
      sort: true,
    },
    {
      dataField: "selectedInsurance",
      text: "Choosed Insurance",
      sort: true,
    },
    {
      dataField: "barcode",
      text: "Barcode",
      sort: true,
    },

    {
      dataField: "code",
      text: "Track & Trace Code",
      sort: true,
    },
    {
      dataField: "productStatus",
      text: "Product Status",
      sort: true,
    },
    {
      dataField: "packageContents",
      text: "Package Contents",
      sort: true,
    },
    {
      dataField: "website",
      text: "Website",
      sort: true,
    },
    {
      dataField: "size",
      text: "Size & Weight",
      sort: true,
    },
    {
      dataField: "phoneNumber",
      text: "Phone Number",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "photos",
      text: "Photos",
      sort: true,
    },
  ];
  const override = css`
    display: block;
    margin: 0 auto;
  `;
  let tableRows;
  if (tableData?.length > 0) {
    tableRows = tableData?.map((data, index) => {
      return {
        name: data.name,
        address: data.address,
        selectedInsurance: data?.buttons.map((btn) => {
          return btn;
        }),
        barcode: data.barcode,
        code: data.code,
        productStatus: data.productStatus,
        packageContents: data.packageContents,
        website: data.website,
        size: data.sizeWeight,
        phoneNumber: data.phoneNumber,
        email: data.email,
        photos: data?.productPhotos.map((photo, index) => {
          return (
            <Image.PreviewGroup key={index + "prImg"}>
              <Image key={index + "Img"} width={50} height={50} src={photo} />
            </Image.PreviewGroup>
          );
        }),
      };
    });
  }

  return (
    <>
      <SimpleHeader name='Admin' parentName='Tables' />

      <Container className='mt--6' fluid>
        <Row>
          <Col className='order-xl-1'>
            <Row>
              <Col lg=''>
                <Card className='bg-gradient-success border-0'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          className='text-uppercase text-muted mb-0 text-white'
                          tag='h5'>
                          Total Claims
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0 text-white'>
                          {tableData?.length === 0
                            ? "No Claims"
                            : tableData?.length}
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
            </Row>
            <div
              style={{
                marginTop: "10vh",
                display: "flex",
                justifyContent: "center",
              }}>
              {tableData?.length > 0 ? (
                <ReactBSTables
                  columns={columns}
                  dataTable={tableRows}
                  tableTitle={"Claim Information"}
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
