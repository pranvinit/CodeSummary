// UserRepository.js
import { getDB } from "../../config/mongodb.js";

class BucketListRepository {
  async addBucketListItem(bucketListItem) {
    const db = getDB();
    const item = await db
      .collection("bucketListItems")
      .insertOne(bucketListItem);
    return item;
  }

  async findOneBucketListItem(title) {
    const db = getDB();
    const item = await db.collection("bucketListItems").findOne({ title });
    return item;
  }
}

export default BucketListRepository;
