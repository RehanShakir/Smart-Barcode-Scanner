import React, { useState } from "react";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import ReactBSTables from "../tables/ReactBSTables";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getScannedDataLoggedInUser,
  claimInsurance,
  uploadPhotos,
  removePhoto,
  removeInsuracne,
  scanBarcode,
  deleteBarcode,
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
  Checkbox,
  Row,
  Col,
  Popconfirm,
  message,
} from "antd";
import { formattedDate } from "config/config";

import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";

function Dashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannerId, setScannerId] = useState("");
  const [showUploadList, setUploadList] = useState(true);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [uploading, setUploaing] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState([]);
  const [photosModalVisible, setPhotosModalVisible] = useState(false);
  const [insuranceModal, setInsuranceModalVisible] = useState(false);
  const [choosedInsurance, setChoosedInsurance] = useState({
    id: "",
    insurance: [],
  });
  const [barcodeBtnLoading, setBarcodeBtnLoading] = useState(false);
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [showButton, setShowButton] = useState();

  const [photos, setPhotos] = useState({
    id: "",
    photos: [],
  });
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
      buttons: (
        <Button
          key={index + "btn5"}
          size='sm'
          color='primary'
          onClick={() =>
            handleInsuranceModal(data._id, data.buttons, data.deleteButtonFlag)
          }>
          Choosed Insurances
        </Button>
      ),
      claim: (
        <Button
          key={index + "btn1"}
          size='sm'
          color='primary'
          onClick={() => handleClaimInsurance(data, index)}>
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
      photos: (
        <Button
          key={index + "btn2"}
          size='sm'
          color='primary'
          onClick={() => handleImagePreview(data._id, data.productPhotos)}>
          View Photos
        </Button>
      ),
      claimStatus:
        data.claimStatus === "inProgress" ? (
          <strong>
            <span style={{ color: "blue" }}>IN PROGRESS</span>
          </strong>
        ) : data.claimStatus === "finished" ? (
          <strong>
            <span style={{ color: "green" }}>
              {data.claimStatus.toUpperCase()}
            </span>
          </strong>
        ) : (
          <strong>
            <span style={{ color: "red" }}>
              {data.claimStatus.toUpperCase()}
            </span>
          </strong>
        ),
      scanDate: formattedDate(data.createdAt),
      delete: (
        <Popconfirm
          key={index + "popconfirm"}
          title='Are you sure to delete this entry?'
          onConfirm={() => handleDeleteEntry(data._id)}
          onCancel={handleCancelPopConfirm}
          okText='Yes'
          cancelText='No'>
          <Button key={index + "btn2"} size='sm' color='danger'>
            Delete
          </Button>
        </Popconfirm>
      ),
    };
  };

  const handleCancelPopConfirm = () => {
    console.log("Cancelled");
  };

  const handleDeleteEntry = async (id) => {
    console.log(id);
    const res = await deleteBarcode(id);
    console.log(res);
    if (res.status === 200) {
      getDataMutation.mutate();
      notification["success"]({
        message: res?.data?.message,
      });
    } else {
      notification["error"]({
        message: "Something went wrong! Please check your internet connection",
      });
    }
  };

  const handleInsuranceModal = (id, insurance, deleteButtonFlag) => {
    setInsuranceModalVisible(true);
    setChoosedInsurance({
      id: id,
      insurance: insurance,
    });
    setShowButton(deleteButtonFlag);
  };

  const handleImagePreview = (id, photos) => {
    setPhotos({
      id: id,
      photos: photos,
    });

    setPhotosModalVisible(true);
  };

  const handleDeletePhoto = async (id, photo) => {
    const res = await removePhoto(id, photo);
    if (res.status === 200) {
      getDataMutation.mutate();
      setPhotosModalVisible(false);
      notification["success"]({
        message: "Photo Deleted Successfully!",
      });
    } else {
      setPhotosModalVisible(false);
      notification["error"]({
        message: "Something went wrong! Please check your internet connection",
      });
    }
  };

  const handleDeleteInsurance = async (insurance) => {
    const res = await removeInsuracne(choosedInsurance.id, insurance);
    if (res.status === 200) {
      getDataMutation.mutate();
      setInsuranceModalVisible(false);
      notification["success"]({
        message: "Insurance Deleted Successfully!",
      });
    } else {
      setInsuranceModalVisible(false);
      notification["error"]({
        message: "Something went wrong! Please check your internet connection",
      });
    }
  };

  const onUploadModalCancel = () => {
    setUploadModalVisible(false);
  };
  //Upload Photos Button
  const handleUpload = async () => {
    const formData = new FormData();
    setUploaing(true);
    setUploaing(false);
    setUploadModalVisible(false);
    setUploadList(false);
    setUploadFileList([]);
    uploadFileList.forEach((file) => {
      formData.append("photos", file);
    });

    const res = await uploadPhotos(formData, scannerId);
    if (res.status === 200) {
      getDataMutation.mutate();

      notification["success"]({
        message: "Photos Uploaded Successfully!",
      });
    } else {
      setUploaing(false);
      setUploadModalVisible(false);
      setUploadFileList([]);

      notification["error"]({
        message: "Something went wrong! Please check your internet connection",
      });
      setUploadList(false);
    }
  };

  const beforeUpload = (file, fileList) => {
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

  const handleClaimInsurance = (data, index) => {
    setIsModalVisible(true);
    setScannerId(data._id);
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
      getDataMutation.mutate();

      notification["success"]({
        message: "Insurance Claim Request Submitted Successfully",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleAddBarcode = () => {
    setBarcodeModalVisible(true);
  };

  const handleBarcodeModalOk = async () => {
    setBarcodeBtnLoading(true);
    const res = await scanBarcode(barcode, selectedInsurance);

    if (res.status === 200) {
      setBarcodeBtnLoading(false);

      setBarcodeModalVisible(false);
      getDataMutation.mutate();

      notification["success"]({
        message: "Barcode Added Successfully!",
      });
    } else {
      setBarcodeBtnLoading(false);

      setBarcodeModalVisible(false);

      notification["error"]({
        message: "Something went wrong! Please check your internet connection",
      });
    }
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
      dataField: "claimStatus",
      text: "Claim Status",
      sort: true,
    },
    {
      dataField: "photos",
      text: "Photos",
      sort: true,
    },
    {
      dataField: "scanDate",
      text: "Date",
      sort: true,
    },
    {
      dataField: "delete",
      text: "Delete",
      sort: true,
    },
  ];
  const override = css`
    display: block;
    margin: 0 auto;
  `;

  const handleCheckBox = (values) => {
    setSelectedInsurance(values);
  };
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
          disabled={true}
          handleAddBarcode={handleAddBarcode}
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
          {/* <Form.Item label='Select Insurance' name='buttons'>
            <Checkbox.Group>
              <Row>
                {assignedButtons.map((btn) => {
                  return (
                    <Col span={8}>
                      <Checkbox
                        value={btn.value}
                        key={btn._id}
                        style={{ lineHeight: "32px" }}>
                        {btn.value}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item> */}
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
            showUploadList={true}
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
      <Modal
        title='All Photos'
        visible={photosModalVisible}
        // onOk={handleOk}
        width={250}
        onCancel={() => setPhotosModalVisible(false)}
        footer={null}>
        <div style={{ textAlign: "center" }}>
          {photos.photos.map((photo, index) => {
            return (
              <div
                key={index + "div"}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 15,
                }}>
                <Image.PreviewGroup key={index + "prImg"}>
                  <Image
                    key={index + "Img"}
                    width={80}
                    height={50}
                    src={photo}
                  />
                  <Button
                    style={{ marginLeft: 20 }}
                    key={index + "btn3"}
                    size='sm'
                    outline
                    color='danger'
                    onClick={() => handleDeletePhoto(photos.id, photo)}>
                    <DeleteOutlined />
                  </Button>
                </Image.PreviewGroup>
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal
        title='Choosed Insurances'
        visible={insuranceModal}
        // onOk={handleOk}
        // width={250}
        onCancel={() => setInsuranceModalVisible(false)}
        footer={null}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // flexDirection: "row",
          }}>
          {choosedInsurance.insurance.map((d, index) => {
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  style={{ marginBottom: 15 }}
                  key={index + "btn8"}
                  size='sm'
                  outline
                  disabled
                  color='primary'>
                  {d}
                </Button>
                <Button
                  key={index + "btn6"}
                  size='sm'
                  disabled={showButton}
                  color='danger'
                  onClick={() => handleDeleteInsurance(d)}>
                  <DeleteOutlined />
                </Button>
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal
        title='Enter Barcode'
        visible={barcodeModalVisible}
        onOk={handleBarcodeModalOk}
        destroyOnClose
        okText={"Add Barcode"}
        okButtonProps={{ loading: barcodeBtnLoading }}
        onCancel={() => setBarcodeModalVisible(false)}>
        <div>
          <Input
            placeholder='Enter Barcode'
            onChange={(e) => setBarcode(e.target.value)}
          />
          <p
            style={{
              marginTop: 20,
              fontWeight: 500,
              textDecoration: "underline",
            }}>
            Choose Insurance
          </p>
          <Checkbox.Group onChange={handleCheckBox}>
            <Row>
              {scannedData?.data?.scannedData[0]?.userId?.assignedButtons?.map(
                (btn) => {
                  return (
                    <Col span={8}>
                      <Checkbox
                        value={btn.value}
                        key={btn._id}
                        style={{ lineHeight: "32px" }}>
                        {btn.value}
                      </Checkbox>
                    </Col>
                  );
                }
              )}
            </Row>
          </Checkbox.Group>
        </div>
      </Modal>
    </>
  );
}

export default Dashboard;
