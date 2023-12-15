import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

async function connect() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  return client.connect();
}

async function addNote(newNote) {
  const client = await connect();

  try {
    const db = client.db("usersSharing");
    const result = await db.collection("users").insertOne(newNote);
    return result;
  } 
  catch (error) {
    // Handle the error, log it, or rethrow it
    console.error("Error in addNote:", error);
    throw error;
  } 
  finally {
    client.close();
  }
}

async function getNotes(query = {}) {
  const client = await connect();

  try {
    const db = client.db("usersSharing");
    const notes = await db.collection("users").find(query).toArray();
    return notes;
  } 
  catch (error) {
    console.error("Error in getNotes:", error);
    throw error;
  }
  finally {
    client.close();
  }
}

async function getNoteById(noteId) {
  let client;
  try {
    client = await connect();
    const db = client.db("usersSharing");
    const note = await db
      .collection("users")
      .findOne({ _id: ObjectId(noteId) });
    return note;
  } 
  catch (error) {
    console.error("Error in getNoteById:", error);
    throw error;
  }
  finally {
    if (client) {
      client.close();
    }
  }
}

async function updateNote(noteId, updatedNote) {
  const client = await connect();

  try {
    const db = client.db("usersSharing");
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(noteId) }, { $set: updatedNote });
    return result;
  } 
  catch (error) {
    console.error("Error in updateNote:", error);
    throw error;
  } 
  finally {
    client.close();
  }
}

async function deleteNote(noteId) {
  const client = await connect();

  try {
    const db = client.db("usersSharing");
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(noteId) });
    console.log(result);
    return result;
  } 
  catch (error) {
    console.error("Error in deleteNote:", error);
    throw error;
  }
  finally {
    client.close();
  }
}

export default {
  addNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
