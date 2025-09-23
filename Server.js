const express = require("express")
const app = express();
const Express_layout = require("express-ejs-layouts")
const path = require("path")
const Database = require("./Database.js")
const upload = require("./Utility/Multer.js");
const { check } = require("express-validator");
const Movie = require("./Models/Movies.Model.js")
const Cast = require("./Models/Owner.Model.js");
const { title } = require("process");
const { generateKey } = require("crypto");
const { Console } = require("console");
const { TicketToken, ValidToken } = require("./Utility/Ticket.Token.js")
const History = require("./Models/UserHistory.Model.js")

const CookieParser = require("cookie-parser")
app.use(express.json())
app.use(CookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(Express_layout)
app.use(express.static("./public"))
app.use(express.static("./public"))

app.use("/src", express.static(path.join(__dirname, "/public/src")))
app.use("/uploads", express.static(path.join(__dirname, "/public/uploads")))
app.use("/Movies", express.static(path.join(__dirname, "/public/uploads/src")))


app.set("view engine", "ejs")
app.set("layout", "./layout/Main")


const LoginRoute = require("./Routes/LoginandSignup.js");
app.use("/Site", LoginRoute)








// app.get("/Home/History/:id/:Payload",(req,res)=>{
//     try {
//         const Id = req.params.id
//         console.log(Id)

//         console.log("working")
//     } catch (error) {
//         console.log(error)
//     }
// })



















































app.get("/", (req, res) => {
    res.render("Home.ejs")
})

app.get("/Home", async (req, res) => {
    try {
        const data = await Movie.find({});
        res.render("User_Home", { data: data })
    } catch (error) {
        console.log("Error", error
        )
    }
})

app.get("/Home/DisplayMovie/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const GetMovieInfo = await Movie.findById(id).populate("Cast");
        const Arr = GetMovieInfo.showtimes[0].NumberSeat
        const AvalibleSeats = 40 - Arr.length;
        if (GetMovieInfo) {
            res.render("DisplayMovie", { data: GetMovieInfo, Description: GetMovieInfo.Cast.Description, AvalibleSeats: AvalibleSeats, DisPath: path })
        }

    } catch (error) {
        console.log(error)
    }
})

// app.get("/Home/GetTicket/:id", async(req,res)=>{
//     try {
//         const id = req. params.id;
//         const MovieData = await Movie.findById(id).populate("Cast");
//         console.log(MovieData)
//         res.render("BookTicket", {data : MovieData})
//     } catch (error) {
//         console.log(error)
//     }
// })
app.post("/Home/GetTicket/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const MovieData = await Movie.findById(id).populate("Cast");
        console.log(MovieData)
        res.render("BookTicket", { data: MovieData })
    } catch (error) {
        console.log(error)
    }
})
app.get("/Home/AddTicket/:List/:id/:Payload", async (req, res) => {
    try {
        var SeatARR = req.params.List.split(",")
        const id = req.params.id
        console.log(SeatARR)
        console.log(id)
        const payloadString = decodeURIComponent(req.params.Payload);
        console.log("Decoded Payload String:", payloadString);
        const Payload = JSON.parse(payloadString);
        console.log(Payload)

        const Token = req.cookies.uid
        const Email = ValidToken(Token).Email

        const MovieCast = await Movie.findById(id)
        console.log(MovieCast)

        const Cost = Payload.Cost
        const Seats = Cost / Payload.TicketPrice

        const UserHistory = new History({
            Email: Email,
            Movie: MovieCast.title,
            Img: MovieCast.posterImage,
            Cost: Cost,
            Seats: Seats
        })
        const IsSave = await UserHistory.save()
        if (IsSave) {
            console.log("History Added")
        }
        const UpdateMovie = await Movie.updateOne(
            {
                _id: id
            },
            {
                $set:
                {
                    showtimes:
                    {
                        NumberSeat: SeatARR,
                    }
                }
            }
        )
        if (UpdateMovie.acknowledged != undefined) {
            console.log("Data Updated")
            res.redirect("/home")
        }

    } catch (error) {
        console.log(error)
    }
})



// app.get("/Home/BookSeat/:id",(req,res)=>{
//     try {
//         const id = req. params.id;
//         console.log(id)
//     } catch (error) {
//         console.log(error)
//     }
// })

app.get("/Suggestion/:Val", async (req, res) => {
    try {
        const value = req.params.Val
        const data = await Movie.find({ title: { $regex: `^${value}`, $options: "i" } });
        if (data) {
            console.log("Good to go")
            return res.json(data)
        }
    } catch (error) {

    }
})
app.post("/Home/Search", async (req, res) => {
    try {
        const { MovieName } = req.body;
        const IsExist = await Movie.find({ title: { $regex: MovieName, $options: 'i' } });
        if (IsExist) {
            res.render("User_Home", { data: IsExist })
        }
        else {
            res.render("NotFoundQuery")
        }

    } catch (error) {
        console.log(error)
    }
})




































































app.get("/Admin", async (req, res) => {
    try {
        const data = await Movie.find({});
        console.log(data)
        res.render("Admin", { data: data, layout: "./layout/Admin" })
    } catch (error) {
        console.log("Error", error)
    }
})

