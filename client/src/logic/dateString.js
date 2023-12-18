export default function DateString(createdAt) {
    const dateAndTime = createdAt.split("T");
    const date = dateAndTime[0].split("-");
    const time = dateAndTime[1].split(":");
    return `${time[0]}:${time[1]} ${date[2]}.${date[1]}.${date[0]}`;
  }
  