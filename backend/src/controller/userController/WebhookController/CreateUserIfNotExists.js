// src/controller/userController/userRegisterSupabase.js
import supabase from "../../../config/db.js"; 

export default async function CreateUserIfNotExist(req, res) {
  try {
    const { id, email_addresses, first_name, last_name, phone_numbers } = req.body.data; 
    // Clerk webhook sends this structure

    const email = email_addresses[0]?.email_address || "";
    const phone = phone_numbers?.[0]?.phone_number || "";
    const fullName = `${first_name || ""} ${last_name || ""}`.trim();

    // Insert new user into Supabase
    const { data, error } = await supabase
      .from("users")
      .upsert([
        {
          clerk_id: id,              // Clerk’s unique ID
          email,
          full_name: fullName,
          phone,
          role: "attendee",          // default role
          organization: "",
          approved: false,
        },
      ],
        { onConflict: ["clerk_id"] } // update if same Clerk user exists
      )
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};