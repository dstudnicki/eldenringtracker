import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
    methods: ["GET", "HEAD", "POST"], // Add other methods if needed
    origin: "*", // You can specify the allowed origin here
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function corsMiddleware(req, res, fn) {
    await runMiddleware(req, res, cors);
}
