"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NProgress = () => {
  return (
    <ProgressBar
      height="4px"
      color="blue"
      shallowRouting
      options={{ showSpinner: false }}
    />
  );
};

export default NProgress;
