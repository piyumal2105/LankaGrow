import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back to LankaGrow"
      subtitle="Sign in to continue growing your business with AI"
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
