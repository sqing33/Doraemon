const NewsType = {
  _id: 0,
  _title: "",
  _content: "",
  _coverUrl: "",
  _region: "",
  _publisher: "",
  _date: "",
  _status: false,

  // getter和setter方法
  get id() {
    return this._id;
  },
  set id(value) {
    this._id = value;
  },

  get title() {
    return this._title;
  },
  set title(value) {
    this._title = value;
  },

  get content() {
    return this._content;
  },
  set content(value) {
    this._content = value;
  },

  get coverUrl() {
    return this._coverUrl;
  },
  set coverUrl(value) {
    this._coverUrl = value;
  },

  get region() {
    return this._region;
  },
  set region(value) {
    this._region = value;
  },

  get publisher() {
    return this._publisher;
  },
  set publisher(value) {
    this._publisher = value;
  },

  get date() {
    return this._date;
  },
  set date(value) {
    this._date = value;
  },

  get status() {
    return this._status;
  },
  set status(value) {
    this._status = value;
  },
};

exports.NewsType = NewsType;
