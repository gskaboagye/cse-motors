Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies ? req.cookies.jwt : null
  console.log("JWT COOKIE PRESENT:", !!token)

  if (!token) {
    res.locals.loggedin = false
    res.locals.accountData = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("JWT VERIFIED:", decoded.account_email)

    res.locals.loggedin = true
    res.locals.accountData = decoded
    return next()
  } catch (error) {
    console.error("JWT verification error:", error.message)

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    res.locals.loggedin = false
    res.locals.accountData = null
    return next()
  }
}

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("JWT VERIFIED:", decoded.account_email)

    res.locals.loggedin = true
    res.locals.accountData = decoded
    return next()
  } catch (error) {
    console.error("JWT verification error:", error.message)
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    res.locals.loggedin = false
    res.locals.accountData = null
    return next()
  }
}