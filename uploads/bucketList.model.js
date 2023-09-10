import { getDB } from "../../config/mongodb.js";

export default class BucketListModel {
  constructor(title, description, dateAdded, targetDate, isCompleted) {
    this.title = title;
    this.description = description;
    this.dateAdded = dateAdded;
    this.targetDate = targetDate;
    this.isCompleted = isCompleted;
  }

  static async addBucketListItem(
    title,
    description,
    dateAdded,
    targetDate,
    isCompleted
  ) {
    const db = getDB();

    const newItem = new BucketListModel(
      title,
      description,
      dateAdded,
      targetDate,
      isCompleted
    );
    await db.collection("bucketListItems").insertOne(newItem);

    return newItem;
  }

  static async findOneBucketListItem(title) {
    const db = getDB();

    const item = await db.collection("bucketListItems").findOne({ title });

    return item;
  }
}
