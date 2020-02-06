import { open } from "rosbag";
import Bag, { Time, messages } from "rosbag-write";

export default (data, cb, options = {}) => {
  return open(data).then(bag => {
    return bag.readMessages(options, result => {
      cb(result);
    });
  });
};
export const getRosbag = async data => {
  try {
    const bag = new Bag();
    await messages.init();
    const Message = await messages.getMessage("std_msgs/String");
    const time = Time.fromSecs(1.1);
    Object.keys(data).forEach(topic => {
      bag.write("/" + topic, new Message({ data: data[topic] }), time);
      time.nsec += 100000000;
    });
    bag.close();
    return bag.file.getBuffer();
  } catch (error) {
    return new Error(error);
  }
};
