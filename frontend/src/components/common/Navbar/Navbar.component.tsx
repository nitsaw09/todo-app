"use client";

import { useContext } from "react";
import { Button } from "@/components/common/Button/Button.component";
import { AuthContext } from "@/lib/context/Auth.context";

export function Navbar() {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  return (
    <>
    {auth.isLoggedIn ? (    
      <nav>
        <Button variant="text" color="inherit" sx={{ float: "right", mr: 2 }} onClick={auth.handleLogout}>
          Logout
        </Button>
      </nav>) : null
    }
    </>
  );
}