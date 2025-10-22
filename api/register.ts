import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const token: string | undefined = req.body?.token;

  if (!token) {
    res.status(400).send("Missing token");
    return;
  }

  console.log("Received JWT:", token);
  res.status(200).send("Token received");
}
