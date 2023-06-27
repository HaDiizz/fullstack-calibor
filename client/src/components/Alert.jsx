import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import Toast from "./Toast";

const Alert = () => {
  const { alert } = useSelector((state) => state);

  return (
    <>
      {alert.loading && <Loading />}
      {alert.error && <Toast msg={{ msg: alert.error, statusErr: "error" }} />}
      {alert.success && (
        <Toast msg={{ msg: alert.success, statusSucc: "success" }} />
      )}
    </>
  );
};

export default Alert;