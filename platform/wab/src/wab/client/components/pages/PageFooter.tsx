import { U } from "@/wab/client/cli-routes";
import * as React from "react";

export function PageFooter() {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getCopyrightText = () => {
    const domain = window.location.hostname;

    // Define copyright text based on domain
    switch (domain) {
      case "builder.yurekai.com":
        return (
          <div>
            <div
              className={"LoginForm__FooterCopy"}
              style={{ marginTop: "2px", textAlign: "center" }}
            >
              © {getCurrentYear()} YurekAI for real estate - Powered by
              <a href="https://www.yurekai.com" style={{ color: "#1e73be" }}>
                YurekAI technologies
              </a>
            </div>
            <div
              className={"LoginForm__FooterCopy"}
              style={{ marginTop: "2px" }}
            >
              <p>YurekAI S.r.l. - Via Jervis 77, 10015 Ivrea, TO - Italy</p>
              <a
                href="https://labs.yurekai.com"
                style={{ color: "rgba(0, 0, 0, 0.87)", textDecoration: "none" }}
                target="_blank"
              >
                <b>Proudly made with ❤️ in the YurekAI's Labs 🧪</b>
              </a>
            </div>
          </div>
        );
      case "builder.newyurekai.com":
        return (
          <div>
            <div
              className={"LoginForm__FooterCopy"}
              style={{ marginTop: "2px", textAlign: "center" }}
            >
              © {getCurrentYear()} YurekAI for real estate - Powered by
              <a href="https://www.yurekai.com" style={{ color: "#1e73be" }}>
                YurekAI technologies
              </a>
            </div>
            <div
              className={"LoginForm__FooterCopy"}
              style={{ marginTop: "2px" }}
            >
              <p>New YurekAI Inc. - 112 Capitol TRL, Newark, DE - USA</p>
              <a
                href="https://labs.yurekai.com"
                style={{ color: "rgba(0, 0, 0, 0.87)", textDecoration: "none" }}
                target="_blank"
              >
                <b>Proudly made with ❤️ in the YurekAI's Labs 🧪</b>
              </a>
            </div>
          </div>
        );
      case "builder.swissyurekai.com":
        return (
          <div>
            <div
              className={"LoginForm__FooterCopy"}
              style={{ marginTop: "2px", textAlign: "center" }}
            >
              © {getCurrentYear()} YurekAI for real estate - Powered by
              <a href="https://www.yurekai.com" style={{ color: "#1e73be" }}>
                YurekAI technologies
              </a>
            </div>
            <div
              className={"LoginForm__FooterCopy"}
              style={{ marginTop: "2px" }}
            >
              <p>
                Augmented Reality Technology AG - Via Cantonale 13 - 6900
                Lugano, TI - Switzerland
              </p>
              <p>Register no CH-501.3.013.676-3 - CHE-115.192.512IVA</p>
              <a
                href="https://labs.yurekai.com"
                style={{ color: "rgba(0, 0, 0, 0.87)", textDecoration: "none" }}
                target="_blank"
              >
                <b>Proudly made with ❤️ in the YurekAI's Labs 🧪</b>
              </a>
            </div>
          </div>
        );
      default:
        return `Copyright © ${getCurrentYear()} Plasmic Inc. All rights reserved.`;
    }
  };

  return (
    <div className={"LoginForm__Footer"}>
      <div className={"LoginForm__FooterLinks"}>
        <a href={U.privacy({})}>Privacy Policy</a>
        <a href={U.tos({})}>Terms & Conditions</a>
      </div>
      {getCopyrightText()}
    </div>
  );
}
