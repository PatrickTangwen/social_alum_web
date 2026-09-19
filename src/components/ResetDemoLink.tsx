"use client";

import { resetDemo } from "@/demo/storage";

export function ResetDemoLink() {
  return (
    <button
      type="button"
      onClick={() => {
        resetDemo();
        window.location.reload();
      }}
      className="ce:text-link ce:underline-offset-2 ce:hover:underline"
    >
      Reset demo
    </button>
  );
}
