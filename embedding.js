const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground-second")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
    // author: {
    //   type: authorSchema,
    //   required: true,
    // },
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  await Course.updateOne(
    { _id: courseId },
    {
      $unset: {
        "author.name": "",
      },
      // $set: {
      //   "author.name": "John Smith",
      // },
    }
  );
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

// createCourse("Node Course", new Author({ name: "Mosh" }));
// createCourse("Node Course", [
//   new Author({ name: "Mosh" }),
//   new Author({ name: "Yosuke" }),
// ]);
// updateAuthor("5ff19d2023701cbd2973151c");
// addAuthor("5ff1a1c5b1f8febe03f8eb03", new Author({ name: "Seiji" }));
removeAuthor("5ff1a1c5b1f8febe03f8eb03", "5ff1a2bee84898be2c166655");
