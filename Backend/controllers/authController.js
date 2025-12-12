import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import Moment from "../models/moment.js";
import Fixture from "../models/fixture.js";
import Quote from "../models/quote.js";
import Technique from "../models/technique.js";
import Session from "../models/session.js";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createTokenAndSetCookie = (res, user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        partitioned: true
    });
};

// Add default moments for the new user 
const defaultMoments = [
    { imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765029203/rcb.jpg", sport: "Cricket", title: "RCB Won This Year IPL", description: "I was extremely happy when RCB finally won this year IPL. It was their first win and I still can’t believe it happened. The joy and excitement of watching the team lift the trophy was unforgettable and truly special for all the fans.", date: "2025-06-03" },
    { imageUrl: "", sport: "Football", title: "Argentina Won FIFA World Cup 2022", description: "I was overjoyed when Argentina won the 2022 FIFA World Cup. The match was thrilling and seeing the team lift the trophy felt surreal. I still can’t believe the incredible journey and the unforgettable moments of that tournament.", date: "2022-12-18" },
    { imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765029367/india%20vs%20new%20zealand.jpg", sport: "Cricket", title: "India vs New Zealand Heart Breaking Semi Final 2019", description: "Watching India play against New Zealand in the 2019 semi final was heartbreaking. I felt so proud of the team for giving their best, yet so sad when the match ended. It was a rollercoaster of emotions that I will never forget.", date: "2019-07-10" },
    { imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765029450/lakers%20win.jpg", sport: "Basketball", title: "Lakers Win NBA Finals 2020", description: "I was thrilled when the Lakers clinched the 2020 NBA Finals. Witnessing the team's hard work pay off and seeing the championship celebration was unforgettable. The energy and excitement of the game made it a truly special moment.", date: "2020-10-11" },
    { imageUrl: "", sport: "Cricket", title: "England Won 2019 Cricket World Cup", description: "I could not stop cheering when England won the 2019 Cricket World Cup. The final was so intense and nerve-wracking, and I still remember the excitement when the match ended in a super over. It was an amazing experience to witness history.", date: "2019-07-14" },
];

// Default fixtures for new users
const defaultFixtures = [
    { team1: "INDIA", team2: "PAK", sport: "Cricket", date: "2024-11-19", time: "09:30" },
    { team1: "AUSTRALIA", team2: "ENG", sport: "Cricket", date: "2024-11-20", time: "14:00" },
    { team1: "BARCELONA", team2: "REAL MADRID", sport: "Football", date: "2024-11-22", time: "20:45" },
    { team1: "MAN UNITED", team2: "ARSENAL", sport: "Football", date: "2024-11-23", time: "" },
    { team1: "BULLS", team2: "CELTICS", sport: "Basketball", date: "2024-11-25", time: "" }
];

const defaultQuotes = [
    { quote: "Whatever you want to do, do with full passion and work really hard towards it. Don't look anywhere else.", author: "Virat Kohli", imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765129338/virat.jpg" },
    { quote: "I hated every minute of training, but I said, 'Don’t quit. Suffer now and live the rest of your life as a champion.'", author: "Muhammad Ali", imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765129578/muhammad.jpg" },
    { quote: "Success isn’t owned. It’s leased. And rent is due every day.", author: "J.J. Watt", imageUrl: "" },
];

const defaultTechniques = [
    {
        title: "Rainbow Flick",
        steps: [
            "Place your dominant foot in front of the ball",
            "Roll the ball up the back of your standing leg",
            "Flick your standing leg forward and upward",
            "The ball should arc over your head and land in front of you"
        ],
        sport: "Football"
    },
    {
        title: "Cover Drive",
        steps: [
            "Take a side-on stance",
            "Step forward with your front foot toward the pitch of the ball",
            "Swing the bat smoothly along the ground",
            "Hit the ball along the ground through the cover region"
        ],
        sport: "Cricket"
    },
    {
        title: "Reverse Sweep",
        steps: [
            "Take a normal batting stance",
            "Rotate your wrists and bat to sweep the ball opposite direction",
            "Bend your knees slightly for balance",
            "Follow through to guide the ball past fielders"
        ],
        sport: "Cricket"
    },
    {
        title: "Jump Smash",
        steps: [
            "Stand in a ready position with knees slightly bent",
            "Move quickly under the shuttle and jump upward",
            "Rotate your shoulders and swing your racket overhead",
            "Hit the shuttle downward with power while landing balanced"
        ],
        sport: "Badminton"
    },
    {
        title: "Crossover Dribble",
        steps: [
            "Start dribbling the ball with your dominant hand",
            "Lower your body to maintain control",
            "Quickly bounce the ball to your opposite hand",
            "Explode in the new direction to beat your defender"
        ],
        sport: "Basketball"
    }
];

const defaultSessions = [
    { title: "Morning Basketball Drills", exercises: ["Warm-up jog (5 mins)", "Dribbling practice", "Layup drills", "Free-throw routine", "Cooldown stretches"] },
    { title: "Badminton Smash Training", exercises: ["Warm-up footwork", "Shadow swings", "Smash repetitions", "Net recovery drills"] },
    { title: "Football Dribbling Drills", exercises: ["Cone dribbling", "Fast touches", "Directional changes", "Ball control challenges"] },
    { title: "Cardio and Endurance", exercises: ["5km run", "Interval sprints", "Jump rope (10 mins)", "Cooldown stretching"] },
    { title: "Badminton Rally Session", exercises: ["Long rallies", "Placement shots", "Side-to-side drills"] },
    { title: "Football Shooting Practice", exercises: ["First-touch shots", "Power shooting", "Target accuracy"] },
    { title: "Badminton Footwork Practice", exercises: ["Front-back steps", "Side-to-side steps", "Recovery training"] },
]

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

        if (username.length < 5) {
            return res.status(400).json({ message: "Username must have at least 5 characters." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must have at least 6 characters." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        // Add default moments
        const userMoments = defaultMoments.map(moment => ({ ...moment, userId: newUser._id }));
        await Moment.insertMany(userMoments);

        // Add default fixtures
        const userFixtures = defaultFixtures.map(fixture => ({ ...fixture, userId: newUser._id, date: new Date(fixture.date) }));
        await Fixture.insertMany(userFixtures);

        // Add default quotes
        const userQuotes = defaultQuotes.map(quote => ({ ...quote, userId: newUser._id }));
        await Quote.insertMany(userQuotes);

        // Add default techniques
        const userTechniques = defaultTechniques.map(technique => ({ ...technique, userId: newUser._id }));
        await Technique.insertMany(userTechniques);

        // Add default sessions
        const userSessions = defaultSessions.map(session => ({ ...session, userId: newUser._id }));
        await Session.insertMany(userSessions);



        createTokenAndSetCookie(res, newUser);

        res.status(201).json({
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect password" });

        createTokenAndSetCookie(res, user);

        res.status(200).json({
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Google login
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            // New Google user creates user in db
            user = await User.create({ username: name, email, password: null, googleUser: true });

            // Add default moments for new Google user
            const userMoments = defaultMoments.map(moment => ({ ...moment, userId: user._id }));
            await Moment.insertMany(userMoments);

            // Add default fixtures
            const userFixtures = defaultFixtures.map(fixture => ({ ...fixture, userId: user._id, date: new Date(fixture.date) }));
            await Fixture.insertMany(userFixtures);

            // Add default quotes
            const userQuotes = defaultQuotes.map(quote => ({ ...quote, userId: user._id }));
            await Quote.insertMany(userQuotes);

            // Add default techniques
            const userTechniques = defaultTechniques.map(technique => ({ ...technique, userId: user._id }));
            await Technique.insertMany(userTechniques);

            // Add default sessions
            const userSessions = defaultSessions.map(session => ({ ...session, userId: user._id }));
            await Session.insertMany(userSessions);

        }

        createTokenAndSetCookie(res, user);
        res.status(200).json({ user: { id: user._id, username: user.username, email: user.email } });

    } catch (err) {
        console.error("Google login error:", err);
        res.status(400).json({ message: "Google login failed" });
    }
};

// Admin login
export const adminLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: "Username and password required" });

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const adminUser = { id: "admin-unique-id", username: username, isAdmin: true };

    const token = jwt.sign(
        { id: adminUser.id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        partitioned: true
    });


    res.status(200).json({ user: adminUser });
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        partitioned: true
    });
    res.json({ message: "Logged out successfully" });
};

// export const getSession = async (req, res) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) return res.json({ user: null });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select("-password");
//         if (!user) return res.json({ user: null });

//         res.json({ user: { id: user._id, username: user.username, email: user.email } });
//     } catch (err) {
//         res.json({ user: null });
//     }
// };

export const getSession = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ user: null });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === "admin") {
            return res.json({ user: { id: decoded.id, username: "Admin", isAdmin: true } });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.json({ user: null });

        res.json({ user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.json({ user: null });
    }
};
