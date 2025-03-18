// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/summary/${doc._raw.flattenedPath}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "src/data/summary",
  documentTypes: [Post]
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-2AQNQBI7.mjs.map
