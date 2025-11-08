import { Suspense } from "react";
import LoginUI from "./ui";

const LoginPage = () => {
  return (
    <Suspense>
      <LoginUI />
    </Suspense>
  );
};

export default LoginPage;
