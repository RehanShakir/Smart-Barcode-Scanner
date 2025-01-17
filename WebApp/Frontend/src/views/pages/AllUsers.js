import React, { useState, useEffect } from "react";

import ReactBSTables from "./tables/ReactBSTables";
import SimpleHeader from "components/Headers/SimpleHeader.js";

import { Input, Button, Modal, InputGroup, Card, CardBody } from "reactstrap";
import { Select } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationAlert from "react-notification-alert";
import {
  getAllUsersData,
  statusUpdate,
  assignButtons,
} from "../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const { Option } = Select;
const AllUsers = () => {
  const [formModal, setformModal] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
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
      text: "Assign Insurances",
    },
    {
      dataField: "assignedButtons",
      text: "Asigned Insurances",
    },
  ];
  const override = css`
    display: block;
    margin: 0 auto;
  `;
  let handleChangeBtn = (e, i) => {
    let newFormValues = [...field];
    newFormValues[i].value = e.target.value;
    setField(newFormValues);
  };
  const handleRemoveClick = (index) => {
    const list = [...field];
    list.splice(index, 1);
    setField(list);
  };

  const renderedFields = field.map((d, index) => {
    return (
      <div style={{ display: "flex" }} key={index}>
        <div style={{ marginTop: 5 }}>
          <InputGroup
            className='input-group-merge input-group-alternative'
            key={index}>
            <Input
              placeholder='Insurance Name'
              type='email'
              value={d.value}
              onChange={(e) => {
                handleChangeBtn(e, index);
              }}
              onFocus={() => setFocusedEmail(true)}
              onBlur={() => setFocusedEmail(false)}
            />
          </InputGroup>
        </div>

        <div>
          <Button
            style={{ marginTop: 10, marginLeft: 10 }}
            size='sm'
            color='info'
            onClick={() => handleRemoveClick(index)}>
            X
          </Button>
        </div>
      </div>
    );
  });
  const handleAssignButton = (id, index) => {
    setformModal(true);
    setUserId(id);

    tableData[index].assignedButtons.map((d) => {
      field.push({ value: d.value });
    });
  };
  const handleAddFields = () => {
    setField([...field, { value: "" }]);
  };
  let tableRows;
  if (tableData?.length > 0) {
    tableRows = tableData?.map((data, index) => {
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
            onClick={() => handleAssignButton(data._id, index)}>
            Assign Insurance
          </Button>
        ),
        assignedButtons: data.assignedButtons?.map((d) => {
          return d.value + ",";
        }),
      };
    });
  }
  const handleSubmit = async () => {
    const res = await assignButtons(field, userId);
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
                <h3>Assign Insurance</h3>
              </div>
              <Button
                style={{ marginBottom: 15 }}
                size='sm'
                color='primary'
                onClick={handleAddFields}>
                Add Insurance Name
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
        <HashLoader
          color={"#5e72e4"}
          loading={loading}
          css={override}
          size={50}
        />
      )}
    </>
  );
};

export default AllUsers;
