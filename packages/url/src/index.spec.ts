import { createUrl, objectToSearch, searchToObject } from "./index.js";

describe("createUrl", () => {
  it("allows you to omit all arguments", () => {
    expect(createUrl({})).toEqual("/");
  });

  it("allows you to specify a hash", () => {
    expect(
      createUrl({
        pathname: "/posts/new",
        queryParams: { foo: "bar", one: 1 },
        hash: "#hash",
      }),
    ).toEqual("/posts/new?foo=bar&one=1#hash");
  });

  it("allows you to specify query parameters", () => {
    expect(
      createUrl({
        pathname: "/posts/new",
        queryParams: { foo: "bar", one: 1 },
      }),
    ).toEqual("/posts/new?foo=bar&one=1");
  });

  it("allows you to specify the origin", () => {
    expect(
      createUrl({
        origin: "https://www.example.com",
        pathname: "/posts/new",
        queryParams: { foo: "bar", one: 1 },
      }),
    ).toEqual("https://www.example.com/posts/new?foo=bar&one=1");
  });

  it("allows you to replace variables in the pathname", () => {
    expect(
      createUrl({
        origin: "https://www.example.com",
        pathname: "/posts/edit/:id",
        params: { id: 123 },
        queryParams: { foo: "bar", one: 1 },
      }),
    ).toEqual("https://www.example.com/posts/edit/123?foo=bar&one=1");
  });
});

describe("objectToSearch", () => {
  describe("when no object is given", () => {
    it("returns an empty string", () => {
      expect(objectToSearch()).toEqual("");
    });
  });

  describe("when an empty object is given", () => {
    it("returns an empty string", () => {
      expect(objectToSearch({})).toEqual("");
    });
  });

  it("it turns the given object into a URL search segment", () => {
    expect(objectToSearch({ foo: "bar", one: 1 })).toEqual("?foo=bar&one=1");
  });
});

describe("searchToObject", () => {
  describe("when no search", () => {
    it("returns an empty object", () => {
      expect(searchToObject()).toEqual({});
    });
  });

  describe("when an empty string is given", () => {
    it("returns an empty object", () => {
      expect(searchToObject("")).toEqual({});
    });
  });

  it("it turns the given object into a URL search segment", () => {
    expect(searchToObject("?foo=bar&one=1")).toMatchObject({
      foo: "bar",
      one: "1",
    });
  });
});
