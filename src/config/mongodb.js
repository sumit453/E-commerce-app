import { MongoClient } from "mongodb";

let clint;

export const connectToMongodb = () => {
  MongoClient.connect(process.env.DB_URL) // using .env insted of mongodb url
    .then((clintInstence) => {
      clint = clintInstence;
      console.log("Mongodb is connected");
      createIndexData(clint.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClint = () => {
  return clint;
};

export const getDB = () => {
  return clint.db();
};

const createIndexData = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 });
    await db.collection("products").createIndex({ name: 1, category: -1 });
    await db.collection("products").createIndex({ desc: "text" });
  } catch (err) {
    console.log(err.message);
  }
};
