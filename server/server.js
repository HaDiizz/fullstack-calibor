require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const morgan = require("morgan");
const cron = require("node-cron");
const app = express();
const { notifyEvent } = require("./helpers/notify");
const Users = require("./models/userModel");
const Calendar = require("./models/calendarModel");
const Schedule = require("./models/scheduleModel");
const Group = require("./models/scheduleGroupModel");
const bodyParser = require('body-parser')

const whitelist = [
  "http://localhost:5173", // test
  "http://localhost:3000", // test
  "http://localhost:3001", // test
  "https://calibor.netlify.app", // https
  "http://calibor-special.com", // http
  "https://calibor.beantman.com", // https
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.JWT_SIGNIN_KEY));

cron.schedule(
  "0 23,7 * * *",
  () => {
    notifyCurrentDate();
    notifyCurrentDateSchedule();
    console.log("Sent notify successfully");
  },
  {
    timezone: "Asia/Bangkok",
  }
);

app.get("/", (req, res, next) => {
  res.send("Welcome 1.0");
});

// app.get("/set-cookie", (req, res) => {
//   res.cookie("myCookie", "cookieValue", { maxAge: 900000, httpOnly: true });
//   console.log(res.getHeaders()); // log the response headers
//   res.send("Cookie set successfully!");
// });

app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/boardRouter"));
app.use("/api", require("./routes/sectionRouter"));
app.use("/api", require("./routes/taskRouter"));
app.use("/api", require("./routes/calendarRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/scheduleRouter"));
app.use("/api", require("./routes/rateRouter"));

const URI = process.env.MONGODB_URL;

mongoose
  .connect(URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const notifyCurrentDate = async () => {
  try {
    const date = new Date();
    const users = await Users.find({ lineToken: { $ne: "" } }); // filter users with non-empty lineToken
    for (const user of users) {
      const currentDates = await Calendar.find({ user: user._id }).sort({
        start: 1,
      });
      let msg = "\nToday's Activity [Personal]";
      let activitiesFound = false;

      for (const dateItem of currentDates) {
        if (date >= dateItem.start && date < dateItem.end) {
          msg += `\n📌 ${dateItem.title}`;
          activitiesFound = true;
        }
      }

      if (!activitiesFound) {
        msg += `\n📌 No Activity`;
      }

      notifyEvent(msg, user.lineToken);
    }
  } catch (err) {
    console.error(err);
  }
};
const notifyCurrentDateSchedule = async () => {
  try {
    const date = new Date();
    const users = await Users.find({ lineToken: { $ne: "" } }); // filter users with non-empty lineToken
    for (const user of users) {
      const group = await Group.find({
        members: { $in: [user._id] },
      });
      const currentDates = await Schedule.find({ group: group[0]._id }).sort({
        start: 1,
      });
      let msg = `\nToday's Activity [Public]`;
      let activitiesFound = false;

      for (const dateItem of currentDates) {
        if (date >= dateItem.start && date < dateItem.end) {
          msg += `\n📌 ${dateItem.title}`;
          activitiesFound = true;
        }
      }

      if (!activitiesFound) {
        msg += `\n📌 No Activity`;
      }
      notifyEvent(msg, user.lineToken);
    }
  } catch (err) {
    console.error(err);
  }
};

const server = http.createServer(app);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Server is running at port", port);
});
