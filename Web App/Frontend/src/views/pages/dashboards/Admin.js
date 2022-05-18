import React from "react";
// node.js library that concatenates classes (strings)
// import classnames from "classnames";
// javascipt plugin for creating charts
// import { Chart } from "chart.js";
// react plugin used to create charts
// import { Line, Bar } from "react-chartjs-2";
// // reactstrap components
// import {
//   Badge,
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   DropdownMenu,
//   DropdownItem,
//   DropdownToggle,
//   UncontrolledDropdown,
//   Form,
//   Input,
//   ListGroupItem,
//   ListGroup,
//   Media,
//   NavItem,
//   NavLink,
//   Nav,
//   Progress,
//   Table,
//   Container,
//   Row,
//   Col,
//   UncontrolledTooltip,
// } from "reactstrap";

// core components
import CardsHeader from "components/Headers/CardsHeader.js";
import ReactBSTables from "../tables/ReactBSTables";
import { useQuery } from "react-query";
import { getCounts, getScannedData } from "../../../Axios/apiFunctions";

// import {
//   chartOptions,
//   parseOptions,
//   chartExample1,
//   chartExample2,
// } from "variables/charts.js";

function Dashboard() {
  // const [activeNav, setActiveNav] = React.useState(1);
  // const [chartExample1Data, setChartExample1Data] = React.useState("data1");
  // const toggleNavs = (e, index) => {
  //   e.preventDefault();
  //   setActiveNav(index);
  //   setChartExample1Data(chartExample1Data === "data1" ? "data2" : "data1");
  // };
  // if (window.Chart) {
  //   parseOptions(Chart, chartOptions());
  // }

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

  return (
    <>
      <CardsHeader
        name='Admin'
        parentName='Dashboard'
        cardsData={cardsDataAdmin}
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
