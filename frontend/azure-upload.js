// Azure SDK is available globally after the script is loaded via CDN
const connectionString = "DefaultEndpointsProtocol=https;AccountName=minimindsrg9f5a;AccountKey=cbL49zKjeB/WU9bHibLnYu5A2wKpRd+EDATsZw2YWpwYQiUZeIsQX30cIukGP9CsocTqhb1B133i+AStQDNpPQ==;EndpointSuffix=core.windows.net";

async function saveProgressToAzure(userId, progress, score) {
  try {
    // Use the global object AzureStorageBlob that is loaded from the CDN
    const blobServiceClient = AzureStorageBlob.BlobServiceClient.fromConnectionString(connectionString);
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
