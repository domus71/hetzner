const config = require("./config.json");
const axios = require("axios");
const Hetzner = require("hetzner-dns");
const Client = new Hetzner(config.hetznerApi);

const main = async () => {
  try {
    const result = await axios.get(config.myipbot);
    const myIP = result.data;

    const zones = await Client.Zones.GetAll(1, 10, config.domain);
    const zone = zones["zones"].find((z) => {
      return z.name === config.domain;
    });

    const records = await Client.Records.GetAll(1, 10, zone.id);
    const record = records["records"].find((r) => {
      return r.name === config.host;
    });

    const data = await Client.Records.Update(
      record.id,
      zone.id,
      config.host,
      "A",
      myIP,
      config.ttl
    );

    const newRecord = await Client.Records.Get(record.id);
    //console.log(newRecord);
  } catch (error) {
    console.log(error);
  }
};
main();
