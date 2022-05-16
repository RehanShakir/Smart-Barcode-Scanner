import React, { useState, useEffect, useCallback } from "react";
import ReactBSTables from "./tables/ReactBSTables";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { useSelector } from "react-redux";

import { Form, Input } from "reactstrap";
import { Select } from "antd";
import server from "../../Axios/index";
import { getToken } from "../../Redux/localstorage";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationAlert from "react-notification-alert";
import { getAllUsersData, statusUpdate } from "../../Axios/apiFunctions";

const { Option } = Select;

const AllUsers = () => {
  const notificationAlertRef = React.useRef(null);
  const notify = (type, title, message) => {
    let options = {
      place: "tc",
      message: (
        <div className='alert-text'>
          <span className='alert-title' data-notify='title'></span>
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
    console.log(data.id);
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
  ];
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
      };
    });
  }

  return (
    <>
      <NotificationAlert ref={notificationAlertRef} />

      <SimpleHeader name='Admin' parentName='Tables' />

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
