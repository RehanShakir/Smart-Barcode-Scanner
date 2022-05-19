import React from "react";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import ReactBSTables from "../tables/ReactBSTables";
import { useQuery } from "react-query";
import { getScannedDataLoggedInUser } from "../../../Axios/apiFunctions";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

function Dashboard() {
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
    };
  };

  const columns = [
    {
      dataField: "barcode",
      text: "Bar Code",
      sort: true,
    },
    {
      dataField: "buttons",
      text: "buttons",
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
    </>
  );
}

export default Dashboard;
