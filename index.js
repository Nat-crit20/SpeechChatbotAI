const express = require("express");
const socketio = require("socket.io");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const app = express();

// Serve static files from the "views" and "public" directories
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// Handle requests for the root URL
app.get("/", (req, res) => {
  // Use the correct absolute path to the index.html file
  res.sendFile(__dirname + "/views/index.html");
});

// Start the server on port 3000
const server = app.listen(3000, () => {
  console.log("Listening on port 3000");
});
const io = socketio(server);
io.on("connection", function (socket) {
  console.log("user connected");
  socket.on("chat message", (message) => {
    console.log(message);

    const callapibot = async (projectId) => {
      try {
        const sessionId = uuid.v4();
        const sessionClient = new dialogflow.SessionsClient({
          keyFilename: "./vax-tvmb-42f1e797fa13.json",
        });
        const sessionPath = sessionClient.projectAgentSessionPath(
          projectId,
          sessionId
        );
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              text: message,
              languageCode: "en-US",
            },
          },
        };
        const response = await sessionClient.detectIntent(request);
        const result = response[0].queryResult.fulfillmentText;
        socket.emit("bot reply", result);
        console.log(result);
        if (result.intent) {
          console.log(`Intent: ${result.intent.displayName}`);
        } else {
          console.log("No intent matched");
        }
      } catch (error) {
        console.log(error);
      }
    };

    callapibot();
  });
});
