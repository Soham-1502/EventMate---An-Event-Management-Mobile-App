import express from "express"
import UserRegister from "../controller/userController/userRegister.js";
import UserGet from "../controller/userController/userGet.js";
import deleteUser from "../controller/userController/userDelete.js";
import GetUserTickets from "../controller/userController/GetUserTickets.js";
import CreateUserIfNotExist from '../controller/userController/WebhookController/CreateUserIfNotExists.js'
import userCreateOrUpdate from "../controller/userController/userCreateorUpdate.js";
import UserUpdate from "../controller/userController/userUpdate.js";

const router = express.Router();

router.post("/register", UserRegister);

router.get("/login", UserGet);

// Add GET route for fetching user profile
router.get("/profile/:userId", UserGet);

router.put('/update/:userId', userCreateOrUpdate); // For create/update (upsert)

router.patch('/user/:userId', UserUpdate); // Keep existing for updates only

router.delete("/delete/:userId", deleteUser)

router.get("/:userId/tickets", GetUserTickets)

router.post("/webhook/clerk", CreateUserIfNotExist);

// In your backend - create a new endpoint
router.patch('/sync-clerk/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName } = req.body;
    
    // Update in your database first
    const { data, error } = await supabase
      .from('users')
      .update({ 
        full_name: `${firstName} ${lastName}`.trim() 
      })
      .eq('clerk_id', userId)
      .select();
    
    if (error) throw error;
    
    // Then update Clerk via their API
    const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
      }),
    });
    
    if (!clerkResponse.ok) {
      throw new Error('Failed to update Clerk');
    }
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;