import React from "react";

// core components
import CardsHeader from "components/Headers/CardsHeader.js";
import ReactBSTables from "../tables/ReactBSTables";
import { Button } from "reactstrap";
import { useQuery } from "react-query";
import {
  getCounts,
  getAllUsersData,
  userCounts,
} from "../../../Axios/apiFunctions";
import { useHistory } from "react-router-dom";

import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

function Dashboard() {
  const history = useHistory();
  const { data } = useQuery("getCounts", () => getCounts());
  console.log(data);

  const { isLoading: dataLoading, data: scannedData } = useQuery(
    "getAllUsersData",
    () => getAllUsersData()
  );
  const barcodeData3 = (data, index) => {
    return {
      key: index,
      name: data.fullName,
      email: data.email,
      status: data.status,
      detail: (
        <Button
          style={{ marginTop: 10, marginLeft: 10 }}
          size='sm'
          color='info'
          onClick={() =>
            history.push({ pathname: "/admin/details", state: data })
          }>
          View More
        </Button>
      ),
    };
  };

  const cardsDataAdmin = {
    card1Name: "Total Users",
    card2Name: "Pending Users",
    card3Name: "Approved Users",
    card4Name: "Scanned Barcodes",
    card1Count: data?.data?.users,
    card2Count: data?.data?.pendingUsers,
    card3Count: data?.data?.approvedUsers,
    card4Count: data?.data?.scannedBarcodes,
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
      dataField: "status",
      text: "Status",
      sort: true,
    },
    { dataField: "detail", text: "Details" },
  ];

  const override = css`
    display: block;
    margin: 0 auto;
  `;
  return (
    <>
      <CardsHeader
        name='Admin'
        parentName='Dashboard'
        cardsData={cardsDataAdmin}
      />
      <HashLoader
        color={"#5e72e4"}
        loading={dataLoading}
        css={override}
        size={50}
      />
      {dataLoading || (
        <ReactBSTables
          disabled={false}
          columns={columns}
          dataTable={scannedData?.data?.users?.map(barcodeData3)}
          tableTitle={"Scanned Data"}
        />
      )}
    </>
  );
}

export default Dashboard;
