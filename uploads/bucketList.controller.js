import BucketListModel from "./bucketList.model.js";
import BucketListRepository from "./bucketList.repository.js";

export default class UserController {
  constructor() {
    this.bucketListRepository = new BucketListRepository();
  }

  add = async (req, res) => {
    const { title, description, dateAdded, targetDate, isCompleted } = req.body;
    const itemToCreate = new BucketListModel(
      title,
      description,
      dateAdded,
      targetDate,
      isCompleted
    );

    await this.bucketListRepository.addBucketListItem(itemToCreate);
    res.status(201).send(itemToCreate);
  };

  get = async (req, res) => {
    const { title } = req.query;
    const item = await this.bucketListRepository.findOneBucketListItem(title);

    if (!item) {
      res.status(200).send("Item not found.");
    } else {
      res.status(200).send(item);
    }
  };
}
