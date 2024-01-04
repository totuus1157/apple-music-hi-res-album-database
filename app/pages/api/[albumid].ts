import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const albumid = req.query.albumid;

  try {
    if (req.method === "GET") {
      const response = await fetch(
        `https://api.music.apple.com/v1/catalog/us/albums/${albumid}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.APPLE_MUSIC_API_KEY}`,
          },
        },
      );

      const data: string = await response.json();
      const code = response.status;

      if (response.ok) {
        // Request was successful
        return res.status(code).json(data);
      } else {
        // Handle API errors
        let errorMessage = "An error occurred while processing the request.";

        switch (code) {
          case 400:
            errorMessage =
              "Bad Request: The request wasn’t accepted as formed.";
            break;
          case 401:
            errorMessage = "Unauthorized: Authorization is missing or invalid.";
            break;
          case 403:
            errorMessage =
              "Forbidden: Authentication issue or incorrect authentication.";
            break;
          case 404:
            errorMessage = "Not Found: The requested resource doesn’t exist.";
            break;
          case 429:
            errorMessage =
              "Too Many Requests: The user has made too many requests.";
            break;
          case 500:
            errorMessage =
              "Internal Server Error: There’s an error processing the request.";
            break;
          case 503:
            errorMessage =
              "Service Unavailable: The service is currently unavailable.";
            break;
          // Add more cases as needed based on the Apple Music API documentation
          default:
            errorMessage = "An error occurred while processing the request.";
        }

        return res.status(code).json({ error: errorMessage });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
