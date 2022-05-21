import React, { useState } from "react";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import ReactBSTables from "../tables/ReactBSTables";
import { useQuery } from "react-query";
import {
  getScannedDataLoggedInUser,
  claimInsurance,
} from "../../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import { Button } from "reactstrap";
import { Modal, Button as antdButton, Form, Input, notification } from "antd";

function Dashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannerId, setScannerId] = useState("");

  const { isLoading: dataLoading, data: scannedData } = useQuery(
    "getScannedDataOfLoggedInUser",
    () => getScannedDataLoggedInUser()
  );

  const barcodeData3 = (data, index) => {
    return {
      name: data.userId.fullName,
      email: data.userId.email,
      barcode: data.barcode,
      buttons: data.buttons + ",",
      claim: (
        <Button
          size='sm'
          color='primary'
          onClick={() => handleClaimInsurance(data._id, index)}>
          Claim Insurance
        </Button>
      ),
    };
  };

  const handleClaimInsurance = (_id, index) => {
    setIsModalVisible(true);
    console.log(_id);

    setScannerId(_id);
  };

  //Modal functions

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Form functions
  const onFinish = async (values) => {
    console.log(values);
    const res = await claimInsurance(values, scannerId);
    console.log(res);
    if (res.status === 200) {
      setIsModalVisible(false);
      notification["success"]({
        message: "Insurance Claim Request Submitted Successfully",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
      dataField: "claim",
      text: "Claim Insurance",
      sort: true,
    },
  ];
  const override = css`
    display: block;
    margin: 0 auto;
  `;

  return (
    <>
      <SimpleHeader name='Client' parentName='Table' />
      <HashLoader
        color={"#5e72e4"}
        loading={dataLoading}
        css={override}
        size={20}
      />
      {dataLoading || (
        <ReactBSTables
          columns={columns}
          dataTable={scannedData?.data?.scannedData?.map(barcodeData3)}
          name='Client'
          tableTitle='Scanned Barcode Data'
        />
      )}
      <Modal
        title='Claim Insurance'
        visible={isModalVisible}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={null}>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'>
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: "Please input your Name!" }]}>
            <Input placeholder='Enter Your Name' />
          </Form.Item>
          <Form.Item
            label='Address'
            name='address'
            rules={[{ required: true, message: "Please input your Address!" }]}>
            <Input placeholder='Enter Your Address' />
          </Form.Item>
          <Form.Item label='Track & Trace Code' name='code'>
            <Input placeholder='Enter Track & Trace Code' />
          </Form.Item>
          <Form.Item label='Product Status' name='productStatus'>
            <Input placeholder='Enter Product Status' />
          </Form.Item>
          <Form.Item label='Website' name='website'>
            <Input placeholder='Enter Your Website' />
          </Form.Item>
          <Form.Item label='Size & Weight' name='sizeWeight'>
            <Input placeholder='Enter Size & Weight' />
          </Form.Item>
          <Form.Item label='Email' name='email'>
            <Input placeholder='Enter Your Email' />
          </Form.Item>
          <Form.Item label='Phone Number' name='phoneNumber'>
            <Input placeholder='Enter Your Phone Number' />
          </Form.Item>
          <Button type='primary' htmltype='submit'>
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
}

export default Dashboard;
