// Remove the AzureStorageBlob part as it's already available globally after the CDN is loaded

const connectionString = "DefaultEndpointsProtocol=https;AccountName=minimindsrg9f5a;AccountKey=cbL49zKjeB/WU9bHibLnYu5A2wKpRd+EDATsZw2YWpwYQiUZeIsQX30cIukGP9CsocTqhb1B133i+AStQDNpPQ==;EndpointSuffix=core.windows.net";

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
