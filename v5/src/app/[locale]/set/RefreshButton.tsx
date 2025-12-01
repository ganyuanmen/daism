"use client";

import { Button } from "react-bootstrap";

export default function RefreshButton() {
  const handleClick = () => {
   window.location.reload();
  };

  return (
    <Button  variant="link" onClick={handleClick}  >
      refresh
    </Button>
  );
}
