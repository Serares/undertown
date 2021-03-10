/*
router.get("/contact", this.homeController.getContactpage);

this._router.post("/send_email", [
    //you can add the checks in an array
    check("email", "Email invalid")
        .isEmail()
        .isLength({ min: 5 }),
    //body checks only in the body of the request
    body(
        "lastname",
        //adding this message as a default .withMessage
        "Nume invalid"
    )
        .isLength({ min: 3 })
        .trim(),
    body(
        "firstname",
        //adding this message as a default .withMessage
        "Nume invalid"
    )
        .isLength({ min: 3 })
        .trim(),
    body("message", "Message has a length of less than 6 characters")
        .trim()
        .isLength({ min: 6 })
], this.homeController.postSendEmail);
*/