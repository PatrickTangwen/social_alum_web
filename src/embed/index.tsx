import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RegistrationEmbed } from "./RegistrationEmbed";
import "./embed.css";

// Entry of the embeddable build (dist-embed/career-explorer-registration.js). The Host Page
// loads the script and the stylesheet, and puts the placeholder wherever the form belongs:
//   <div data-career-explorer-registration></div>
// Placeholders present when the script runs are mounted automatically; ones added later
// can be mounted with the global `CareerExplorerRegistration.mount(element)`.

export function mount(element: Element) {
  createRoot(element).render(
    <StrictMode>
      <RegistrationEmbed />
    </StrictMode>,
  );
}

function mountPlaceholders() {
  document.querySelectorAll("[data-career-explorer-registration]").forEach(mount);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountPlaceholders);
} else {
  mountPlaceholders();
}
