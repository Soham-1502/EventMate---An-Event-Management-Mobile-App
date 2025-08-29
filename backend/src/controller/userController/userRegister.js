import supabase from "../../config/db.js";

async function UserRegister(req, res) {
    const {full_name, email, password, phone, role, organization} = req.body;

    try {

    if (!email || !password || !role) {
        return res.status(400).send({message:"Email, passowrd and role are required."});
    }

    const allowedRole = ['attendee'];

    if (!allowedRole.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified. Users can only sign up as attendee." });
    }
    
    // const hashedPassword = await bcyrpt.hash(password,10);
    // console.log(hashedPassword);

    
    const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single(); // ensures it returns just one row if found
    
    if (existingUser) {
        return res.status(409).send({
            message: "User with this email already exists. Please Login In."
        });
    }

    if (checkError && checkError.code !== 'PGRST116') {
            // Not a 'No rows found' error
            return res.status(500).send({
                message: "Error checking existing user",
                error: checkError.message
            });
    }
    
    const {data, error} = await supabase.from('users').insert([{
        email,
        password,
        full_name,
        phone,
        role,
        organization
    }]).select()
    
    if (error) {
        return res.status(500).send({
            message:"Failed to register user",
            error: error.message
        })
    }

    return res.status(201).send({
        message:"User registration successful",
        user: data
    })
    } catch (error) {
        return res.status(500).send({
            message:"Internal Server Error",
            error : error
        })
    }
}

export default UserRegister