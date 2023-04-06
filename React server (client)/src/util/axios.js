// This solution was found here https://youtu.be/X3qyxo_UTR4?t=1141 it allows you to simplify the url path that axios.  For example, instead of saying "http://localhost:3001/api/someroute" you can just use "/api/someroute" and have it do the same thing
// or you can inside the package.json file, you can add a "proxy" configuration to tell the frontend the address of the back end ("proxy": "http://localhost:3001"), this would make it global for the entire client.
// Source https://blog.devgenius.io/mern-auth-with-session-part-3-register-login-form-with-auth-af4a1f314dd1

import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3001'  //defines the base url for client to communicate with the server (so you only have to supply the dynamic part of the URL)
});