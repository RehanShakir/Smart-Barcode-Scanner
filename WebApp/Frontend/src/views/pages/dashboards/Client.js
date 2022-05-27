import React, { useState } from "react";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import ReactBSTables from "../tables/ReactBSTables";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getScannedDataLoggedInUser,
  claimInsurance,
  uploadPhotos,
} from "../../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import { Button } from "reactstrap";
import {
  Modal,
  Button as antdButton,
  Form,
  Input,
  notification,
  Upload,
  Spin,
  Radio,
  Image,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Dashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannerId, setScannerId] = useState("");
  const [showUploadList, setUploadList] = useState(true);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [uploading, setUploaing] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [productStatus, setProductStatus] = useState("");
  const [form] = Form.useForm();

  const { isLoading: dataLoading, data: scannedData } = useQuery(
    "getScannedDataOfLoggedInUser",
    () => getScannedDataLoggedInUser()
  );
  const queryClient = useQueryClient();

  const getDataMutation = useMutation(getScannedDataLoggedInUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("getScannedDataOfLoggedInUser");
    },
  });

  const barcodeData3 = (data, index) => {
    return {
      name: data.userId.fullName,
      email: data.userId.email,
      barcode: data.barcode,
      buttons: data.buttons + ",",
      claim: (
        <Button
          key={index + "btn1"}
          size='sm'
          color='primary'
          onClick={() => handleClaimInsurance(data._id, index)}>
          Claim Insurance
        </Button>
      ),
      upload: (
        <Button
          key={index + "btn2"}
          size='sm'
          color='primary'
          onClick={() => handleUploadPhtotsMoal(data._id, index)}>
          Upload Photos
        </Button>
      ),
      photos: data.productPhotos.map((photo, index) => {
        return (
          <Image.PreviewGroup key={index + "prImg"}>
            <Image key={index + "Img"} width={50} height={50} src={photo} />
          </Image.PreviewGroup>
        );
      }),
    };
  };

  const onUploadModalCancel = () => {
    setUploadModalVisible(false);
  };
  //Upload Photos Button
  const handleUpload = async () => {
    const formData = new FormData();
    setUploaing(true);
    uploadFileList.forEach((file) => {
      formData.append("photos", file);
    });

    const res = await uploadPhotos(formData, scannerId);
    if (res.status === 200) {
      setUploaing(false);
      setUploadModalVisible(false);
      setUploadList(false);

      getDataMutation.mutate();

      notification["success"]({
        message: "Photos Uploaded Successfully!",
      });
    } else {
      setUploaing(false);
      setUploadModalVisible(false);

      notification["error"]({
        message: "Something went wrong! Please check your internet connection",
      });
      setUploadList(false);
    }
  };

  const beforeUpload = (file) => {
    uploadFileList.push(file);
    setUploadFileList(uploadFileList);
    return false;
  };
  const onRemove = (file) => {
    const index = uploadFileList.indexOf(file);
    const newFileList = uploadFileList.slice();
    newFileList.splice(index, 1);
    setUploadFileList(newFileList);
  };

  const handleClaimInsurance = (_id, index) => {
    setIsModalVisible(true);

    setScannerId(_id);
  };
  const handleUploadPhtotsMoal = (_id, index) => {
    setUploadModalVisible(true);

    setScannerId(_id);
  };

  //Modal functions

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Form functions
  const onFinish = async (values) => {
    const res = await claimInsurance(values, scannerId);
    if (res.status === 200) {
      form.resetFields();
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
    {
      dataField: "upload",
      text: "Upload Photos",
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
          form={form}
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
          <Form.Item label='Barcode' name='barcode'>
            <Input placeholder='Enter Your Barcode' />
          </Form.Item>
          <Form.Item label='Product Status' name='productStatus'>
            <Radio.Group value={"lost"}>
              <Radio value={"lost"}>Lost</Radio>
              <Radio value={"damaged"}>Damaged</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='Package Contents' name='packageContents'>
            <Input placeholder='Enter Package Contents' />
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
      <Modal
        title='Upload Photos'
        visible={uploadModalVisible}
        // onOk={handleOk}
        onCancel={onUploadModalCancel}
        footer={null}>
        <div style={{ textAlign: "center" }}>
          <Upload
            multiple={true}
            fileList={uploadFileList}
            showUploadList={showUploadList}
            beforeUpload={beforeUpload}
            onRemove={onRemove}>
            <Button size='lg' color='primary'>
              <span className='btn-inner--text'>Select Photos</span>
              <span className='btn-inner--icon'>
                <i className='ni ni-fat-add'></i>
              </span>
            </Button>
          </Upload>

          <Button
            size='lg'
            color='primary'
            onClick={handleUpload}
            disabled={uploadFileList.length === 0 || uploading ? true : false}
            style={{ marginTop: "5vh", width: "100%" }}>
            <span className='btn-inner--text'>
              {uploading ? "Uplaoding" : "Upload Photos"}
            </span>
            <span className='btn-inner--icon'>
              {uploading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, marginLeft: "20px" }}
                      spin
                    />
                  }
                />
              ) : (
                <i className='ni ni-cloud-upload-96'></i>
              )}
            </span>
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Dashboard;
