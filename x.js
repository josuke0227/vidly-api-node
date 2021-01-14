// Trade off between query performance vs consistency

// Using References (Normalization) -> consistency
let author = {
  name: "Yosuke",
};

let course = {
  author: "id",
};

// Using Embedded Documents (Denormalization)
let course = {
  author: {
    name: "Mosh",
  },
};

// Hybrid
let author = {
  name: "Yosuke",
  // ... 50 other properties
};

let course = {
  author: {
    id: "ref",
    name: "Yosuke",
  },
};
