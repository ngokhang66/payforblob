const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { readdirSync } = require("fs");
const crypto = require("crypto");
const helmet = require("helmet");
const xss = require("xss-clean");
const expressLimiter = require("express-rate-limit");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
// app.use(
//   expressLimiter({
//     windowMs: 1 * 60 * 1000,
//     max: 20,
//   })
// );
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());
app.use(xss());
app.use(helmet());

app.get(`${process.env.API}/get-id`, (req, res) => {
  try {
    const id = crypto.randomBytes(8).toString("hex");

    res.json({ id });
  } catch (err) {
    console.log(err);
    res.status(404).send("error");
  }
});

// app.post(`${process.env.API}/genadata`, async (req, res) => {
//   try {
//     const text = await req.body.msg;

//     const mes = Buffer.from(text).toString("hex");
//     res.json({ mes });
//   } catch (err) {
//     console.log(err);
//     res.status(404).send("error");
//   }
// });

app.post(`${process.env.API}/submit-pfb`, async (req, res) => {
  try {
    const { namespace_id, msgBefore, gas_limit, fee } = await req.body;
    console.log(req.body);
    const data = Buffer.from(msgBefore).toString("hex");

    axios
      .post(`${process.env.LOCALHOST}/submit_pfb`, {
        namespace_id,
        data,
        gas_limit,
        fee,
      })
      .then(async (resp) => {
        const dt = await resp.data;
        // res.json(resp.data);
        res.send(JSON.stringify({ msgAfter: msgBefore, msgH: data, dt }));
      })
      .catch((error) => {
        console.error(error);
        res.status(404).send("error axios");
      });
  } catch (err) {
    console.log(err);
    res.status(404).send("error");
  }
});

app.get(
  `${process.env.API}/namespaced_shares/:id/height/:height`,
  async (req, res) => {
    const { id, height } = req.params;
    console.log(id, "  ", height);

    axios
      .get(`${process.env.LOCALHOST}/namespaced_shares/${id}/height/${height}`)
      .then((resp) => {
        res.json(resp.data);
        console.log(resp.data);
      })
      .catch((error) => {
        console.error(error);
        res.json(error);
      });
  }
);

// port
const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
