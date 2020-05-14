const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

const isJsonLDReference = (obj: any) => obj["@id"] && Object.keys(obj).length === 1;

// may create circular data-structure (probably not common in rml though)
const jsonLDGraphToObj = (graph: any[], deleteReplaced = false) => {
  if (graph.some((n) => !n["@id"])) {
    throw new Error("node without id");
  }
  const replacedIds = [];
  const obj = Object.fromEntries(graph.map((node) => [node["@id"], node]));
  for (const id in obj) {
    for (const key in obj[id]) {
      if (Array.isArray(obj[id][key])) {
        // case array, else single obj
        for (const index in obj[id][key]) {
          if (isJsonLDReference(obj[id][key][index]) && obj[obj[id][key][index]["@id"]]) {
            // if its reference and the reference id is included in the graph
            replacedIds.push(obj[id][key][index]["@id"]);
            obj[id][key][index] = obj[obj[id][key][index]["@id"]];
          }
        }
      } else if (isJsonLDReference(obj[id][key]) && obj[obj[id][key]["@id"]]) {
        // if its reference and the reference id is included in the graph
        replacedIds.push(obj[id][key]["@id"]);
        obj[id][key] = obj[obj[id][key]["@id"]];
      }
    }
  }
  if (deleteReplaced) {
    // console.log(replacedIds);
    for (const deleteId of replacedIds) {
      delete obj[deleteId]; // only deletes the reference to the replaced object not those where the object was inserted into
    }
  }
  return Object.values(obj);
};

export const replace = (graph: any) => {
  const connectedGraph = jsonLDGraphToObj(graph, true);
  // test for circular deps & remove links
  try {
    const graphCopy = clone(connectedGraph);
    return graphCopy;
  } catch (e) {
    console.error("Could not replace, circular dependencies when replacing nodes");
    return graph;
  }
};
