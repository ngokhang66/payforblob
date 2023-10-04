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
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(morgan("dev"));
app.use(
  expressLimiter({
    windowMs: 1 * 60 * 1000,
    max: 20,
  })
);
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
    
    const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);
    const hexToString = convert("hex", "utf8");
    const base64ToHex = convert("base64", "hex");
    
    axios
      .get(`${process.env.LOCALHOST}/namespaced_shares/${id}/height/${height}`)
      .then( async (resp) => {
        const shares = await resp.data.shares;
        const prompt = hexToString(base64ToHex(shares[0].slice(16)));
      
        try {
          const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1024,
            temperature: 0.9,
          });
          
          res.json({shares: completion.data.choices[0].message.content, height: resp.data.height});
          
        } catch (error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            res.json(error.response.status);
          } else {
            console.log(error.message);
            res.json(error.message);
          }
        }
        
      })
      .catch((error) => {
        console.error(error);
        res.json(error);
      });
  }
);

const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
