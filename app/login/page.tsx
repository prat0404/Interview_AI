"use client";
import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";
import Register from "./RegLog";
import Login from "./RegLog";

import Layout from "@/layouts/Layout";

const Authentication = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <Register />
    </Layout>
  );
};

export default Authentication;
