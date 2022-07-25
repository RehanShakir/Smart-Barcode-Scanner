import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Table,
  Row,
  TableWrapper,
  Col,
  Rows,
} from "react-native-table-component";

const TableComponent = ({ tableData1 }) => {
  const tableTitle = [
    "Barcode",
    "  Choosed Insurances  ",
    " Claim Insurances ",
    "Upload Photos",
    "Claim Status",
    "Photos",
    "Date",
    "Delete",
  ];
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
            {/* <Row
              data={tableHead}
              style={styles.header}
              textStyle={styles.text}
              widthArr={[80, 200, 200, 200, 120, 200, 100, 180]}
            /> */}
            <TableWrapper style={styles.wrapper}>
              <Col
                data={tableTitle}
                style={styles.title}
                heightArr={[40, 40, 40, 40, 40, 40, 40, 40]}
                textStyle={styles.text}
              />
              <Rows
                data={tableData1}
                style={styles.row}
                textStyle={styles.text}
              />
            </TableWrapper>
          </Table>

          {/* <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              {tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  widthArr={[80, 200, 200, 200, 120, 200, 100, 180]}
                  style={[
                    styles.row,
                    index % 2 && { backgroundColor: "#F7F6E7" },
                  ]}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </ScrollView> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#5e72e4" },
  text: { textAlign: "center", fontWeight: "500", color: "black" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#E7E6E1" },
  wrapper: { flexDirection: "row" },
  title: { flex: 1, backgroundColor: "#f6f8fa" },
});

export default TableComponent;
