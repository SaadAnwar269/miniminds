import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = "DefaultEndpointsProtocol=https;AccountName=minimindsrg9f5a;AccountKey=Uu9m8m8qUuy+Zz8xwwELLCP+j5wwptJK5ayL5IgKxepGkXoxPRf7mNs25u09u2/49ET9deNN3MwC+AStsgaP/A==;EndpointSuffix=core.windows.net";

async function saveProgressToAzure(userId, progress, score) {
  try {
    // Use the globally available BlobServiceClient after CDN load
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString); // Using BlobServiceClient directly
    const containerClient = blobServiceClient.getContainerClient("user-progress");

    const blobName = `${userId}.json`;
    const content = JSON.stringify({
      userId,
      progress,
      score,
      timestamp: new Date().toISOString()
    });

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: "application/json" }
    });

    console.log("✅ Progress saved to Azure for", userId);
  } catch (err) {
    console.error("❌ Error saving to Azure Blob:", err.message);
  }
}
