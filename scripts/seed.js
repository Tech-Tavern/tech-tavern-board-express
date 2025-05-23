// scripts/seed_api.js
// This script uses your HTTP API to seed the backend with realistic data.
// Usage: node scripts/seed_api.js

const BASE = process.env.BASE_URL || "http://localhost:3009";
// For auth: adjust header name or token as needed. Here we use x-user-uid for testing.
const headerFor = (uid) => ({
  "Content-Type": "application/json",
  "x-user-uid": uid,
});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  try {
    // 1️⃣ Create 5 demo users
    const users = [
      {
        uid: "UidAlice123",
        email: "alice@example.com",
        name: "Alice Liddell",
        photo: "https://example.com/alice.png",
      },
      {
        uid: "UidBob456",
        email: "bob@example.com",
        name: "Bob Builder",
        photo: "https://example.com/bob.png",
      },
      {
        uid: "UidCarol789",
        email: "carol@example.com",
        name: "Carol Danvers",
        photo: "https://example.com/carol.png",
      },
      {
        uid: "UidDave012",
        email: "dave@example.com",
        name: "Dave Grohl",
        photo: "https://example.com/dave.png",
      },
      {
        uid: "UidEve345",
        email: "eve@example.com",
        name: "Eve Polastri",
        photo: "https://example.com/eve.png",
      },
      {
        uid: "mgvkm6gCGffDOBj5EbnSIM1nakg2",
        email: "tomcoons1413@gmail.com",
        name: "Thomas Coons",
        photo: "",
      },
    ];
    console.log("Seeding users...");
    for (const u of users) {
      const resp = await fetch(`${BASE}/users`, {
        method: "POST",
        headers: headerFor(u.uid),
        body: JSON.stringify(u),
      });
      if (!resp.ok)
        throw new Error(
          `Failed to seed user ${u.uid}: ${resp.status} ${resp.statusText}`,
        );
    }

    // 2️⃣ Each user creates 3 boards (authenticated via header)
    const boardsByUser = {};
    console.log("Seeding boards...");
    for (const u of users) {
      boardsByUser[u.uid] = [];
      for (let i = 1; i <= 3; i++) {
        const resp = await fetch(`${BASE}/boards`, {
          method: "POST",
          headers: headerFor(u.uid),
          body: JSON.stringify({ name: `Board ${i} of ${u.name}` }),
        });
        if (!resp.ok)
          throw new Error(
            `Failed to create board for ${u.uid}: ${resp.status} ${resp.statusText}`,
          );
        const board = await resp.json();
        boardsByUser[u.uid].push(board.id);
      }
    }

    // 3️⃣ Each board gets 5 lists
    const listsByBoard = {};
    console.log("Seeding lists...");
    for (const [uid, boardIds] of Object.entries(boardsByUser)) {
      for (const boardId of boardIds) {
        listsByBoard[boardId] = [];
        for (let j = 0; j < 5; j++) {
          const resp = await fetch(`${BASE}/boards/${boardId}/lists`, {
            method: "POST",
            headers: headerFor(uid),
            body: JSON.stringify({
              title: `List ${j + 1}`,
              position: j,
              columnPos: 0,
              color: ["#D8B4FE", "#A5F3FC", "#FDE68A", "#C7D2FE", "#E0FFFF"][j],
            }),
          });
          if (!resp.ok)
            throw new Error(
              `Failed to create list on board ${boardId}: ${resp.status} ${resp.statusText}`,
            );
          const list = await resp.json();
          listsByBoard[boardId].push(list.id);
        }
      }
    }

    // 4️⃣ Each list gets 2–10 cards
    const cardsByList = {};
    console.log("Seeding cards...");
    for (const [uid, boardIds] of Object.entries(boardsByUser)) {
      for (const boardId of boardIds) {
        for (const listId of listsByBoard[boardId]) {
          cardsByList[listId] = [];
          const count = randomInt(2, 10);
          for (let k = 0; k < count; k++) {
            const resp = await fetch(
              `${BASE}/boards/${boardId}/lists/${listId}/cards`,
              {
                method: "POST",
                headers: headerFor(uid),
                body: JSON.stringify({
                  title: `Card ${k + 1}`,
                  description: `Auto-generated card ${k + 1} in list ${listId}`,
                  color: ["red", "green", "blue", "purple", "yellow"][k % 5],
                  position: k,
                }),
              },
            );
            if (!resp.ok)
              throw new Error(
                `Failed to create card in list ${listId}: ${resp.status} ${resp.statusText}`,
              );
            const card = await resp.json();
            cardsByList[listId].push(card.id);
          }
        }
      }
    }

    // 5️⃣ Invite one user and accept
    console.log("Seeding invitations...");
    for (let i = 0; i < users.length; i++) {
      const owner = users[i].uid;
      const invitee = users[(i + 1) % users.length].uid;
      for (const boardId of boardsByUser[owner]) {
        const inv = await fetch(`${BASE}/boards/${boardId}/members`, {
          method: "POST",
          headers: headerFor(owner),
          body: JSON.stringify({ userUid: invitee, role: "member" }),
        });
        if (!inv.ok)
          throw new Error(
            `Failed to invite ${invitee} to board ${boardId}: ${inv.status} ${inv.statusText}`,
          );
        const acc = await fetch(
          `${BASE}/boards/${boardId}/members/${invitee}`,
          {
            method: "PUT",
            headers: headerFor(invitee),
            body: JSON.stringify({ status: "accepted" }),
          },
        );
        if (!acc.ok)
          throw new Error(
            `Failed to accept invite for ${invitee} on board ${boardId}: ${acc.status} ${acc.statusText}`,
          );
      }
    }

    // 6️⃣ Simulate a card move
    console.log("Simulating card moves...");
    for (const boardIds of Object.values(boardsByUser)) {
      for (const boardId of boardIds) {
        const listsForBoard = listsByBoard[boardId];
        if (listsForBoard.length < 2) continue;
        const from = listsForBoard[0];
        const to = listsForBoard[1];
        const cardId = cardsByList[from][0];
        const mv = await fetch(
          `${BASE}/boards/${boardId}/lists/${from}/cards/${cardId}`,
          {
            method: "PUT",
            headers: headerFor(users[0].uid),
            body: JSON.stringify({
              listId: to,
              position: cardsByList[to].length,
            }),
          },
        );
        if (!mv.ok)
          throw new Error(
            `Failed to move card ${cardId} from ${from} to ${to}: ${mv.status} ${mv.statusText}`,
          );
      }
    }

    console.log("✅ API seeding complete.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
})();
