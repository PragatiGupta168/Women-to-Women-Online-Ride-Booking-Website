const userModel = require('../models/user.model');
const userService = require('../services/user.service');


module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {firstname, lastname, email, password} = req.body;

    const hasedpassword = await bcrypt.hash(password);

    const user = await userService.createUser({
        firstname,
        lastname,
        email,
        password: hasedpassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
}