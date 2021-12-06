const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51IdwfeH8KzFo5uc9YHKzp2HOPkZJvH0ij0qhWeg0wQ17G73o5fVJYjMkWOfAmWUgjVZe0DesJvrQKbmAPSacXsVP00qMXnEqFr"
);
const { v4: uuidv4 } = require("uuid");
// Getting Module
const Products_Model = require("../models/Products");
const MainStore_Model = require("../models/MainStore");

const FeaturedProduct_Model = require("../models/FeaturedProduct");


const FileUpload_Model = require("../models/FileUpload");


function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

// TEST
// @GET TEST
// GET
router.get("/test", (req, res) => {
  res.send("Working");
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getallproductapi", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Products_Model.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getallproductsmainstorefilters/:filter", (req, res) => {
  const { filter } = req.params;
  res.setHeader("Content-Type", "application/json");
  MainStore_Model.find({ gender: filter })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the Product Details
// GET
router.patch("/hidefeatured/:id", async (req, res) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "application/json");
  const product = await FeaturedProduct_Model.find({ _id: id });
  await FeaturedProduct_Model.findByIdAndUpdate(
    id,
    { ...product, hidden: true },
    { new: true, useFindAndModify: false }
  )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.patch("/unhidefeatured/:id", async (req, res) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "application/json");
  const product = await FeaturedProduct_Model.find({ _id: id });
  await FeaturedProduct_Model.findByIdAndUpdate(
    id,
    { ...product, hidden: false },
    { new: true, useFindAndModify: false }
  )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/getproductitemdetails/:id", (req, res) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "application/json");
  MainStore_Model.find({ _id: id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});



// Database CRUD Operations
// @POST Request to GET the People
// POST
router.post("/addfileuploadtoserver", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    useremail,
    userfullname,
    userphone,
    name,
    cut,
    content,
    uploaded_to,
    status,
    reception,
    delivery_date,
    publicURL
  } = req.body;

  FileUpload_Model.countDocuments({ publicURL }).then((count) => {
    if (count === 0) {
      const newProductMainStore = new FileUpload_Model({
        useremail,
        userfullname,
        userphone,
        name,
        cut,
        content,
        uploaded_to,
        status,
        reception,
        delivery_date,
        publicURL
      });
      newProductMainStore
        .save()
        .then((data) => {
          res.status(200).json(data._id);
        })
        .catch(
          (err) => {
            console.log(err)
          }
        );
    }
  });
});



router.get("/getuserfileuploadedtoserver/:useremail", (req, res) => {
  const { useremail } = req.params;
  res.setHeader("Content-Type", "application/json");
  FileUpload_Model.find({ useremail: useremail }).sort({ date: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});



router.get("/getuserallfileuploadedtoserver", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  FileUpload_Model.find({}).sort({ date: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});


router.get("/changestatusfileupload/:id/:status", (req, res) => {
  const { id, status } = req.params;
  res.setHeader("Content-Type", "application/json");
  FileUpload_Model.findOneAndUpdate(
    { _id: id },
    { status },
    { useFindAndModify: false }
  )
    .then(() => {
      res.status(200).json("Updated Product");
    })
    .catch((err) => console.log(err));
});


module.exports = router;