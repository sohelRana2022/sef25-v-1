import firestore from '@react-native-firebase/firestore';
import { getFirestore, doc, writeBatch } from "firebase/firestore";
type FirestoreData = {
  [key: string]: any;
};

type DocumentData = FirestoreData & { uid: string };

export const insertData = async (
  collectionName: string,
  data: FirestoreData
): Promise<void> => {
  try {
    const docRef = await firestore()
      .collection(collectionName)
      .add(data);
    console.log('Document successfully written with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

export const readAllData = async (
  collectionName: string
): Promise<DocumentData[]> => {
  try {
    const snapshot = await firestore()
      .collection(collectionName)
      .get();

    const dataList: DocumentData[] = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));

    console.log('Data fetched:', dataList);
    return dataList;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

const updateData = async (
    collectionName: string,
    documentId: string,
    updatedData: FirestoreData
  ): Promise<void> => {
    try {
      await firestore()
        .collection(collectionName)
        .doc(documentId)
        .update(updatedData);
      console.log('Document successfully updated!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };
  
export const deleteData = async (
    collectionName: string,
    documentId: string
  ): Promise<void> => {
    try {
      await firestore()
        .collection(collectionName)
        .doc(documentId)
        .delete();
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };







// Initialize Firestore
const db = getFirestore();



  
  const batchInsertData = async () => {
    // Create a batch instance
    const batch = writeBatch(db);
  
    // Example data
    const usersData = [
      { id: "user1", name: "Alice", age: 25 },
      { id: "user2", name: "Bob", age: 30 },
      { id: "user3", name: "Charlie", age: 35 }
    ];
  
    // Add each document to the batch
    usersData.forEach(user => {
      const docRef = doc(db, "users", user.id); // Create a reference to the document
      batch.set(docRef, user); // Add the set operation to the batch
    });
  
    // Commit the batch
    try {
      await batch.commit();
      console.log("Batch write successfully committed!");
    } catch (error) {
      console.error("Error committing batch: ", error);
    }
  }
  


  