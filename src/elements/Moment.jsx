import moment from "moment";

export default function Moment(e, formate, type) {
  if (formate === "ko") {
    if (type === "YM") {
      return moment(e).format("YYYY년MM월");
    } else if (type === "M") {
      return moment(e).format("MM월");
    }
  }
}
