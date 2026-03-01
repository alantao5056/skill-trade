import app from './auth';
import { getFirestore, getDoc, doc, collection, getDocs, where, query, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Skill } from '@/models/Skill';
import { Edge } from '@/models/Edge';
import { Res } from '@/models/Res';
import { Cycle } from '@/models/Cycle';
import { User } from '@/models/User';

export async function getSkills(): Promise<Res> {
  const db = getFirestore(app);
  try {
    const skillsRef = collection(db, 'skills');
    const skills = await getDocs(skillsRef);
    const res: Res = {
      ok: true,
      data: skills.docs.map((doc) => doc.data() as Skill),
      error: "",
    };
    return res;
  } catch (err) {
    const res: Res = {
      ok: false,
      data: [],
      error: "Failed to get skills",
    };
    return res;
  }
}

export async function getUserEdges(userId: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const edgesRef = collection(db, 'edges');
    const edges = await getDocs(query(edgesRef, where('uid', '==', userId)));
    const res: Res = {
      ok: true,
      data: edges.docs.map((doc) => doc.data() as Edge),
      error: "",
    };
    return res;
  } catch (err) {
    const res: Res = {
      ok: false,
      data: [],
      error: "Failed to get user edges",
    };
    return res;
  }
}

export async function addEdge(from: string, to: string, uid: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const edgesRef = collection(db, 'edges');
    const docRef = await addDoc(edgesRef, { from, to, uid });
    await updateDoc(doc(edgesRef, docRef.id), { edgeId: docRef.id });
    await updateDoc(doc(db, "users", uid), { edges: arrayUnion(docRef.id) });
    const res: Res = {
      ok: true,
      data: { edgeId: docRef.id, from, to, uid } as Edge,
      error: "",
    };
    return res;
  } catch (err) {
    const res: Res = {
      ok: false,
      data: null,
      error: "Failed to add edge",
    };
    return res;
  }
}

export async function deleteEdge(edgeId: string, uid: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const edgesRef = collection(db, 'edges');
    await deleteDoc(doc(edgesRef, edgeId));
    await updateDoc(doc(db, "users", uid), { edges: arrayRemove(edgeId) });
    const res: Res = {
      ok: true,
      data: null,
      error: "",
    };
    return res;
  } catch (err) {
    const res: Res = {
      ok: false,
      data: null,
      error: "Failed to delete edge",
    };
    return res;
  }
}

export async function getUserCycles(userId: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const cyclesRef = collection(db, 'cycles');
    const cycles = await getDocs(query(cyclesRef, where('uid', '==', userId)));
    const res: Res = {
      ok: true,
      data: cycles.docs.map((doc) => doc.data() as Cycle),
      error: "",
    };
    return res;
  } catch (err) {
    const res: Res = {
      ok: false,
      data: [],
      error: "Failed to get user cycles",
    };
    return res;
  }
}

export async function getUser(userId: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const userRef = doc(db, "users", userId);
    const user = await getDoc(userRef);
    const res: Res = {
      ok: true,
      data: user.data() as User,
      error: "",
    };
    return res;
  } catch (err) {
    const res: Res = {
      ok: false,
      data: null,
      error: "Failed to get user",
    };
    return res;
  }
}
