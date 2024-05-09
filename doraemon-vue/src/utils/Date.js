const date = (dates, type = "datetime") => {
    let date;
    if (dates) {
        date = new Date(dates);
    } else {
        date = new Date();
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    let formattedDateTime;

    if (type === "date") {
        formattedDateTime = `${year}年${month}月${day}日`;
    } else if (type === "datetime") {
        formattedDateTime = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    }

    return formattedDateTime;
};

export default date;
