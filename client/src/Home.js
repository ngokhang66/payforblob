import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckOutlined,
  CompassOutlined,
  LoadingOutlined,
  CloseOutlined,
  ArrowUpOutlined,
  FireOutlined,
  AreaChartOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Button, Space, Card, Skeleton } from "antd";
import { toast } from "react-toastify";

const Home = () => {
  const [validated, setValidated] = useState(false);
  const [id, setId] = useState("");
  const [msgBefore, setMsgBefore] = useState("");
  const [msgH, setMsgH] = useState("");
  const [msgAfter, setMsgAfter] = useState("");
  const [height, setHeight] = useState("");
  const [txn, setTxn] = useState("");
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(2000);
  const [gasLimit, setGasLimit] = useState(80000);
  const [gasUsed, setGasUsed] = useState(0);
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");

  const gridStyle = {
    width: "40%",
    textAlign: "center",
  };

  const gridStyle1 = {
    width: "100%",
  };
    const gridStyle2 = {
    width: "60%",
    textAlign: "center",
  };

  const tabList = [
    {
      key: "tab1",
      tab: "Info",
    },
    {
      key: "tab2",
      tab: "Data",
    },
    {
      key: "tab3",
      tab: "Share Msg",
    },
  ];

  useEffect(() => {
    getId()
      .then((res) => {
        setId(res.data.id);
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again later");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (height) {
      getData(id, height).then((res) => {
        setShares(res.data.shares);
        setValidated(true);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again later");
        console.error(error);
      });
    }
  }, [height]);

  const getId = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/get-id`);
  };

  const postData = async (namespace_id, data, gas_limit, fee) => {
    return await axios.post(`${process.env.REACT_APP_API}/submit-pfb`, {
      namespace_id,
      msgBefore,
      gas_limit,
      fee,
    });
  };

  const getData = async (id, height) => {
    return await axios.get(
      `${process.env.REACT_APP_API}/namespaced_shares/${id}/height/${height}`
    );
  };

  const FormDataNot = () => (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className="form-group">
          <label>Namespace ID</label>
          <input
            type="text"
            className="form-control"
            value={id}
            placeholder="Random NamespaceID"
            onChange={(e) => setId(e.target.value)}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Node IP</label>
          <input
            type="text"
            className="form-control"
            value="http://127.0.0.1"
            placeholder="Write your message you want to sign on blockchain"
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Message data</label>
          <textarea
            type="text"
            className="form-control"
            value={msgBefore}
            maxLength="100"
            placeholder="Write ur message to sign on blockchain"
            required
            onChange={(e) => setMsgBefore(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="form-group col-6">
            <label>Fee</label>
            <input
              type="number"
              className="form-control"
              value={fee}
              placeholder="Fee for transaction"
              required
              onChange={(e) => setFee(e.target.value)}
            />
          </div>

          <div className="form-group col-6">
            <label>Gas Limit</label>
            <input
              type="number"
              className="form-control"
              value={gasLimit}
              maxLength="100"
              placeholder="Gas limit for transaction"
              required
              onChange={(e) => setGasLimit(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <Space>
            <Button
              onClick={handleSubmit}
              type="primary"
              shape="round"
              className="d-inline-flex align-items-center btn btn-primary"
              size="large"
              disabled={!msgBefore || !fee || !gasLimit}
            >
              Submit PayForBlob
            </Button>
          </Space>
        </div>
      </Card>
    </form>
  );


  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const contentList = {
    tab1: (
      <>
        <div className="row">
          <Card.Grid hoverable={false} style={gridStyle}>
            <ArrowUpOutlined className="align-middle" /> Height: {height}
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle2}>
            <FireOutlined
              className="align-middle"
              style={{ color: "orange" }}
            />{" "}
            Gas (use / want): {gasUsed} / 80000
          </Card.Grid>
          <Card.Grid
            hoverable={false}
            style={gridStyle1}
            className="text-center"
          >
            <CompassOutlined
              className="align-middle"
              style={{ color: "#4794ff" }}
            />{" "}
            TxHash:{" "}
            <a
              href={`https://testnet.mintscan.io/celestia-incentivized-testnet/txs/${txn}`}
            >
              {txn.substring(0, 10) + "..." + txn.substring(txn.length - 10)}
            </a>
          </Card.Grid>
        </div>
      </>
    ),
    tab2: (
      <>
        <div className="row">
          <Card.Grid hoverable={false} style={gridStyle1}>
            <label>Message</label>
            <input
              type="text"
              className="form-control"
              value={msgAfter}
              placeholder="Ur message here"
              onChange={(e) => setMsgAfter(e.target.value)}
              readOnly
            />
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle1}>
            <label>Message Hex</label>
            <input
              type="text"
              className="form-control"
              value={msgH}
              placeholder="Ur message here"
              onChange={(e) => setMsgH(e.target.value)}
              readOnly
            />
          </Card.Grid>
        </div>
      </>
    ),
    tab3: (
      <>
        <Card.Grid hoverable={false} style={gridStyle1}>
          <label>Shares data</label>
          <textarea
            type="text"
            className="form-control"
            value={shares}
            placeholder=" Shares Message"
            onChange={(e) => setShares(e.target.value)}
            rows="5"
            readOnly
          />
        </Card.Grid>
      </>
    ),
  };

  const FormDataHave = () => (
    <>
      <h4 className="text-center">
        Status: Success{" "}
        <CheckOutlined className="align-middle" style={{ color: "green" }} />{" "}
      </h4>
      <Card
        title="Transaction Details"
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    postData(id, msgBefore, 80000, 2000)
      .then(async (res) => {
        toast.success("Your transaction has been signed");
        const { dt, msgAfter, msgH } = await res.data;
        const { height, txhash, gas_used } = await dt;
        setHeight(height);
        setTxn(txhash);
        setMsgAfter(msgAfter);
        setMsgH(msgH);
        setGasUsed(gas_used);
        
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error with API, please try again later");
        setLoading(false);
        <h4 className="text-center">
          Status: Error{" "}
          <CloseOutlined className="align-middle" style={{ color: "red" }} />
        </h4>;
      });
    setMsgBefore("");
  };

  const LoadingCard = () => {
    return (
      <>
        <h4 className="text-center">
          Status: Loading <LoadingOutlined className="align-middle" />
        </h4>
        <Card>
          <Skeleton active></Skeleton>
        </Card>
      </>
    );
  };

  return (
    <div className="container p-3">
      <div className="row justify-content-center">
        <div className="col-md-9 col-md-offset-6 align-center">
          <h1 className="text-center">Pay For Blob</h1>
          <p className="text-center">
            This website is call the API in order to submit a PayForBlob
            transactions on Celestia network, and retrieve the data by block
            height and namespace.
          </p>

          {FormDataNot()}

          {loading // if loading is true, show the spinner
            ? LoadingCard()
            : validated
            ? FormDataHave()
            : null}
        </div>
      </div>
      <br/>
      <hr/>
      <div className=" row justify-content-center">
        <div className="col-md-8 ">
          
          <h5 className="text-uppercase text-center fw-600">
            Form parameters explanation:
          </h5>

          <ul className="list-group">
            <li className="list-item">Namespace ID - Random with 8 bytes.</li>
            <li className="list-item">
              Message - Write your message and data is in hex-encoded bytes.
            </li>
            <li className="list-item">
              Node IP - IP server of node running on celestia blockchain.
            </li>
            <li className="list-item">
              Fee - The fee to use for the transaction.
            </li>
            <li className="list-item">
              Gas Limit - The limit of gas to use for the transaction.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Home;
