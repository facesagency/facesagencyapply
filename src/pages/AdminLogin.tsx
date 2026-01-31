import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Admin Disabled
      </h1>

      <p style={{ marginBottom: 16 }}>
        This deployment no longer uses Supabase. Admin authentication is disabled.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
      >
        Back to Registration
      </button>
    </div>
  );
}
