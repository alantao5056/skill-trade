import app from "@/firebase/auth";
import { addEdge } from "@/firebase/utils";
import { Cycle } from "@/models/Cycle";
import { Edge } from "@/models/Edge";
import { Task } from "@/models/Task";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";

const DELAY = 2000;

let edges = new Map<string, Edge>(); // edgeId -> edge
let nbs = new Map<string, string[]>(); // skillId -> edges

async function hasCycle(canonicalKey: string): Promise<boolean> {
  const db = getFirestore(app);
  const cyclesRef = collection(db, 'cycles');
  const cycles = await getDocs(query(cyclesRef, where('canonicalKey', '==', canonicalKey)));
  return !cycles.empty;
}

async function dfs(targetSkill: string, skillId: string, visited: Set<string>, edgeStack: string[], uidStack: string[], skillStack: string[], cycles: Cycle[]) {
  visited.add(skillId);
  skillStack.push(skillId);
  for (const edgeId of nbs.get(skillId)!) {
    const edge = edges.get(edgeId);
    if (!edge) {
      continue;
    }
    if (edge.to === targetSkill) {
      uidStack.push(edge.uid);
      edgeStack.push(edgeId);
      skillStack.push(edge.to);
      visited.add(edge.to);

      // calculate canonical key
      let minUid = uidStack[0];
      let minIndex = 0;
      for (let i = 1; i < uidStack.length; i++) {
        if (uidStack[i] < minUid) {
          minUid = uidStack[i];
          minIndex = i;
        }
      }

      const canonicalKey = [...uidStack.slice(minIndex), ...uidStack.slice(0, minIndex)].join(',');
      console.log("canonicalKey: ", canonicalKey);

      // check if cycle already exists
      if (!await hasCycle(canonicalKey)) {
        const cycle: Cycle = {
          approvals: [...new Set(uidStack)].map(uid => ({ uid, approved: false })),
          edgeIds: [...edgeStack],
          skillIds: [...skillStack],
          uids: [...uidStack],
          canonicalKey: canonicalKey
        };
  
        cycles.push(cycle);
      }

      edgeStack.pop();
      uidStack.pop();
      skillStack.pop();
      continue;
    }
    if (!visited.has(edge.to)) {
      edgeStack.push(edgeId);
      uidStack.push(edge.uid);
      await dfs(targetSkill, edge.to, visited, edgeStack, uidStack, skillStack, cycles);
      edgeStack.pop();
      uidStack.pop();
    }
  }
  skillStack.pop();
}

async function getCycles(edgeId: string): Promise<Cycle[]> {
  const cycles: Cycle[] = [];
  const visited = new Set<string>();
  const edgeStack: string[] = [edgeId];
  const uidStack: string[] = [edges.get(edgeId)!.uid];
  const skillStack: string[] = [];
  await dfs(edges.get(edgeId)!.from, edges.get(edgeId)!.to, visited, edgeStack, uidStack, skillStack, cycles);
  return cycles;
}

async function processAdd(from: string, to: string, uid: string) {
  const db = getFirestore(app);
  
  const addRes = await addEdge(from, to, uid);
  if (!addRes.ok) {
    console.error("failed to add edge", addRes.error);
    return;
  }
  const edge = addRes.data;
  const edgeId = edge.edgeId;
  edges.set(edgeId, edge);

  if (!nbs.has(from)) {
    nbs.set(from, []);
  }
  nbs.get(from)!.push(edgeId);
  if (!nbs.has(to)) {
    nbs.set(to, []);
  }

  const cycles = await getCycles(edgeId);
  for (const cycle of cycles) {
    const cycleRef = await addDoc(collection(db, 'cycles'), cycle);
    // await updateDoc(doc(db, 'cycles', cycleRef.id), { cycleId: cycleRef.id });
    for (const uid of cycle.uids) {
      await updateDoc(doc(db, "users", uid), { cycles: arrayUnion(cycleRef.id) });
    }
  }
}

async function getAllEdgesFirebase() {
  const db = getFirestore(app);
  const edgesRef = collection(db, 'edges');
  const edgesSnapshot = await getDocs(edgesRef);
  for (const edge of edgesSnapshot.docs) {
    edges.set(edge.id, edge.data() as Edge);
    if (!nbs.has(edge.data().from)) {
      nbs.set(edge.data().from, []);
    }
    nbs.get(edge.data().from)!.push(edge.id);
    if (!nbs.has(edge.data().to)) {
      nbs.set(edge.data().to, []);
    }
  }
}

async function addDummyTask(type: "add" | "remove", from: string, to: string, uid: string) {
  const db = getFirestore(app);
  const task: Task = { type, from, to, uid };
  const taskRef = await addDoc(collection(db, 'queue'), task);
  console.log("added dummy task", taskRef.id);
}

async function main() {
  await addDummyTask("add", "skill1", "skill2", "uid1");
  await addDummyTask("add", "skill2", "skill3", "uid2");
  await addDummyTask("add", "skill3", "skill1", "uid3");
  await getAllEdgesFirebase();
  const db = getFirestore(app);
  while (true) {
    // TODO: get by created timestamp
    const queueRef = collection(db, 'queue');
    const queue = await getDocs(queueRef);
    if (queue.empty) {
      console.log("no tasks");
      await new Promise(resolve => setTimeout(resolve, DELAY));
      continue;
    }
    const taskRef = doc(db, 'queue', queue.docs[0].id);
    const task = (await getDoc(taskRef)).data() as Task;
    if (task.type === "add") {
      console.log("processing add");
      await processAdd(task.from, task.to, task.uid);
      console.log(edges);
      console.log(nbs);
    } else if (task.type === "remove") {
      console.log("not implemented");
    }
    await deleteDoc(taskRef);
  }
}

main().catch(console.error);