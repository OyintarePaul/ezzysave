"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NProgress = () => {
  return (
    <ProgressBar
      height="10px"
      color="red"
      shallowRouting
      options={{ showSpinner: false }}
    />
  );
};

export default NProgress;
