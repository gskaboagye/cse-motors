const express = require("express")
const router = new express.Router()
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities/")

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.buildFavorites)
)

router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.addFavorite)
)

router.get(
  "/remove/:favorite_id",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.removeFavorite)
)

module.exports = router