const BASE = process.env.BASE_URL || "http://localhost:3009";

const headerFor = (uid) => ({
  "Content-Type": "application/json",
  "x-user-uid": uid,
});

const users = [
  {
    uid: "mgvkm6gCGffDOBj5EbnSIM1nakg2",
    email: "tomcoons1413@gmail.com",
    name: "Thomas Coons",
    photo: "",
  },
  {
    uid: "ntM9ci177NNPFGdPujlNna2ubNJ2",
    email: "tm.lewisbenson@gmail.com",
    name: "Lewis Benson",
    photo: "",
  },
];

const fetchJSON = async (url, opts, expectStatus = 201) => {
  const r = await fetch(url, opts);
  if (r.status !== expectStatus) {
    throw new Error(`${opts.method} ${url} ➜ ${r.status} ${r.statusText}`);
  }
  return r.status === 204 ? null : r.json();
};

(async () => {
  try {
    console.log("Creating (or up-serting) real users …");
    for (const u of users) {
      await fetchJSON(
        `${BASE}/users`,
        { method: "POST", headers: headerFor(u.uid), body: JSON.stringify(u) },
        201,
      ).catch(async (e) => {
        if (!e.message.includes("409")) throw e;
      });
    }

    const boardsByUser = {};
    console.log("Creating boards …");
    for (const u of users) {
      boardsByUser[u.uid] = [];
      for (let i = 1; i <= 2; i++) {
        const b = await fetchJSON(
          `${BASE}/boards`,
          {
            method: "POST",
            headers: headerFor(u.uid),
            body: JSON.stringify({ name: `${u.name} Board ${i}` }),
          },
          201,
        );
        boardsByUser[u.uid].push(b.id);
      }
    }

    const listsByBoard = {};
    console.log("Creating lists …");
    for (const { uid } of users) {
      for (const boardId of boardsByUser[uid]) {
        listsByBoard[boardId] = [];
        for (let j = 0; j < 2; j++) {
          const list = await fetchJSON(
            `${BASE}/boards/${boardId}/lists`,
            {
              method: "POST",
              headers: headerFor(uid),
              body: JSON.stringify({
                title: `List ${j + 1}`,
                position: j,
                columnPos: j,
                color: ["#D8B4FE", "#A5F3FC"][j],
              }),
            },
            201,
          );
          listsByBoard[boardId].push(list.id);
        }
      }
    }

    const cardsByList = {};
    console.log("Creating cards …");
    for (const { uid } of users) {
      for (const boardId of boardsByUser[uid]) {
        for (const listId of listsByBoard[boardId]) {
          cardsByList[listId] = [];
          for (let k = 0; k < 2; k++) {
            const card = await fetchJSON(
              `${BASE}/boards/${boardId}/lists/${listId}/cards`,
              {
                method: "POST",
                headers: headerFor(uid),
                body: JSON.stringify({
                  title: `Card ${k + 1}`,
                  description: `Seeded card ${k + 1}`,
                  position: k,
                }),
              },
              201,
            );
            cardsByList[listId].push(card.id);
          }
        }
      }
    }

    console.log("Updating one board / list / card …");
    {
      const tester = users[0].uid;
      const boardId = boardsByUser[tester][0];
      const listId = listsByBoard[boardId][0];
      const cardId = cardsByList[listId][0];

      await fetchJSON(
        `${BASE}/boards/${boardId}`,
        {
          method: "PUT",
          headers: headerFor(tester),
          body: JSON.stringify({ name: "Renamed via seed script" }),
        },
        200,
      );

      await fetchJSON(
        `${BASE}/boards/${boardId}/lists/${listId}`,
        {
          method: "PUT",
          headers: headerFor(tester),
          body: JSON.stringify({
            title: "Updated List Title",
            color: "#FDE68A",
          }),
        },
        200,
      );

      await fetchJSON(
        `${BASE}/boards/${boardId}/lists/${listId}/cards/${cardId}`,
        {
          method: "PUT",
          headers: headerFor(tester),
          body: JSON.stringify({ description: "Edited via seed script" }),
        },
        200,
      );
    }

    console.log("Deleting card, then list, then whole board …");
    {
      const tester = users[1].uid;
      const boardId = boardsByUser[tester][0];
      const listId = listsByBoard[boardId][0];
      const cardId = cardsByList[listId][0];

      await fetchJSON(
        `${BASE}/boards/${boardId}/lists/${listId}/cards/${cardId}`,
        { method: "DELETE", headers: headerFor(tester) },
        204,
      );

      await fetchJSON(
        `${BASE}/boards/${boardId}/lists/${listId}`,
        { method: "DELETE", headers: headerFor(tester) },
        204,
      );

      await fetchJSON(
        `${BASE}/boards/${boardId}`,
        { method: "DELETE", headers: headerFor(tester) },
        204,
      );
    }

    console.log("✅ Seed + CRUD smoke test complete.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
})();
