const express = require("express");
const axios = require("axios");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 2020;
app.listen(PORT, () => {
  console.log(`server listen at ${PORT}`);
});


app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.post("/", async (req, res) => {
  const videoId = extrectVideoId(req.body.videoID)
  // const videoId = req.body.videoID;
  console.log(videoId);
  if (videoId === undefined || videoId === "" || videoId === null) {
    return res.render("index", {
      success: false,
      message: " please enter the valid video ID",
    });
  } else {
    const options = {
      method: "GET",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      params: { id: videoId },
      headers: {
        "X-RapidAPI-Host": process.env.API_HOST,
        "X-RapidAPI-Key": process.env.API_KEY,
      },
    };

    axios
      .request(options)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          return res.render("index", {
            success: true,
            song_title: data.title,
            song_link: data.link,
          });
        } else
          return res.render("index", { success: false, message: data.msg });
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});

// "https://youtu.be/B5_6jfGsyjA"
// https://www.youtube.com/watch?v=B5_6jfGsyjA
// B5_6jfGsyjA


function extrectVideoId(videoUrl) {
  try {
    if (videoUrl.includes("/")) {
      if (videoUrl.includes("?v=")) {
        const arr = videoUrl.split("?v=");
        return arr[1];
      } else {
        const arr = videoUrl.split("/");
        return arr[arr.length - 1];
      }
    }
    return videoUrl;
    
  } catch (error) {
    return undefined
  }
  

}
