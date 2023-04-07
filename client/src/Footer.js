import React from "react";
import {
  PhoneOutlined,
  MailOutlined,
  FacebookFilled,
  AreaChartOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <section className="footer-container">
      <div className="container text-sdark">

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <p className="mb-3">
                <AreaChartOutlined className="align-middle" /> Check Uptime
                (soon) | <GithubOutlined className="align-middle" />{" "}
                <a href="https://github.com/ngokhang66?tab=repositories">
                  ngokhang66
                </a>{" "}
                |{" "} DC: animu#2746
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
