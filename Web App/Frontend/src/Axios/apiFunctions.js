import server from "./index";

import { getToken } from "../Redux/localstorage";
const headerToken = {
  headers: {
    "x-access-token": getToken(),
  },
};
export const getAllUsersData = () =>
  server.get("/admin/all-users", headerToken);

export const getCounts = () => server.get("/admin/count", headerToken);

export const statusUpdate = (data) =>
  server.patch(
    `/admin/update-status/${data.id}`,
    { status: data.value },
    headerToken
  );

export const getScannedData = () =>
  server.get("/admin/scanned-data", headerToken);

export const getScannedDataLoggedInUser = () =>
  server.get("/barcode/data", headerToken);
