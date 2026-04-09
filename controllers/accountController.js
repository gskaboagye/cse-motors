accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    console.log("LOGIN ATTEMPT:", account_email)
    console.log("ACCESS_TOKEN_SECRET exists:", !!process.env.ACCESS_TOKEN_SECRET)

    const accountData = await accountModel.getAccountByEmail(account_email)
    console.log("ACCOUNT FOUND:", !!accountData)

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )
    console.log("PASSWORD MATCH:", passwordMatch)

    if (!passwordMatch) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    console.log("JWT CREATED")

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    })

    console.log("COOKIE SET, REDIRECTING TO /account/")
    return res.redirect("/account/")
  } catch (error) {
    console.error("accountLogin controller error:", error)
    req.flash("notice", "Login failed. Please try again.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}