const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const create = async (req, res) => {
  // 1. Validate request
  if (!req.body.title) {
    return res.status(400).send({ message: "Title is required!" });
  }
  // 2. Create a Tutorial
  const tutorial = new req.context.models.Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });
  // 3. Save Tutorial in the database
  try {
    await tutorial.save();
    return res.status(201).send({ tutorial });
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Tutorial.",
    });
  }
};

// Retrieve all Tutorials from the database.
export const findAll = async (req, res) => {
  // const title = req.query.title;
  const { title, page, size } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  const { limit, offset } = getPagination(page, size);
  try {
    // const result = await req.context.models.Tutorial.find(condition);
    const result = await req.context.models.Tutorial.paginate(condition, {
      limit,
      offset,
    });
    // res.status(200).send({ result });
    res.status(200).send({
      totalItems: result.totalDocs,
      tutorials: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page - 1,
    });
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials.",
    });
  }
};

// Find a single Tutorial with an id
export const findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await req.context.models.Tutorial.findById(id);
    if (!result) {
      return res.status(404).send({
        message: `Not found Tutorial with id: ${id}`,
      });
    }
    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send({
      message: `Error retrieving Tutorial with id: ${id}`,
    });
  }
};
// Update a Tutorial by the id in the request
export const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  try {
    const result = await req.context.models.Tutorial.findByIdAndUpdate(
      id,
      req.body,
      { useFindAndMoify: false, new: true }
    );
    if (!result) {
      return res.status(404).send({
        message: `Cannot update Tutorial with id: ${id}. Maybe Tutorial was not found!`,
      });
    }
    return res.status(200).send({ result });
  } catch (error) {
    res.status(500).send({
      message: `Error updating Tutorial with id: ${id}`,
    });
  }
};
// Delete a Tutorial with the specified id in the request
export const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await req.context.models.Tutorial.findByIdAndRemove(id);
    if (!result) {
      return res.status(404).send({
        message: `Cannot delete Tutorial with id: ${id}. Maybe Tutorial was not found!`,
      });
    }
    return res.status(200).send({
      message: "Tutorial was deleted successfully!",
      result,
    });
  } catch (error) {
    return res.status(500).send({
      message: `Could not delete Tutorial with id: ${id}`,
    });
  }
};
// Delete all Tutorials from the database.
export const deleteAll = async (req, res) => {
  try {
    const result = await req.context.models.Tutorial.deleteMany({});
    return res.status(200).send({
      message: `${result.deletedCount} Tutorials were deleted successfully!`,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while removing all tutorials.",
    });
  }
};
// Find all published Tutorials
export const findAllPublished = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  try {
    const result = await req.context.models.Tutorial.paginate(
      { published: true },
      { offset, limit }
    );
    if (!result) {
      return res.status(404).send({
        message: `No Tutorials were found!`,
      });
    }
    // return res.status(200).send({ result });
    res.status(200).send({
      totalItems: result.totalDocs,
      tutorials: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page - 1,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving tutorials.",
    });
  }
};

// export const controllers = {create, findAll, findOne, update, deleteOne, deleteAll, findAllPublished}
