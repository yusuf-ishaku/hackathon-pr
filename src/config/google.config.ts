/* eslint-disable prettier/prettier */
import {OAuth2Client} from 'google-auth-library';


class GoogleAuth {
    private CLIENT_ID: string;
    private CLIENT_SECRET: string;
    private REDIRECT_URL: string;
    public client;
    constructor () {
        this.CLIENT_ID = process.env.CLIENT_ID;
        this.CLIENT_SECRET = process.env.CLIENT_SECRET;
        this.REDIRECT_URL = process.env.REDIRECT_URL;
        this.client = new OAuth2Client(
            this.CLIENT_ID,
            this.CLIENT_SECRET,
            this.REDIRECT_URL
        )
    }
}

export default GoogleAuth;