import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from 'react';


function Contact() {

    return (
        <div>
            <form action="/contact-form-handler.php">
                <label>First Name</label>
                <input type="text" id="fname" name="firstname" placeholder="Your name.." />
                <label>Last Name</label>
                <input type="text" id="lname" name="lastname" placeholder="Your last name.." />
                <label>Email</label>
                <input type="email" id="email" name="email" placeholder="Your email" />
                <label>Subject</label>
                <textarea id="subject" name="subject" placeholder="Write something.."></textarea>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Contact;