// src/controller/userController/userUpdateSupabase.js
import supabase from "../../../config/db.js";

export default async function UpdateUser(req, res) {
  try {
    const { id, email_addresses, first_name, last_name, phone_numbers } = req.body.data;

    const email = email_addresses[0]?.email_address || "";
    const phone = phone_numbers?.[0]?.phone_number || "";
    const fullName = `${first_name || ""} ${last_name || ""}`.trim();

    // Update only if user with clerk_id exists
    const { data, error } = await supabase
      .from("users")
      .update({
        email,
        full_name: fullName,
        phone,
      })
      .eq("clerk_id", id)   // match by Clerk ID
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
