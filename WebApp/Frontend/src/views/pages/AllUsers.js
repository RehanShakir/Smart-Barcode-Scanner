import React, { useState, useEffect, useCallback } from "react";
import classnames from "classnames";

import ReactBSTables from "./tables/ReactBSTables";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { useSelector } from "react-redux";

import {
  Form,
  Input,
  Button,
  Modal,
  InputGroup,
  InputGroupAddon,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  InputGroupText,
} from "reactstrap";
import { Select } from "antd";
import server from "../../Axios/index";
import { getToken } from "../../Redux/localstorage";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationAlert from "react-notification-alert";
import {
  getAllUsersData,
  statusUpdate,
  assignButtons,
} from "../../Axios/apiFunctions";

const { Option } = Select;
let count = 0;
const AllUsers = () => {
  const [formModal, setformModal] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [field, setField] = useState([{ value: "" }]);
  const [userId, setUserId] = useState("");

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

  const { isLoading: loading, data } = useQuery("allUsers", () =>
    getAllUsersData()
  );

  const queryClient = useQueryClient();
  const getDataMutation = useMutation(getAllUsersData, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("allUsers");
    },
  });

  useEffect(() => {
    setTableData(data?.data?.users);
  }, [loading, data?.data?.users]);

  const handleChange = async (value, data) => {
    const res = await statusUpdate(data);
    console.log(res);
    if (res.status === 200) {
      notify("success", "Status", "Status Updated Successfully");
    }
  };

  const columns = [
    {
      dataField: "name",
      text: "Full Name",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "role",
      text: "Role",
      sort: true,
    },
    {
      dataField: "status",
      text: "status",
      sort: true,
    },
    {
      dataField: "buttons",
      text: "Assign Buttons",
    },
    {
      dataField: "assignedButtons",
      text: "Asigned Buttons",
    },
  ];

  // for (let i = 0; i < count; i++) {}
  let handleChangeBtn = (e, i) => {
    let newFormValues = [...field];
    // console.log(newFormValues, i, e.target.value);
    newFormValues[i].value = e.target.value;
    console.log(newFormValues);
    setField(newFormValues);
  };

  const renderedFields = field.map((d, index) => {
    return (
      <InputGroup
        className='input-group-merge input-group-alternative'
        key={index}>
        <Input
          placeholder='Button Name'
          type='email'
          style={{ marginTop: 10 }}
          onChange={(e) => {
            handleChangeBtn(e, index);
          }}
          onFocus={() => setFocusedEmail(true)}
          onBlur={() => setFocusedEmail(false)}
        />
      </InputGroup>
    );
  });
  const handleAssignButton = (id) => {
    setformModal(true);
    setUserId(id);
  };
  const handleAddFields = () => {
    setField([...field, { value: "" }]);
  };
  let tableRows;
  if (tableData?.length > 0) {
    tableRows = tableData?.map((data) => {
      return {
        name: data.fullName,
        email: data.email,
        role: data.role,
        status: (
          <Select
            defaultValue={data.status}
            style={{ width: 120 }}
            onChange={handleChange}>
            <Option value='pending' id={data._id}>
              Pending
            </Option>
            <Option value='approved' id={data._id}>
              Approved
            </Option>
            <Option value='rejected' id={data._id}>
              Rejected
            </Option>
          </Select>
        ),
        buttons: (
          <Button
            size='sm'
            color='primary'
            onClick={() => handleAssignButton(data._id)}>
            Assign
          </Button>
        ),
        assignedButtons: data.assignedButtons?.map((d) => {
          return d.value + ",";
        }),
      };
    });
  }
  const handleSubmit = async () => {
    console.log(field);
    console.log(userId);
    const res = await assignButtons(field, userId);
    console.log(res);
    if (res.status === 200) {
      getDataMutation.mutate();
      setformModal(false);
      notify("success", "Status", "Buttons Assigned to user");
    }
  };

  return (
    <>
      <NotificationAlert ref={notificationAlertRef} />

      <SimpleHeader name='Admin' parentName='Tables' />

      <Modal
        className='modal-dialog-centered'
        size='sm'
        isOpen={formModal}
        toggle={() => setformModal(false)}>
        <div className='modal-body p-0'>
          <Card className='bg-secondary border-0 mb-0'>
            <CardBody className='px-lg-5 py-lg-5'>
              <div className='text-center text-muted mb-4'>
                <small>Or sign in with credentials</small>
              </div>
              <Button
                style={{ marginBottom: 15 }}
                size='sm'
                color='primary'
                onClick={handleAddFields}>
                Add More Button Fields
              </Button>

              {renderedFields}

              <div className='text-center'>
                <Button
                  className='my-4'
                  color='primary'
                  type='button'
                  onClick={handleSubmit}>
                  Save
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </Modal>

      {tableData?.length > 0 ? (
        <ReactBSTables
          columns={columns}
          dataTable={tableRows}
          tableTitle={"All Users"}
        />
      ) : (
        "Loading"
      )}
    </>
  );
};

export default AllUsers;
