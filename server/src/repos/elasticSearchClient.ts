import { Client } from "@elastic/elasticsearch";

import EnvVars from "@src/constants/EnvVars";

const elasticSearchClient = new Client({
  node: EnvVars.ElasticSearch.node,
  auth: {
    username: EnvVars.ElasticSearch.username,
    password: EnvVars.ElasticSearch.password,
  },
});

export async function checkAndCreateIndex(index: string) {
  // Check if index exists
  const indexExists = await elasticSearchClient.indices.exists({ index });

  if (!indexExists) {
    // Create the index if it does not exist
    await elasticSearchClient.indices.create({ index });
    console.log(`Index "${index}" created`);
  } else {
    console.log(`Index "${index}" already exists`);
  }
}

export async function deleteAndRecreateIndex(index: string) {
  try {
    const indexExists = await elasticSearchClient.indices.exists({ index });

    if (indexExists) {
      // Delete the index
      await elasticSearchClient.indices.delete({
        index: index,
      });
      console.log(`Index ${index} deleted.`);
    }

    // Recreate the index (optional)
    await elasticSearchClient.indices.create({
      index: index,
      body: {
        // Add your index settings and mappings here
      },
    });
    console.log(`Index ${index} recreated.`);
  } catch (error) {
    console.error("Error deleting or recreating index:", error);
  }
}

export async function migrateIndexes() {
  await checkAndCreateIndex("users");
  await checkAndCreateIndex("emails");
  await checkAndCreateIndex("mailboxes");
  //await deleteAndRecreateIndex("users");
  // await deleteAndRecreateIndex("emails");
  // await deleteAndRecreateIndex("mailboxes");
}

export default elasticSearchClient;
