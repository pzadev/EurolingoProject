import { italianWords, frenchWords, germanWords, spanishWords, urkainianWords, userData } from "./data/devData";

import { initializeConnection } from "./database/connect";

import { seeding } from "./database/seed";

import app  from "./app"

import { MONGODB_URI, DATABASE_NAME } from "./database/config";

const bootstrap = async () => {
    await initializeConnection(MONGODB_URI, DATABASE_NAME)
    await seeding(italianWords, frenchWords, germanWords, spanishWords, urkainianWords, userData)

    return app.listen(8080, () => {
        console.log("lsitening on port 8080")
    })
}

bootstrap().catch((err) => {
    console.log(err)
});