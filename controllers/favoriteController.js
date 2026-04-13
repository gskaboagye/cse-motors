const favoriteModel = require("../models/favorite-model")
const utilities = require("../utilities/")

const favoriteCont = {}

favoriteCont.buildFavorites = async function (req, res) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id

  const favorites = await favoriteModel.getFavoritesByAccountId(account_id)

  res.render("account/favorites", {
    title: "My Favorites",
    nav,
    favorites,
    errors: null,
  })
}

favoriteCont.addFavorite = async function (req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  if (!inv_id) {
    req.flash("notice", "Invalid vehicle selection.")
    return res.redirect("/favorites")
  }

  const existing = await favoriteModel.checkExistingFavorite(account_id, inv_id)

  if (existing) {
    req.flash("notice", "Vehicle is already in your favorites.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  const result = await favoriteModel.addFavorite(account_id, inv_id)

  if (result) {
    req.flash("notice", "Vehicle added to favorites.")
  } else {
    req.flash("notice", "Sorry, could not add favorite.")
  }

  return res.redirect(`/inv/detail/${inv_id}`)
}

favoriteCont.removeFavorite = async function (req, res) {
  const account_id = res.locals.accountData.account_id
  const favorite_id = parseInt(req.params.favorite_id)

  if (!favorite_id) {
    req.flash("notice", "Invalid favorite selection.")
    return res.redirect("/favorites")
  }

  const result = await favoriteModel.removeFavorite(favorite_id, account_id)

  if (result) {
    req.flash("notice", "Favorite removed successfully.")
  } else {
    req.flash("notice", "Could not remove favorite.")
  }

  return res.redirect("/favorites")
}

module.exports = favoriteCont