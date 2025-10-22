import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabase.from("holidays").select("date");
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ holidays: data.map((d) => d.date) });
    return;
  }

  if (req.method === "POST") {
    const { holidays } = req.body;
    if (!Array.isArray(holidays)) {
      res.status(400).json({ error: "Invalid format" });
      return;
    }

    await supabase.from("holidays").delete().neq("id", "");
    const inserts = holidays.map((d: string) => ({ date: d }));
    const { error } = await supabase.from("holidays").insert(inserts);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ success: true });
    return;
  }

  res.status(405).end();
}
