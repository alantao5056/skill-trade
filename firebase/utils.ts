import app from './auth';
import { getFirestore, getDoc, setDoc, doc, collection, getDocs, where, query, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Skill } from '@/models/Skill';
import { Edge } from '@/models/Edge';
import { Res } from '@/models/Res';
import { Cycle } from '@/models/Cycle';
import { User } from '@/models/User';
import { Task } from '@/models/Task';

export async function getSkill(skillId: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const skillRef = doc(db, 'skills', skillId);
    const skill = await getDoc(skillRef);
    return { ok: true, data: skill.data() as Skill, error: "" };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to get skill" };
  }
}

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
    const cycles = await getDocs(
      query(cyclesRef, where('uids', 'array-contains', userId))
    );
    const res: Res = {
      ok: true,
      data: cycles.docs.map((d) => ({ ...d.data(), cycleId: d.id }) as Cycle),
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

export async function approveCycle(cycleId: string, uid: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const cycleRef = doc(db, 'cycles', cycleId);
    const cycleSnap = await getDoc(cycleRef);
    if (!cycleSnap.exists()) {
      return { ok: false, data: null, error: "Cycle not found" };
    }
    const cycle = cycleSnap.data() as Cycle;
    const updatedApprovals = cycle.approvals.map((a) =>
      a.uid === uid ? { ...a, approved: true } : a
    );
    await updateDoc(cycleRef, { approvals: updatedApprovals });
    return {
      ok: true,
      data: { ...cycle, cycleId, approvals: updatedApprovals } as Cycle,
      error: "",
    };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to approve cycle" };
  }
}

export async function enqueueAddEdge(from: string, to: string, uid: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const task: Task = { type: "add", from, to, uid, edgeId: "", createdAt: Date.now() };
    await addDoc(collection(db, 'queue'), task);
    return { ok: true, data: null, error: "" };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to enqueue add edge" };
  }
}

export async function enqueueRemoveEdge(edgeId: string, uid: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const task: Task = { type: "remove", from: "", to: "", uid, edgeId, createdAt: Date.now() };
    await addDoc(collection(db, 'queue'), task);
    return { ok: true, data: null, error: "" };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to enqueue remove edge" };
  }
}

export async function ensureUserDocument(
  uid: string,
  displayName?: string | null
): Promise<void> {
  const db = getFirestore(app);
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    const newUser: User = {
      uid,
      displayName: displayName ?? uid,
      cycles: [],
      edges: [],
      offer: {},
      need: {},
    };
    await setDoc(userRef, newUser);
  }
}

export async function getUser(userId: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return { ok: false, data: null, error: "User not found" };
    }
    return { ok: true, data: userSnap.data() as User, error: "" };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to get user" };
  }
}

export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<User, "displayName">>
): Promise<Res> {
  const db = getFirestore(app);
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
    return { ok: true, data: null, error: "" };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to update user profile" };
  }
}
