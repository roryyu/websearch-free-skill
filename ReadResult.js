export class ReadResult {
  constructor(title, content, url, platform = "web") {
    this.title = title;
    this.content = content;
    this.url = url;
    this.platform = platform;
  }

  toDict() {
    return {
      title: this.title,
      content: this.content,
      url: this.url,
      platform: this.platform
    };
  }
}
