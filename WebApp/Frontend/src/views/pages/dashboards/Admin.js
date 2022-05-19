import React from "react";

// core components
import CardsHeader from "components/Headers/CardsHeader.js";
import ReactBSTables from "../tables/ReactBSTables";
import { useQuery } from "react-query";
import { getCounts, getScannedData } from "../../../Axios/apiFunctions";

import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

function Dashboard() {
  const { data } = useQuery("getCounts", () => getCounts());

  const { isLoading: dataLoading, data: scannedData } = useQuery(
    "getScannedData",
    () => getScannedData()
  );

  const barcodeData3 = (data, index) => {
    return {
      key: index,
      name: data.userId.fullName,
      email: data.userId.email,
      barcode: data.barcode,
      status: data.userId.status,
      buttons: data.buttons + ",",
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
      text: "Scanned By",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "barcode",
      text: "Bar Code",
      sort: true,
    },
    {
      dataField: "status",
      text: "status",
      sort: true,
    },
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
          columns={columns}
          dataTable={scannedData?.data?.scannedData?.map(barcodeData3)}
          tableTitle={"Scanned Data"}
        />
      )}
    </>
  );
}

export default Dashboard;