app.get("/AdminPanel", (req, res) => {
    res.render("Panel", { layout: "./layout/Admin" })
})

app.get("/AddMovie", (req, res) => {
    const url = req.get("referer");
    console.log(url)
    let path = new URL(url).pathname;
    console.log(path)
    res.render("AddMovies", { path: path })
})
app.post("/AddMovie", upload.single("Thumbnail"), async (req, res) => {
    try {
        const { Title, Duration, TotalSeats, TicketPrice, Description, Genre } = req.body;
        const FileData = req.file;
        console.log(TicketPrice)

        if (!FileData || FileData.mimetype !== "image/jpeg") {
            return res.status(400).send("Thumbnail is required and must be a JPEG image.");
        }

        if ([Title, Duration, TotalSeats, TicketPrice, Description].some((check) => check.trim() === "")) {
            return res.status(400).send("All fields are required.");
        }

        // Find if movie already exists
        const MovieData = await Movie.findOne({ title: Title });
        if (MovieData) {
            return res.status(400).send("Movie with this title already exists.");
        }
        const Path = "/uploads/Movies/" + FileData.filename;
        const AddCast = new Cast({
            Title: Title,
            Description: Description,
        })
        const SaveCast = await AddCast.save();
        const CastId = await Cast.findOne({ Title: Title })
        console.log(CastId)
        const ID = CastId._id.toString()
        const AddMovie = new Movie({
            title: Title,
            genre: Genre,
            posterImage: Path,
            TicketPrice: TicketPrice,
            Duration: parseInt(Duration),
            totalSeats: parseInt(TotalSeats),
            showtimes: [{

                NumberSeat: [],
            }],
            Cast: ID
        });


        const SaveData = await AddMovie.save();
        console.log("Data Added")
        res.redirect("/Admin")

    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).send("Internal server error.");
    }
});

app.get("/Admin/UpdateMovie/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const FindMovie = await Movie.findById(id).populate("Cast"); // Populating Cast details
        if (!FindMovie) {
            return res.status(404).send("Movie not found.");
        }
        console.log("FindMovie", FindMovie);
        res.render("UpdateMovie", { data: FindMovie, Description: FindMovie.Cast.Description }); // Pass movie data to the view

    } catch (error) {
        console.log("Error", error);
        res.status(500).send("Server error occurred.");
    }
});

app.post("/Admin/UpdateMovie/:id", upload.single("Thumbnail"), async (req, res) => {
    try {
        const id = req.params.id;
        const { Title, Duration, TotalSeats, TicketPrice, Description, Genre } = req.body;
        const FileData = req.file;

        // Check if the movie exists
        const FindMovie = await Movie.findById(id);
        if (!FindMovie) {
            return res.status(404).send("Movie not found.");
        }

        // Validate inputs
        if ([Title, Duration, TotalSeats, TicketPrice, Description].some((check) => check.trim() === "")) {
            return res.status(400).send("All fields are required.");
        }

        // If a file is uploaded, validate its format and set the path
        let Path = FindMovie.posterImage; // Keep existing image if none is uploaded
        if (FileData) {
            if (FileData.mimetype !== "image/jpeg") {
                return res.status(400).send("Thumbnail must be a JPEG image.");
            }
            Path = "/uploads/Movies/" + FileData.filename;
        }

        // Update the movie details
        await Movie.updateOne(
            { _id: id },
            {
                $set: {
                    title: Title,
                    genre: Genre,
                    posterImage: Path,
                    TicketPrice: TicketPrice,
                    Duration: parseInt(Duration),
                    totalSeats: parseInt(TotalSeats),
                    showtimes: [{

                        NumberSeat: [], // Assuming empty array for now

                    }],
                }
            }
        );

        // Update the related Cast
        const FindCast = await Cast.findById(FindMovie.Cast);
        if (FindCast) {
            await Cast.updateOne(
                { _id: FindCast._id },
                {
                    $set: {
                        Title: Title,
                        Description: Description
                    }
                }
            );
        }

        console.log("Movie and Cast updated successfully");
        res.status(200).send("Movie updated successfully");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error occurred");
    }
});



app.get("/MovieDelete/:id", async (req, res) => {
    try {
        const id = req.params.id
        const MovieData = await Movie.findById(id)
        const DeleteMovie = await Movie.deleteOne({ _id: id })

        const DeleteCast = await Cast.deleteOne({ Title: MovieData.title })
        console.log("Data Deleted")
        res.redirect("/Admin")

    } catch (error) {
        console.log(error)
    }
})


app.get("/Code", (req, res) => {
    res.render("Code", { layout: "./layout/Default" })
})
const { exec } = require("child_process");

app.post("/run", (req, res) => {
    const code = req.body.code;
    const sanitizedCode = code.replace(/"/g, '\\"').replace(/\n/g, '\\n');

    exec(`node -e "${sanitizedCode}"`, (error, stdout, stderr) => {
        if (error) {
            res.json({ output: stderr || error.message });
        } else {
            res.json({ output: stdout });
        }
    });
});




app.listen(3000, () => {
    console.log("app listening at Port 3000")
})


