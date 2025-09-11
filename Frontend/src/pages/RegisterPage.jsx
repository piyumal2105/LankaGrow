import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <AuthLayout
      title="Start Your AI Journey"
      subtitle="Join thousands of Sri Lankan businesses growing with AI"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
