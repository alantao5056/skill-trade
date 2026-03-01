import app from './auth';
import { getFirestore, getDoc, setDoc, doc, collection, getDocs, where, query, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Skill } from '@/models/Skill';
import { Edge } from '@/models/Edge';
import { Res } from '@/models/Res';
import { Cycle } from '@/models/Cycle';
import { User } from '@/models/User';
import { Task } from '@/models/Task';
import { Meeting } from '@/models/Meeting';

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

    const updatedCycle = { ...cycle, cycleId, approvals: updatedApprovals } as Cycle;
    const allApproved = updatedApprovals.every((a) => a.approved);

    if (allApproved) {
      await createMeetingsFromCycle(updatedCycle);

      for (const edgeId of updatedCycle.edgeIds) {
        const edgeSnap = await getDoc(doc(db, 'edges', edgeId));
        if (edgeSnap.exists()) {
          const edge = edgeSnap.data() as Edge;
          await enqueueRemoveEdge(edgeId, edge.uid);
        }
      }

      const uniqueUids = [...new Set(updatedCycle.uids)];
      for (const cycleUid of uniqueUids) {
        await updateDoc(doc(db, "users", cycleUid), { cycles: arrayRemove(cycleId) });
      }

      await deleteDoc(cycleRef);
    }

    return { ok: true, data: updatedCycle, error: "" };
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
      meetings: [],
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

export async function createMeetingsFromCycle(cycle: Cycle): Promise<Res> {
  const db = getFirestore(app);
  try {
    const meetingsRef = collection(db, 'meetings');
    const n = cycle.uids.length;
    const meetingIds: string[] = [];

    // uids[i] gives skillIds[i] to uids[(i+1) % n]
    for (let i = 0; i < n; i++) {
      const giveUid = cycle.uids[i];
      const wantUid = cycle.uids[(i + 1) % n];
      const skillId = cycle.skillIds[i];

      const docRef = await addDoc(meetingsRef, { giveUid, wantUid, skillId });
      await updateDoc(doc(meetingsRef, docRef.id), { meetingId: docRef.id });
      meetingIds.push(docRef.id);
    }

    const userMeetingMap = new Map<string, string[]>();
    for (let i = 0; i < n; i++) {
      const giveUid = cycle.uids[i];
      const wantUid = cycle.uids[(i + 1) % n];
      const mId = meetingIds[i];

      if (!userMeetingMap.has(giveUid)) userMeetingMap.set(giveUid, []);
      if (!userMeetingMap.has(wantUid)) userMeetingMap.set(wantUid, []);
      userMeetingMap.get(giveUid)!.push(mId);
      userMeetingMap.get(wantUid)!.push(mId);
    }

    for (const [uid, mIds] of userMeetingMap) {
      await updateDoc(doc(db, "users", uid), { meetings: arrayUnion(...mIds) });
    }

    return { ok: true, data: meetingIds, error: "" };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to create meetings from cycle" };
  }
}

export async function getUserMeetings(userId: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const userRes = await getUser(userId);
    if (!userRes.ok) return userRes;
    const user = userRes.data as User;
    const meetingIds = user.meetings ?? [];

    if (meetingIds.length === 0) {
      return { ok: true, data: [], error: "" };
    }

    const meetings = await Promise.all(
      meetingIds.map(async (id: string) => {
        const snap = await getDoc(doc(db, 'meetings', id));
        return snap.exists() ? (snap.data() as Meeting) : null;
      })
    );

    return { ok: true, data: meetings.filter(Boolean), error: "" };
  } catch (err) {
    return { ok: false, data: [], error: "Failed to get user meetings" };
  }
}

export async function dismissMeeting(meetingId: string): Promise<Res> {
  const db = getFirestore(app);
  try {
    const meetingRef = doc(db, 'meetings', meetingId);
    const meetingSnap = await getDoc(meetingRef);
    if (!meetingSnap.exists()) {
      return { ok: false, data: null, error: "Meeting not found" };
    }
    const meeting = meetingSnap.data() as Meeting;

    await deleteDoc(meetingRef);
    await updateDoc(doc(db, "users", meeting.giveUid), { meetings: arrayRemove(meetingId) });
    await updateDoc(doc(db, "users", meeting.wantUid), { meetings: arrayRemove(meetingId) });

    return { ok: true, data: null, error: "" };
  } catch (err) {
    return { ok: false, data: null, error: "Failed to dismiss meeting" };
  }
}
